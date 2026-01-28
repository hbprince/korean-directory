import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

export async function GET() {
  try {
    // Build sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Homepage
    xml += `  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

    // Get all city/state/category combinations that have businesses (count > 0)
    // L1: Primary categories
    const primaryCategoryCounts = await prisma.business.groupBy({
      by: ['city', 'state', 'primaryCategoryId'],
      _count: true,
    });

    // Get category slugs
    const categories = await prisma.category.findMany({
      select: { id: true, slug: true, level: true },
    });
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // Track unique URLs to avoid duplicates
    const addedUrls = new Set<string>();

    // L1 pages (primary categories with results)
    for (const item of primaryCategoryCounts) {
      const category = categoryMap.get(item.primaryCategoryId);
      if (!category || category.level !== 'primary') continue;

      const citySlug = item.city.toLowerCase().replace(/\s+/g, '-');
      const stateSlug = item.state.toLowerCase();
      const url = `${BASE_URL}/${stateSlug}/${citySlug}/${category.slug}`;

      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        xml += `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    }

    // L2: Subcategories with results
    const subcategoryCounts = await prisma.business.groupBy({
      by: ['city', 'state', 'subcategoryId'],
      _count: true,
      where: {
        subcategoryId: { not: null },
      },
    });

    for (const item of subcategoryCounts) {
      if (!item.subcategoryId) continue;
      const category = categoryMap.get(item.subcategoryId);
      if (!category || category.level !== 'sub') continue;

      const citySlug = item.city.toLowerCase().replace(/\s+/g, '-');
      const stateSlug = item.state.toLowerCase();
      const url = `${BASE_URL}/${stateSlug}/${citySlug}/${category.slug}`;

      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        xml += `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    // L3 pages (only indexable ones)
    const indexableBusinesses = await prisma.business.findMany({
      where: {
        slug: { not: null },
        googlePlace: {
          rating: { gte: 4.2 },
          userRatingsTotal: { gte: 10 },
          fetchStatus: 'ok',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      take: 10000, // Limit to prevent huge sitemaps
    });

    for (const biz of indexableBusinesses) {
      if (biz.slug) {
        xml += `  <url>
    <loc>${BASE_URL}/biz/${biz.slug}</loc>
    <lastmod>${biz.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
    }

    xml += '</urlset>';

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
