/**
 * API endpoint to update RadioKorea categories from v2 crawl
 * POST /api/update-radiokorea-categories?secret=fix-categories-2024
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { mapRadioKoreaCategory } from '@/lib/taxonomy/categoryMapping';

// V2 category data embedded - key categories only for the fix
const V2_CATEGORY_FIXES: Record<string, string> = {
  // Locksmith businesses - A16 in v2 = 열쇠/금고/락스미스
  'A16': 'home-services',
  // Travel - A15 in v2 = 여행사/관광
  'A15': 'travel',
};

interface SourceKey {
  source: string;
  uid: string;
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== 'fix-categories-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting RadioKorea category update...');

    // Get all categories
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map(c => [c.slug, c.id]));

    // Get all RadioKorea businesses
    const dbBusinesses = await prisma.business.findMany({
      select: {
        id: true,
        nameKo: true,
        nameEn: true,
        primaryCategoryId: true,
        subcategoryId: true,
        sourceKeys: true,
        primaryCategory: { select: { slug: true, nameKo: true } },
      }
    });

    const stats = {
      total: 0,
      updated: 0,
      unchanged: 0,
    };

    const transitions: Map<string, { count: number; examples: string[] }> = new Map();

    for (const biz of dbBusinesses) {
      const sourceKeys = biz.sourceKeys as SourceKey[] | null;
      if (!sourceKeys) continue;

      const radiokoreaKey = sourceKeys.find(sk => sk.source === 'radiokorea');
      if (!radiokoreaKey) continue;

      stats.total++;

      // Detect category from business name (locksmith detection)
      const combinedName = `${biz.nameKo} ${biz.nameEn || ''}`.toUpperCase();

      let newPrimarySlug: string | null = null;
      let newSubSlug: string | null = null;

      // Locksmith detection
      if (combinedName.includes('열쇠') ||
          combinedName.includes('LOCKSMITH') ||
          combinedName.includes('LOCK & SAFE') ||
          combinedName.includes('LOCK&SAFE') ||
          combinedName.includes('락스미스')) {
        newPrimarySlug = 'home-services';
        newSubSlug = 'locksmith';
      }
      // Travel agency detection (exclude locksmiths)
      else if ((combinedName.includes('여행사') ||
                combinedName.includes('TRAVEL') ||
                combinedName.includes('TOUR')) &&
               !combinedName.includes('열쇠') &&
               !combinedName.includes('LOCK')) {
        newPrimarySlug = 'travel';
        newSubSlug = 'travel-agency';
      }

      if (!newPrimarySlug) {
        stats.unchanged++;
        continue;
      }

      const newPrimaryCategoryId = categoryMap.get(newPrimarySlug);
      const newSubcategoryId = newSubSlug ? categoryMap.get(newSubSlug) : null;

      if (!newPrimaryCategoryId) continue;

      // Check if update needed
      if (biz.primaryCategoryId === newPrimaryCategoryId) {
        stats.unchanged++;
        continue;
      }

      // Track transition
      const fromCat = biz.primaryCategory?.nameKo || 'unknown';
      const key = `${fromCat} -> ${newPrimarySlug}`;

      if (!transitions.has(key)) {
        transitions.set(key, { count: 0, examples: [] });
      }
      const trans = transitions.get(key)!;
      trans.count++;
      if (trans.examples.length < 5) {
        trans.examples.push(`${biz.nameKo} | ${biz.nameEn}`);
      }

      // Update
      await prisma.business.update({
        where: { id: biz.id },
        data: {
          primaryCategoryId: newPrimaryCategoryId,
          subcategoryId: newSubcategoryId,
        }
      });
      stats.updated++;
    }

    // Get final counts
    const categoryCounts = await prisma.business.groupBy({
      by: ['primaryCategoryId'],
      _count: true,
      orderBy: { _count: { primaryCategoryId: 'desc' } }
    });

    const finalCounts = categoryCounts.map(count => {
      const cat = categories.find(c => c.id === count.primaryCategoryId);
      return {
        category: cat?.nameKo || 'unknown',
        slug: cat?.slug,
        count: count._count
      };
    });

    return NextResponse.json({
      success: true,
      stats,
      transitions: Array.from(transitions.entries()).map(([key, val]) => ({
        transition: key,
        count: val.count,
        examples: val.examples
      })),
      finalCounts
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
