import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.haninmap.com';

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /*?

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
