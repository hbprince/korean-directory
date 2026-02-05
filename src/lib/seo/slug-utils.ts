/**
 * SEO Slug Utilities
 *
 * Handles city/state slug normalization and validation to prevent
 * invalid URLs from being generated (e.g., "st-brea" instead of "brea")
 */

// Street type prefixes that should NOT appear at the start of city names
// These indicate malformed city data from address parsing errors
const STREET_TYPE_PREFIXES = [
  'st',      // Street
  'rd',      // Road
  'blvd',    // Boulevard
  'ave',     // Avenue
  'dr',      // Drive
  'ct',      // Court
  'ln',      // Lane
  'pl',      // Place
  'cir',     // Circle
  'hwy',     // Highway
  'pkwy',    // Parkway
  'real',    // Misparse of "Real" in street names
  'way',     // Way
  'ter',     // Terrace
];

// Pattern to match street type prefixes at the start of a slug
const STREET_PREFIX_PATTERN = new RegExp(
  `^(${STREET_TYPE_PREFIXES.join('|')})-`,
  'i'
);

// Pattern to match street type suffixes at the end (less common but possible)
const STREET_SUFFIX_PATTERN = new RegExp(
  `-(${STREET_TYPE_PREFIXES.join('|')})$`,
  'i'
);

/**
 * Normalize a city slug by removing invalid street type prefixes
 *
 * Examples:
 *   "st-brea" → "brea"
 *   "rd-burlingame" → "burlingame"
 *   "blvd-fullerton" → "fullerton"
 *   "los-angeles" → "los-angeles" (unchanged)
 */
export function normalizeCitySlug(city: string | null | undefined): string | null {
  if (!city || typeof city !== 'string') return null;

  let normalized = city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Check for invalid values
  if (!normalized || normalized === 'undefined' || normalized === 'null' || normalized === 'unknown') {
    return null;
  }

  // Remove street type prefix if present (e.g., "st-brea" → "brea")
  if (STREET_PREFIX_PATTERN.test(normalized)) {
    normalized = normalized.replace(STREET_PREFIX_PATTERN, '');
  }

  // Remove street type suffix if present (less common)
  if (STREET_SUFFIX_PATTERN.test(normalized)) {
    normalized = normalized.replace(STREET_SUFFIX_PATTERN, '');
  }

  // Final cleanup
  normalized = normalized.replace(/^-|-$/g, '');

  // Validate: city should have at least 2 characters after cleanup
  if (normalized.length < 2) {
    return null;
  }

  return normalized;
}

/**
 * Check if a city name/slug appears to be malformed
 * (contains street type prefix that was incorrectly parsed as part of city name)
 */
export function isMalformedCity(city: string | null | undefined): boolean {
  if (!city) return true;

  const slug = city.toLowerCase().trim().replace(/\s+/g, '-');

  // Check for street type prefix
  if (STREET_PREFIX_PATTERN.test(slug)) {
    return true;
  }

  // Check for other invalid patterns
  if (slug === 'unknown' || slug === 'undefined' || slug === 'null') {
    return true;
  }

  // City should be at least 2 characters
  if (slug.length < 2) {
    return true;
  }

  return false;
}

/**
 * Extract the correct city name from a malformed one
 * Returns null if extraction is not possible
 */
export function extractCorrectCity(malformedCity: string): string | null {
  const slug = malformedCity.toLowerCase().trim().replace(/\s+/g, '-');

  if (STREET_PREFIX_PATTERN.test(slug)) {
    const corrected = slug.replace(STREET_PREFIX_PATTERN, '').replace(/^-|-$/g, '');
    return corrected.length >= 2 ? corrected : null;
  }

  return null;
}

/**
 * Normalize a generic slug value
 */
export function normalizeSlug(value: string | null | undefined): string | null {
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

/**
 * Build a URL from segments, applying proper normalization
 * Returns null if any segment is invalid
 */
export function buildValidUrl(
  baseUrl: string,
  state: string | null | undefined,
  city: string | null | undefined,
  category: string | null | undefined
): string | null {
  const stateSlug = normalizeSlug(state);
  const citySlug = normalizeCitySlug(city);  // Uses city-specific normalization
  const categorySlug = normalizeSlug(category);

  if (!stateSlug || !citySlug || !categorySlug) {
    return null;
  }

  const path = `${stateSlug}/${citySlug}/${categorySlug}`;

  // Validate no double slashes
  if (path.includes('//')) {
    return null;
  }

  return `${baseUrl}/${path}`;
}

/**
 * Map of known malformed city slugs to their correct versions
 * Used for redirect handling
 */
export const CITY_SLUG_REDIRECTS: Record<string, string> = {
  'st-brea': 'brea',
  'st-lakewood': 'lakewood',
  'rd-burlingame': 'burlingame',
  'blvd-fullerton': 'fullerton',
  'real-sunnyvale': 'sunnyvale',
  'ave-tustin': 'tustin',
  'ct-chula-vista': 'chula-vista',
  'dr-san-diego': 'san-diego',
  // Add more as discovered
};

/**
 * Get redirect target for a malformed city slug
 * Returns null if no redirect is needed
 */
export function getCityRedirect(citySlug: string): string | null {
  const lower = citySlug.toLowerCase();

  // Check explicit redirect map first
  if (CITY_SLUG_REDIRECTS[lower]) {
    return CITY_SLUG_REDIRECTS[lower];
  }

  // Try to extract correct city programmatically
  return extractCorrectCity(lower);
}
