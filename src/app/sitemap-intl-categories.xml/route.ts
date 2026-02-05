import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getAllCountries } from '@/lib/i18n/countries';
import {
  normalizeSlug,
  normalizeCitySlug,
  isMalformedCity,
} from '@/lib/seo/slug-utils';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

// Minimum business count to include a category page in sitemap
// Matches MIN_LISTINGS_FOR_INDEX in meta.ts to prevent thin content
const MIN_BUSINESS_COUNT = 3;

function buildIntlUrl(
  countrySlug: string,
  region: string | null | undefined,
  city: string | null | undefined,
  categorySlug: string | null | undefined
): string | null {
  const regionNorm = normalizeSlug(region);
  const cityNorm = normalizeCitySlug(city);
  const catNorm = normalizeSlug(categorySlug);
  const countryNorm = normalizeSlug(countrySlug);

  if (!countryNorm || !regionNorm || !cityNorm || !catNorm) {
    return null;
  }

  const path = `${countryNorm}/${regionNorm}/${cityNorm}/${catNorm}`;
  if (path.includes('//')) return null;

  return `${BASE_URL}/${path}`;
}

export async function GET() {
  try {
    const urls: Array<{ loc: string; changefreq: string; priority: string }> = [];
    const addedUrls = new Set<string>();
    let skippedMalformed = 0;

    const categories = await prisma.category.findMany({
      select: { id: true, slug: true, level: true },
    });
    const categoryMap = new Map(categories.map(c => [c.id, c]));

    const intlCountries = getAllCountries();

    for (const countryConfig of intlCountries) {
      // Primary categories
      const intlPrimaryCounts = await prisma.business.groupBy({
        by: ['city', 'state', 'primaryCategoryId'],
        _count: { _all: true },
        where: { countryCode: countryConfig.code },
      });

      for (const item of intlPrimaryCounts) {
        if (!item._count._all || !item.city || !item.state || !item.primaryCategoryId) continue;
        if (item._count._all < MIN_BUSINESS_COUNT) continue;

        // Skip malformed city names
        if (isMalformedCity(item.city)) {
          skippedMalformed++;
          continue;
        }

        const category = categoryMap.get(item.primaryCategoryId);
        if (!category || category.level !== 'primary' || !category.slug) continue;

        const url = buildIntlUrl(countryConfig.slug, item.state, item.city, category.slug);
        if (!url || addedUrls.has(url)) continue;

        addedUrls.add(url);
        urls.push({ loc: url, changefreq: 'weekly', priority: '0.7' });
      }

      // Subcategories
      const intlSubCounts = await prisma.business.groupBy({
        by: ['city', 'state', 'subcategoryId'],
        _count: { _all: true },
        where: { countryCode: countryConfig.code, subcategoryId: { not: null } },
      });

      for (const item of intlSubCounts) {
        if (!item._count._all || !item.subcategoryId || !item.city || !item.state) continue;
        if (item._count._all < MIN_BUSINESS_COUNT) continue;

        // Skip malformed city names
        if (isMalformedCity(item.city)) {
          skippedMalformed++;
          continue;
        }

        const category = categoryMap.get(item.subcategoryId);
        if (!category || category.level !== 'sub' || !category.slug) continue;

        const url = buildIntlUrl(countryConfig.slug, item.state, item.city, category.slug);
        if (!url || addedUrls.has(url)) continue;

        addedUrls.add(url);
        urls.push({ loc: url, changefreq: 'weekly', priority: '0.6' });
      }
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const url of urls) {
      xml += `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
    }

    xml += '</urlset>';

    console.log(`International Categories sitemap: ${urls.length} URLs (skipped ${skippedMalformed} malformed)`);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('International Categories sitemap error:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}
