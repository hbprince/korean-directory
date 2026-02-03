import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getAllCountries } from '@/lib/i18n/countries';

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

    // Get category slugs
    const categories = await prisma.category.findMany({
      select: { id: true, slug: true, level: true },
    });
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    // Track unique URLs to avoid duplicates
    const addedUrls = new Set<string>();
    addedUrls.add(BASE_URL);

    // ─── US pages (existing, countryCode = 'US') ───

    const usPrimaryCategoryCounts = await prisma.business.groupBy({
      by: ['city', 'state', 'primaryCategoryId'],
      _count: { _all: true },
      where: { countryCode: 'US' },
    });

    // L1 pages (primary categories with results > 0)
    for (const item of usPrimaryCategoryCounts) {
      if (!item._count._all) continue;
      if (!item.city || !item.state || !item.primaryCategoryId) continue;
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

    // L2: US Subcategories with results
    const usSubcategoryCounts = await prisma.business.groupBy({
      by: ['city', 'state', 'subcategoryId'],
      _count: { _all: true },
      where: {
        countryCode: 'US',
        subcategoryId: { not: null },
      },
    });

    for (const item of usSubcategoryCounts) {
      if (!item._count._all) continue;
      if (!item.subcategoryId || !item.city || !item.state) continue;
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

    // ─── International pages ───

    const intlCountries = getAllCountries();

    for (const countryConfig of intlCountries) {
      const intlPrimaryCounts = await prisma.business.groupBy({
        by: ['city', 'state', 'primaryCategoryId'],
        _count: { _all: true },
        where: { countryCode: countryConfig.code },
      });

      for (const item of intlPrimaryCounts) {
        if (!item._count._all) continue;
        if (!item.city || !item.state || !item.primaryCategoryId) continue;
        if (item.city.toLowerCase() === 'unknown') continue;

        const category = categoryMap.get(item.primaryCategoryId);
        if (!category || category.level !== 'primary' || !category.slug) continue;

        // International URL: /{countrySlug}/{region}/{city}/{category}
        const url = buildUrl(countryConfig.slug, item.state, item.city, category.slug);
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

      // International subcategories
      const intlSubCounts = await prisma.business.groupBy({
        by: ['city', 'state', 'subcategoryId'],
        _count: { _all: true },
        where: {
          countryCode: countryConfig.code,
          subcategoryId: { not: null },
        },
      });

      for (const item of intlSubCounts) {
        if (!item._count._all) continue;
        if (!item.subcategoryId || !item.city || !item.state) continue;
        if (item.city.toLowerCase() === 'unknown') continue;

        const category = categoryMap.get(item.subcategoryId);
        if (!category || category.level !== 'sub' || !category.slug) continue;

        const url = buildUrl(countryConfig.slug, item.state, item.city, category.slug);
        if (!url) continue;

        if (!addedUrls.has(url)) {
          addedUrls.add(url);
          urls.push({
            loc: url,
            changefreq: 'weekly',
            priority: '0.6',
          });
        }
      }
    }

    // ─── L3 pages (all countries - slugs are globally unique) ───

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

    // Fallback: serve at least the static URLs so sitemap never returns 5xx
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/regions</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new NextResponse(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }
}
