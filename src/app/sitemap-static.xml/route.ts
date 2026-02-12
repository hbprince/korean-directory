import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

export async function GET() {
  const urls = [
    { loc: BASE_URL, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/regions`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${BASE_URL}/alerts`, changefreq: 'weekly', priority: '0.7' },
  ];

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

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
