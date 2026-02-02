/**
 * Promotion pipeline: moves StagedBusiness records (unique/master) to the
 * production Business table for a given country code.
 *
 * Default mode is DRY RUN — pass --apply for live writes.
 *
 * Usage: imported by scripts/promote-ca.ts and scripts/promote-au.ts
 */

import { PrismaClient } from '@prisma/client';
import { initCategoryCache, resolveCategory } from './category-resolver';
import { generateSlug } from '../../src/lib/ingestion/normalize';
import {
  calculateQualityScore,
  namesSimilar,
  addressesSimilar,
  mergeSourceKeys,
  type SourceKey,
} from '../../src/lib/dedupe/dedupe';

const prisma = new PrismaClient();

// ─── Options ────────────────────────────────────────────────────────

export interface PromoteOptions {
  dryRun?: boolean;      // defaults to true (safe)
  limit?: number;
  crawlRunId?: number;
}

// ─── Types ──────────────────────────────────────────────────────────

interface SkipRecord {
  id: number;
  name: string;
  reason: string;
}

interface PromotionStats {
  processed: number;
  insertedNew: number;
  updatedExisting: number;
  skipped: number;
  errors: number;
  unmappedCategories: Map<string, number>;
  skipReasons: Map<string, number>;
  regionDistribution: Map<string, number>;
  cityDistribution: Map<string, number>;
  sourceDistribution: Map<string, number>;
}

function newStats(): PromotionStats {
  return {
    processed: 0,
    insertedNew: 0,
    updatedExisting: 0,
    skipped: 0,
    errors: 0,
    unmappedCategories: new Map(),
    skipReasons: new Map(),
    regionDistribution: new Map(),
    cityDistribution: new Map(),
    sourceDistribution: new Map(),
  };
}

// ─── Main ───────────────────────────────────────────────────────────

export async function promoteCountry(
  countryCode: string,
  options: PromoteOptions = {},
): Promise<void> {
  const { dryRun = true, limit, crawlRunId } = options;

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  Promotion Pipeline: ${countryCode}`);
  console.log(`  Mode: ${dryRun ? '🔍 DRY RUN (no DB changes)' : '⚡ LIVE (writing to DB)'}`);
  if (limit) console.log(`  Limit: ${limit} records`);
  if (crawlRunId) console.log(`  CrawlRunId filter: ${crawlRunId}`);
  console.log(`${'═'.repeat(60)}\n`);

  // Initialize category cache
  await initCategoryCache(prisma);
  console.log('Category cache loaded.');

  // Create PromotionRun record (skip in dry run)
  let runId: number | null = null;
  if (!dryRun) {
    const run = await prisma.promotionRun.create({
      data: { countryCode, status: 'running' },
    });
    runId = run.id;
    console.log(`PromotionRun #${runId} created.`);
  }

  const stats = newStats();
  const skippedSample: SkipRecord[] = [];

  try {
    // Query eligible StagedBusiness records
    const where: Record<string, unknown> = {
      countryCode,
      dedupeStatus: { in: ['unique', 'master'] },
      promotionStatus: 'pending',
    };

    // If crawlRunId is specified, find matching rawBusinessIds
    if (crawlRunId) {
      const rawIds = await prisma.rawBusiness.findMany({
        where: { crawlRunId },
        select: { id: true },
      });
      const rawIdSet = rawIds.map(r => r.id);
      if (rawIdSet.length > 0) {
        where.rawBusinessId = { in: rawIdSet };
      } else {
        console.log('No RawBusiness records found for crawlRunId', crawlRunId);
        return;
      }
    }

    const totalEligible = await prisma.stagedBusiness.count({ where });
    console.log(`Found ${totalEligible} eligible records.\n`);

    const batchSize = 100;
    const maxRecords = limit ?? totalEligible;
    let cursor: number | undefined;
    let fetched = 0;

    while (fetched < maxRecords) {
      const take = Math.min(batchSize, maxRecords - fetched);

      const stagedRecords = await prisma.stagedBusiness.findMany({
        where,
        orderBy: { id: 'asc' },
        take,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      });

      if (stagedRecords.length === 0) break;

      for (const staged of stagedRecords) {
        cursor = staged.id;
        stats.processed++;
        fetched++;

        try {
          await processRecord(staged, countryCode, stats, skippedSample, dryRun);
        } catch (err) {
          stats.errors++;
          const msg = err instanceof Error ? err.message : String(err);
          console.error(`  ERROR processing StagedBusiness #${staged.id}: ${msg}`);
        }
      }

      // Progress update every batch (compact)
      if (!dryRun || stats.processed % 500 === 0) {
        const pct = ((stats.processed / maxRecords) * 100).toFixed(1);
        console.log(
          `  [${pct}%] ${stats.processed}/${maxRecords} ` +
          `(new: ${stats.insertedNew}, merge: ${stats.updatedExisting}, skip: ${stats.skipped})`
        );
      }
    }

    // ─── Print Report ───
    printReport(countryCode, stats, skippedSample, dryRun);

    // Update PromotionRun
    if (runId && !dryRun) {
      await prisma.promotionRun.update({
        where: { id: runId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          totalProcessed: stats.processed,
          totalPromoted: stats.insertedNew + stats.updatedExisting,
          totalSkipped: stats.skipped,
          totalErrors: stats.errors,
          skippedSample: skippedSample.slice(0, 20),
        },
      });
      console.log(`\nPromotionRun #${runId} completed.`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\nFATAL ERROR: ${msg}`);

    if (runId && !dryRun) {
      await prisma.promotionRun.update({
        where: { id: runId },
        data: {
          status: 'failed',
          completedAt: new Date(),
          totalProcessed: stats.processed,
          totalPromoted: stats.insertedNew + stats.updatedExisting,
          totalSkipped: stats.skipped,
          totalErrors: stats.errors,
          errorLog: msg,
        },
      });
    }

    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

// ─── Report ─────────────────────────────────────────────────────────

function printReport(
  countryCode: string,
  stats: PromotionStats,
  skippedSample: SkipRecord[],
  dryRun: boolean,
): void {
  const total = stats.insertedNew + stats.updatedExisting;
  const divider = '─'.repeat(50);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  PROMOTION REPORT: ${countryCode} ${dryRun ? '(DRY RUN)' : '(LIVE)'}`);
  console.log(`${'═'.repeat(60)}`);

  // ── Summary ──
  console.log(`\n${divider}`);
  console.log('  Summary');
  console.log(divider);
  console.log(`  Total processed:      ${stats.processed}`);
  console.log(`  ├─ Inserted (new):    ${stats.insertedNew}`);
  console.log(`  ├─ Updated (merge):   ${stats.updatedExisting}`);
  console.log(`  ├─ Excluded (skip):   ${stats.skipped}`);
  console.log(`  └─ Errors:            ${stats.errors}`);
  console.log(`  Promotion rate:       ${stats.processed > 0 ? ((total / stats.processed) * 100).toFixed(1) : 0}%`);

  // ── Skip Reasons ──
  if (stats.skipReasons.size > 0) {
    console.log(`\n${divider}`);
    console.log('  Exclusion Reasons');
    console.log(divider);
    const sorted = Array.from(stats.skipReasons.entries()).sort((a, b) => b[1] - a[1]);
    for (const [reason, count] of sorted) {
      console.log(`  ${reason}: ${count}`);
    }
  }

  // ── Unmapped Categories ──
  if (stats.unmappedCategories.size > 0) {
    console.log(`\n${divider}`);
    console.log(`  Unmapped Categories (top 30) — total ${stats.unmappedCategories.size} unique`);
    console.log(divider);
    const sorted = Array.from(stats.unmappedCategories.entries())
      .sort((a, b) => b[1] - a[1]);
    for (const [cat, count] of sorted.slice(0, 30)) {
      console.log(`  ${cat}: ${count}`);
    }
  }

  // ── Source Distribution ──
  if (stats.sourceDistribution.size > 0) {
    console.log(`\n${divider}`);
    console.log('  Source Distribution');
    console.log(divider);
    const sorted = Array.from(stats.sourceDistribution.entries()).sort((a, b) => b[1] - a[1]);
    for (const [source, count] of sorted) {
      console.log(`  ${source}: ${count}`);
    }
  }

  // ── Region Distribution ──
  if (stats.regionDistribution.size > 0) {
    console.log(`\n${divider}`);
    console.log('  Region/State Distribution');
    console.log(divider);
    const sorted = Array.from(stats.regionDistribution.entries()).sort((a, b) => b[1] - a[1]);
    for (const [region, count] of sorted) {
      console.log(`  ${region}: ${count}`);
    }
  }

  // ── City Distribution (top 30) ──
  if (stats.cityDistribution.size > 0) {
    console.log(`\n${divider}`);
    console.log(`  City Distribution (top 30 of ${stats.cityDistribution.size})`);
    console.log(divider);
    const sorted = Array.from(stats.cityDistribution.entries()).sort((a, b) => b[1] - a[1]);
    for (const [city, count] of sorted.slice(0, 30)) {
      console.log(`  ${city}: ${count}`);
    }
  }

  // ── Skipped Sample ──
  if (skippedSample.length > 0) {
    console.log(`\n${divider}`);
    console.log(`  Skipped Sample (first ${Math.min(20, skippedSample.length)})`);
    console.log(divider);
    for (const s of skippedSample.slice(0, 20)) {
      console.log(`  #${s.id} "${s.name}": ${s.reason}`);
    }
  }

  console.log(`\n${'═'.repeat(60)}\n`);
}

// ─── Process a single staged record ─────────────────────────────────

async function processRecord(
  staged: {
    id: number;
    countryCode: string;
    sourceName: string;
    sourceUid: string;
    nameKo: string | null;
    nameEn: string | null;
    phoneE164: string | null;
    phoneRaw: string | null;
    addressRaw: string | null;
    addressNorm: string | null;
    city: string | null;
    region: string | null;
    postalCode: string | null;
    lat: number | null;
    lng: number | null;
    primaryCategory: string | null;
    subcategory: string | null;
    website: string | null;
    email: string | null;
  },
  countryCode: string,
  stats: PromotionStats,
  skippedSample: SkipRecord[],
  dryRun: boolean,
): Promise<void> {

  // Track source distribution
  const src = staged.sourceName || '(unknown)';
  stats.sourceDistribution.set(src, (stats.sourceDistribution.get(src) ?? 0) + 1);

  // ─── Validate: need at least one name ───
  const displayName = staged.nameKo || staged.nameEn || '(no name)';

  if (!staged.nameKo && !staged.nameEn) {
    skip(stats, skippedSample, staged.id, displayName, 'missing name (ko AND en)', dryRun);
    return;
  }

  if (!staged.phoneE164 && !staged.addressNorm) {
    skip(stats, skippedSample, staged.id, displayName, 'missing phone AND address', dryRun);
    return;
  }

  // Track region/city distribution (only for records that pass validation)
  const region = staged.region || '(unknown)';
  const city = staged.city || '(unknown)';
  stats.regionDistribution.set(region, (stats.regionDistribution.get(region) ?? 0) + 1);
  stats.cityDistribution.set(city, (stats.cityDistribution.get(city) ?? 0) + 1);

  // ─── Resolve category ───
  const resolved = resolveCategory(staged.primaryCategory);
  if (!resolved.mapped) {
    const cat = staged.primaryCategory ?? '(null)';
    stats.unmappedCategories.set(cat, (stats.unmappedCategories.get(cat) ?? 0) + 1);
  }

  // Also try resolving subcategory if not already resolved
  let subcategoryId = resolved.subId;
  if (!subcategoryId && staged.subcategory) {
    const subResolved = resolveCategory(staged.subcategory);
    if (subResolved.subId) {
      subcategoryId = subResolved.subId;
    }
  }

  // ─── Cross-dedupe against existing Business ───
  const sourceKey: SourceKey = {
    source: staged.sourceName as SourceKey['source'],
    uid: staged.sourceUid,
  };

  const nameForMatch = staged.nameKo || staged.nameEn!;
  const existingBusiness = await findExistingBusiness(
    countryCode,
    staged.phoneE164,
    nameForMatch,
    staged.city,
    staged.addressNorm,
  );

  if (dryRun) {
    if (existingBusiness) {
      stats.updatedExisting++;
    } else {
      stats.insertedNew++;
    }
    return;
  }

  // ─── LIVE mode ───
  if (existingBusiness) {
    // Merge into existing Business (preserve existing, fill gaps)
    const existingKeys = (existingBusiness.sourceKeys ?? []) as SourceKey[];
    const mergedKeys = mergeSourceKeys(existingKeys, [sourceKey]);

    await prisma.business.update({
      where: { id: existingBusiness.id },
      data: {
        sourceKeys: mergedKeys,
        ...((!existingBusiness.nameEn && staged.nameEn) ? { nameEn: staged.nameEn } : {}),
        ...((!existingBusiness.phoneE164 && staged.phoneE164) ? {
          phoneE164: staged.phoneE164,
          phoneRaw: staged.phoneRaw,
        } : {}),
        ...((!existingBusiness.addressNorm && staged.addressNorm) ? {
          addressNorm: staged.addressNorm,
        } : {}),
        ...((!existingBusiness.lat && staged.lat) ? {
          lat: staged.lat,
          lng: staged.lng,
        } : {}),
        ...((!existingBusiness.zip && staged.postalCode) ? { zip: staged.postalCode } : {}),
      },
    });

    stats.updatedExisting++;
  } else {
    // Create new Business
    const newBusiness = await prisma.business.create({
      data: {
        nameKo: staged.nameKo ?? staged.nameEn!,
        nameEn: staged.nameEn,
        phoneE164: staged.phoneE164,
        phoneRaw: staged.phoneRaw,
        addressRaw: staged.addressRaw ?? staged.addressNorm ?? '',
        addressNorm: staged.addressNorm,
        city: staged.city ?? 'Unknown',
        state: staged.region ?? 'Unknown',
        zip: staged.postalCode,
        countryCode,
        lat: staged.lat,
        lng: staged.lng,
        primaryCategoryId: resolved.primaryId,
        subcategoryId,
        sourceKeys: [sourceKey],
        qualityScore: calculateQualityScore({
          nameEn: staged.nameEn,
          phoneE164: staged.phoneE164,
          addressNorm: staged.addressNorm,
          lat: staged.lat,
          lng: staged.lng,
          zip: staged.postalCode,
          sourceKeys: [sourceKey],
        }),
      },
    });

    // Generate and set slug
    const slug = generateSlug(
      staged.nameKo ?? staged.nameEn!,
      staged.nameEn,
      newBusiness.id,
    );
    await prisma.business.update({
      where: { id: newBusiness.id },
      data: { slug },
    });

    stats.insertedNew++;
  }

  // Mark StagedBusiness as promoted
  await prisma.stagedBusiness.update({
    where: { id: staged.id },
    data: { promotionStatus: 'promoted' },
  });
}

// ─── Skip helper ────────────────────────────────────────────────────

async function skip(
  stats: PromotionStats,
  skippedSample: SkipRecord[],
  id: number,
  name: string,
  reason: string,
  dryRun: boolean,
): Promise<void> {
  stats.skipped++;
  stats.skipReasons.set(reason, (stats.skipReasons.get(reason) ?? 0) + 1);

  if (skippedSample.length < 20) {
    skippedSample.push({ id, name, reason });
  }

  if (!dryRun) {
    await prisma.stagedBusiness.update({
      where: { id },
      data: { promotionStatus: 'skipped' },
    });
  }
}

// ─── Cross-dedupe helper ────────────────────────────────────────────

async function findExistingBusiness(
  countryCode: string,
  phoneE164: string | null,
  name: string,
  city: string | null,
  addressNorm: string | null,
): Promise<{
  id: number;
  nameKo: string;
  nameEn: string | null;
  phoneE164: string | null;
  addressNorm: string | null;
  lat: number | null;
  lng: number | null;
  zip: string | null;
  sourceKeys: unknown;
} | null> {
  const selectFields = {
    id: true,
    nameKo: true,
    nameEn: true,
    phoneE164: true,
    addressNorm: true,
    lat: true,
    lng: true,
    zip: true,
    sourceKeys: true,
  } as const;

  // 1. Check by phone (strongest signal)
  if (phoneE164) {
    const byPhone = await prisma.business.findFirst({
      where: { countryCode, phoneE164 },
      select: selectFields,
    });
    if (byPhone) return byPhone;
  }

  // 2. Check by name + city (fuzzy, 92% threshold)
  if (city) {
    const candidates = await prisma.business.findMany({
      where: { countryCode, city },
      select: selectFields,
    });

    for (const candidate of candidates) {
      if (namesSimilar(name, candidate.nameKo, 0.92)) {
        // If both have addresses, also check address similarity
        if (addressNorm && candidate.addressNorm) {
          if (addressesSimilar(addressNorm, candidate.addressNorm, 0.80)) {
            return candidate;
          }
        } else {
          // No address to compare — name + city match
          return candidate;
        }
      }
    }
  }

  return null;
}
