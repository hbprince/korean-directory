import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

function normalizeSlug(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null;
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!normalized || normalized === 'undefined' || normalized === 'null') {
    return null;
  }
  return normalized;
}

export async function GET() {
  try {
    const urls: Array<{ loc: string; changefreq: string; priority: string; lastmod?: string }> = [];
    const addedUrls = new Set<string>();

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
      if (addedUrls.has(url)) continue;

      addedUrls.add(url);
      urls.push({
        loc: url,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: biz.updatedAt.toISOString().split('T')[0],
      });
    }

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

    console.log(`Businesses sitemap: ${urls.length} URLs`);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Businesses sitemap error:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { 'Content-Type': 'application/xml' } }
    );
  }
}
