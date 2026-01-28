import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { PRIMARY_CATEGORIES } from '@/lib/taxonomy/categories';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function GET() {
  try {
    // Get all unique city/state combinations
    const locations = await prisma.business.groupBy({
      by: ['city', 'state'],
      _count: true,
      orderBy: { _count: { city: 'desc' } },
    });

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

    // L1 pages (state/city/primary-category)
    for (const loc of locations) {
      const citySlug = loc.city.toLowerCase().replace(/\s+/g, '-');
      const stateSlug = loc.state.toLowerCase();

      for (const category of PRIMARY_CATEGORIES) {
        xml += `  <url>
    <loc>${BASE_URL}/${stateSlug}/${citySlug}/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

        // L2 pages (subcategories)
        for (const sub of category.subcategories) {
          xml += `  <url>
    <loc>${BASE_URL}/${stateSlug}/${citySlug}/${sub.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        }
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
