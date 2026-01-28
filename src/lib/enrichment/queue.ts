import prisma from '../db/prisma';
import { canMakeApiCall } from './budget';

export type EnrichmentReason = 'seed' | 'traffic' | 'user_click';

/**
 * Add a business to the enrichment queue
 */
export async function enqueueForEnrichment(
  businessId: number,
  reason: EnrichmentReason,
  priority: number = 0
): Promise<boolean> {
  // Check budget first
  if (!(await canMakeApiCall())) {
    console.log('Budget exhausted, cannot enqueue for enrichment');
    return false;
  }

  // Check if already enriched
  const existingPlace = await prisma.googlePlace.findUnique({
    where: { businessId },
  });

  if (existingPlace && existingPlace.fetchStatus === 'ok') {
    // Already enriched successfully
    return false;
  }

  // Check if already in queue
  const existingQueue = await prisma.enrichmentQueue.findFirst({
    where: {
      businessId,
      status: { in: ['pending', 'processing'] },
    },
  });

  if (existingQueue) {
    // Update priority if new priority is higher
    if (priority > existingQueue.priority) {
      await prisma.enrichmentQueue.update({
        where: { id: existingQueue.id },
        data: { priority },
      });
    }
    return true;
  }

  // Add to queue
  await prisma.enrichmentQueue.create({
    data: {
      businessId,
      reason,
      priority,
      status: 'pending',
    },
  });

  return true;
}

/**
 * Get next batch of items from the enrichment queue
 */
export async function getNextQueueBatch(batchSize: number = 10) {
  return prisma.enrichmentQueue.findMany({
    where: {
      status: 'pending',
      scheduledAt: { lte: new Date() },
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    take: batchSize,
  });
}

/**
 * Mark queue item as processing
 */
export async function markProcessing(queueId: number): Promise<void> {
  await prisma.enrichmentQueue.update({
    where: { id: queueId },
    data: { status: 'processing' },
  });
}

/**
 * Mark queue item as done
 */
export async function markDone(queueId: number): Promise<void> {
  await prisma.enrichmentQueue.update({
    where: { id: queueId },
    data: { status: 'done' },
  });
}

/**
 * Mark queue item as failed with retry logic
 */
export async function markFailed(queueId: number, error: string, maxAttempts: number = 3): Promise<void> {
  const item = await prisma.enrichmentQueue.findUnique({
    where: { id: queueId },
  });

  if (!item) return;

  const newAttempts = item.attempts + 1;

  if (newAttempts >= maxAttempts) {
    // Max retries reached, mark as permanently failed
    await prisma.enrichmentQueue.update({
      where: { id: queueId },
      data: {
        status: 'failed',
        attempts: newAttempts,
        lastError: error,
      },
    });
  } else {
    // Schedule retry with exponential backoff
    const backoffMinutes = Math.pow(2, newAttempts) * 5; // 10, 20, 40 minutes
    const nextSchedule = new Date(Date.now() + backoffMinutes * 60 * 1000);

    await prisma.enrichmentQueue.update({
      where: { id: queueId },
      data: {
        status: 'pending',
        attempts: newAttempts,
        lastError: error,
        scheduledAt: nextSchedule,
      },
    });
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  const [pending, processing, done, failed] = await Promise.all([
    prisma.enrichmentQueue.count({ where: { status: 'pending' } }),
    prisma.enrichmentQueue.count({ where: { status: 'processing' } }),
    prisma.enrichmentQueue.count({ where: { status: 'done' } }),
    prisma.enrichmentQueue.count({ where: { status: 'failed' } }),
  ]);

  return { pending, processing, done, failed, total: pending + processing + done + failed };
}

/**
 * Seed enrichment queue with top businesses
 */
export async function seedEnrichmentQueue(): Promise<number> {
  const seedRegions = JSON.parse(process.env.ENRICHMENT_SEED_REGIONS || '["los-angeles"]');
  const seedCategories = JSON.parse(
    process.env.ENRICHMENT_SEED_CATEGORIES || '["medical","dental","insurance","legal","real-estate"]'
  );

  // Get category IDs for seed categories
  const categories = await prisma.category.findMany({
    where: { slug: { in: seedCategories } },
    select: { id: true },
  });

  const categoryIds = categories.map((c) => c.id);

  // Get top businesses in seed regions/categories
  const topBusinesses = await prisma.business.findMany({
    where: {
      primaryCategoryId: { in: categoryIds },
      city: {
        in: seedRegions.map((r: string) => r.toUpperCase().replace(/-/g, ' ')),
      },
    },
    orderBy: { qualityScore: 'desc' },
    take: 500,
    select: { id: true },
  });

  let enqueued = 0;
  for (const biz of topBusinesses) {
    const success = await enqueueForEnrichment(biz.id, 'seed', 100);
    if (success) enqueued++;
  }

  return enqueued;
}
