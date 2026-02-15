import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.haninmap.com';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    { loc: BASE_URL, lastmod: today },
    { loc: `${BASE_URL}/regions`, lastmod: today },
    { loc: `${BASE_URL}/alerts`, lastmod: today },
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
