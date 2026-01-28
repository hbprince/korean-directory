import { NextRequest, NextResponse } from 'next/server';
import { processEnrichmentQueue } from '@/lib/enrichment/googlePlaces';
import { getBudgetStatus } from '@/lib/enrichment/budget';
import { getQueueStats } from '@/lib/enrichment/queue';

/**
 * GET /api/cron/enrich
 * Process enrichment queue - called by Vercel Cron
 *
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/enrich",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  // Verify cron secret in production
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Process queue
    const result = await processEnrichmentQueue(10);

    // Get status info
    const budget = await getBudgetStatus();
    const queue = await getQueueStats();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      succeeded: result.succeeded,
      failed: result.failed,
      budget: {
        spent: `$${budget.spentUsd.toFixed(2)}`,
        remaining: `$${budget.remainingUsd.toFixed(2)}`,
        percentUsed: budget.percentUsed,
      },
      queue: {
        pending: queue.pending,
        done: queue.done,
        failed: queue.failed,
      },
    });
  } catch (error) {
    console.error('Cron enrich error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
