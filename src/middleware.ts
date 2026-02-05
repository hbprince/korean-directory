import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for handling URL redirects and normalization
 *
 * Primary purpose: Redirect malformed city slugs to correct URLs
 * Example: /ca/st-brea/dental → /ca/brea/dental (301)
 */

// Street type prefixes that indicate malformed city slugs
const STREET_TYPE_PREFIXES = [
  'st',
  'rd',
  'blvd',
  'ave',
  'dr',
  'ct',
  'ln',
  'pl',
  'cir',
  'hwy',
  'pkwy',
  'real',
  'way',
  'ter',
];

// Pattern to detect malformed city slugs
const STREET_PREFIX_PATTERN = new RegExp(
  `^(${STREET_TYPE_PREFIXES.join('|')})-(.+)$`,
  'i'
);

/**
 * Extract correct city from malformed slug
 * "st-brea" → "brea"
 * "rd-burlingame" → "burlingame"
 */
function extractCorrectCity(citySlug: string): string | null {
  const match = citySlug.match(STREET_PREFIX_PATTERN);
  if (match && match[2] && match[2].length >= 2) {
    return match[2];
  }
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only process category page URLs: /state/city/category or /country/region/city/category
  // US pattern: /ca/los-angeles/dental
  const usPattern = /^\/([a-z]{2})\/([a-z0-9-]+)\/([a-z0-9-]+)$/i;
  // International pattern: /australia/nsw/sydney/dental
  const intlPattern = /^\/(australia|canada)\/([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)$/i;

  // Check US pattern
  const usMatch = pathname.match(usPattern);
  if (usMatch) {
    const [, state, city, category] = usMatch;

    // Check if city slug is malformed
    const correctCity = extractCorrectCity(city);
    if (correctCity) {
      const newUrl = new URL(`/${state}/${correctCity}/${category}`, request.url);
      console.log(`[Middleware] Redirect: ${pathname} → ${newUrl.pathname}`);
      return NextResponse.redirect(newUrl, { status: 301 });
    }
  }

  // Check International pattern
  const intlMatch = pathname.match(intlPattern);
  if (intlMatch) {
    const [, country, region, city, category] = intlMatch;

    // Check if city slug is malformed
    const correctCity = extractCorrectCity(city);
    if (correctCity) {
      const newUrl = new URL(`/${country}/${region}/${correctCity}/${category}`, request.url);
      console.log(`[Middleware] Redirect: ${pathname} → ${newUrl.pathname}`);
      return NextResponse.redirect(newUrl, { status: 301 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match US category pages: /ca/city/category
    '/:state([a-z]{2})/:city/:category',
    // Match international category pages: /country/region/city/category
    '/:country(australia|canada)/:region/:city/:category',
  ],
};
