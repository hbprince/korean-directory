import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import {
  isMalformedCity,
  buildValidUrl,
} from '@/lib/seo/slug-utils';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

// Minimum business count to include a category page in sitemap
// Matches MIN_LISTINGS_FOR_INDEX in meta.ts to prevent thin content
const MIN_BUSINESS_COUNT = 3;

export async function GET() {
  try {
    const urls: Array<{ loc: string; lastmod?: string }> = [];
    const addedUrls = new Set<string>();
    let skippedMalformed = 0;

    // Get the latest business update date for lastmod
    const latestBusiness = await prisma.business.findFirst({
      where: { countryCode: 'US' },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    const defaultLastmod = latestBusiness?.updatedAt
      ? latestBusiness.updatedAt.toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const categories = await prisma.category.findMany({
      select: { id: true, slug: true, level: true },
    });
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // US Primary Categories
    const usPrimaryCounts = await prisma.business.groupBy({
      by: ['city', 'state', 'primaryCategoryId'],
      _count: { _all: true },
      where: { countryCode: 'US' },
    });

    for (const item of usPrimaryCounts) {
      if (!item._count._all || !item.city || !item.state || !item.primaryCategoryId) continue;
      if (item._count._all < MIN_BUSINESS_COUNT) continue;

      // Skip malformed city names (e.g., "ST BREA", "RD BURLINGAME")
      if (isMalformedCity(item.city)) {
        skippedMalformed++;
        continue;
      }

      const category = categoryMap.get(item.primaryCategoryId);
      if (!category || category.level !== 'primary' || !category.slug) continue;

      const url = buildValidUrl(BASE_URL, item.state, item.city, category.slug);
      if (!url || addedUrls.has(url)) continue;

      addedUrls.add(url);
      urls.push({ loc: url, lastmod: defaultLastmod });
    }

    // US Subcategories
    const usSubCounts = await prisma.business.groupBy({
      by: ['city', 'state', 'subcategoryId'],
      _count: { _all: true },
      where: { countryCode: 'US', subcategoryId: { not: null } },
    });

    for (const item of usSubCounts) {
      if (!item._count._all || !item.subcategoryId || !item.city || !item.state) continue;
      if (item._count._all < MIN_BUSINESS_COUNT) continue;

      // Skip malformed city names
      if (isMalformedCity(item.city)) {
        skippedMalformed++;
        continue;
      }

      const category = categoryMap.get(item.subcategoryId);
      if (!category || category.level !== 'sub' || !category.slug) continue;

      const url = buildValidUrl(BASE_URL, item.state, item.city, category.slug);
      if (!url || addedUrls.has(url)) continue;

      addedUrls.add(url);
      urls.push({ loc: url, lastmod: defaultLastmod });
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const url of urls) {
      xml += `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>
`;
    }

    xml += '</urlset>';

    console.log(`US Categories sitemap: ${urls.length} URLs (skipped ${skippedMalformed} malformed)`);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('US Categories sitemap error:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}
