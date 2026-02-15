import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

export async function GET() {
  // Fetch all published guides
  const guides = await prisma.guideContent.findMany({
    where: {
      status: 'published',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      slug: 'asc',
    },
  });

  const latestGuide = guides.length > 0
    ? guides.reduce((latest, g) => g.updatedAt > latest.updatedAt ? g : latest).updatedAt
    : new Date();

  const urls = [
    {
      loc: `${BASE_URL}/guides`,
      lastmod: latestGuide.toISOString().split('T')[0],
    },
    ...guides.map(guide => ({
      loc: `${BASE_URL}/guides/${guide.slug}`,
      lastmod: guide.updatedAt.toISOString().split('T')[0],
    })),
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const url of urls) {
    xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>
`;
  }

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
