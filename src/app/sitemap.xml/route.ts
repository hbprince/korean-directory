import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Canonical base URL - MUST be https://www.haninmap.com
const BASE_URL = 'https://www.haninmap.com';

/**
 * Normalize and validate a URL path segment
 * Returns null if invalid
 */
function normalizeSlug(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null;
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // spaces to hyphens
    .replace(/-+/g, '-')       // multiple hyphens to single
    .replace(/^-|-$/g, '');    // trim leading/trailing hyphens

  // Must have content after normalization
  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return null;
  }
  return normalized;
}

/**
 * Build a valid sitemap URL
 * Returns null if any segment is invalid
 */
function buildUrl(...segments: (string | null | undefined)[]): string | null {
  const normalized = segments.map(s => normalizeSlug(s));

  // All segments must be valid
  if (normalized.some(s => s === null)) {
    return null;
  }

  const path = normalized.join('/');

  // Validate no double slashes
  if (path.includes('//')) {
    return null;
  }

  return `${BASE_URL}/${path}`;
}

export async function GET() {
  try {
    const urls: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = [];

    // Homepage
    urls.push({
      loc: BASE_URL,
      changefreq: 'daily',
      priority: '1.0',
    });

    // Regions page
    urls.push({
      loc: `${BASE_URL}/regions`,
      changefreq: 'weekly',
      priority: '0.9',
    });

    // Get all city/state/category combinations that have businesses
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
    addedUrls.add(BASE_URL);

    // L1 pages (primary categories with results > 0)
    for (const item of primaryCategoryCounts) {
      // Skip if no results
      if (!item._count || item._count === 0) continue;

      // Skip if missing required fields
      if (!item.city || !item.state || !item.primaryCategoryId) continue;

      // Skip "Unknown" cities
      if (item.city.toLowerCase() === 'unknown') continue;

      const category = categoryMap.get(item.primaryCategoryId);
      if (!category || category.level !== 'primary' || !category.slug) continue;

      const url = buildUrl(item.state, item.city, category.slug);
      if (!url) continue;

      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        urls.push({
          loc: url,
          changefreq: 'weekly',
          priority: '0.8',
        });
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
      // Skip if no results
      if (!item._count || item._count === 0) continue;

      // Skip if missing required fields
      if (!item.subcategoryId || !item.city || !item.state) continue;

      // Skip "Unknown" cities
      if (item.city.toLowerCase() === 'unknown') continue;

      const category = categoryMap.get(item.subcategoryId);
      if (!category || category.level !== 'sub' || !category.slug) continue;

      const url = buildUrl(item.state, item.city, category.slug);
      if (!url) continue;

      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        urls.push({
          loc: url,
          changefreq: 'weekly',
          priority: '0.7',
        });
      }
    }

    // L3 pages (only indexable businesses with valid slugs)
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
      take: 10000,
    });

    for (const biz of indexableBusinesses) {
      const slug = normalizeSlug(biz.slug);
      if (!slug) continue;

      const url = `${BASE_URL}/biz/${slug}`;

      if (!addedUrls.has(url)) {
        addedUrls.add(url);
        urls.push({
          loc: url,
          changefreq: 'monthly',
          priority: '0.6',
          lastmod: biz.updatedAt.toISOString().split('T')[0],
        });
      }
    }

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const url of urls) {
      xml += `  <url>
    <loc>${url.loc}</loc>`;
      if (url.lastmod) {
        xml += `
    <lastmod>${url.lastmod}</lastmod>`;
      }
      xml += `
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
    }

    xml += '</urlset>';

    // Log for debugging
    console.log(`Sitemap generated: ${urls.length} URLs`);

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
