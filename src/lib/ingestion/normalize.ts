// Normalization utilities for phone numbers and addresses

/**
 * Normalize phone number to E.164 format (+1XXXXXXXXXX for US)
 */
export function normalizePhone(phone: string | null | undefined): { e164: string | null; raw: string } {
  if (!phone) return { e164: null, raw: '' };

  const raw = phone.trim();

  // Remove all non-digit characters
  const digits = raw.replace(/\D/g, '');

  // Handle common formats
  if (digits.length === 10) {
    // Standard US number: 2135551234
    return { e164: `+1${digits}`, raw };
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US with country code: 12135551234
    return { e164: `+${digits}`, raw };
  } else if (digits.length === 7) {
    // Local number without area code - can't normalize
    return { e164: null, raw };
  }

  // If we have more than 11 digits or other edge cases, return null
  return { e164: null, raw };
}

/**
 * Parse address into components
 */
export interface AddressComponents {
  raw: string;
  normalized: string;
  city: string;
  state: string;
  zip: string | null;
}

// Common abbreviation expansions for address normalization
const ADDRESS_ABBREVIATIONS: Record<string, string> = {
  'ST': 'STREET',
  'AVE': 'AVENUE',
  'BLVD': 'BOULEVARD',
  'RD': 'ROAD',
  'DR': 'DRIVE',
  'LN': 'LANE',
  'CT': 'COURT',
  'PL': 'PLACE',
  'CIR': 'CIRCLE',
  'HWY': 'HIGHWAY',
  'PKWY': 'PARKWAY',
  'SQ': 'SQUARE',
  'TER': 'TERRACE',
  'WAY': 'WAY',
  'N': 'NORTH',
  'S': 'SOUTH',
  'E': 'EAST',
  'W': 'WEST',
  'NE': 'NORTHEAST',
  'NW': 'NORTHWEST',
  'SE': 'SOUTHEAST',
  'SW': 'SOUTHWEST',
};

/**
 * Normalize address for matching purposes
 * Removes suite/unit info and standardizes abbreviations
 */
export function normalizeAddress(address: string): string {
  let normalized = address.toUpperCase().trim();

  // Remove suite/unit designators for matching
  normalized = normalized.replace(/\s*(SUITE|STE|UNIT|APT|#|ROOM|RM|FLOOR|FL)\s*[A-Z0-9-]+/gi, '');

  // Expand abbreviations
  for (const [abbrev, full] of Object.entries(ADDRESS_ABBREVIATIONS)) {
    // Match abbreviations at word boundaries
    const regex = new RegExp(`\\b${abbrev}\\.?\\b`, 'g');
    normalized = normalized.replace(regex, full);
  }

  // Remove extra whitespace
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Remove trailing punctuation
  normalized = normalized.replace(/[.,]+$/, '');

  return normalized;
}

/**
 * Parse address string to extract city, state, zip
 */
export function parseAddress(address: string): AddressComponents {
  const raw = address.trim();
  const normalized = normalizeAddress(raw);

  // Default values
  let city = '';
  let state = 'CA';
  let zip: string | null = null;

  // Try to parse standard US address format: "123 Main St, City, ST 12345"
  // or "123 Main St City, ST 12345"

  // Extract zip code first (5 digits or 5+4 format)
  const zipMatch = raw.match(/\b(\d{5})(?:-\d{4})?\s*$/);
  if (zipMatch) {
    zip = zipMatch[1];
  }

  // Extract state (2-letter abbreviation before zip)
  const stateMatch = raw.match(/\b([A-Z]{2})\s+\d{5}/i);
  if (stateMatch) {
    state = stateMatch[1].toUpperCase();
  }

  // Try to extract city
  // Common pattern: "Street Address, City, ST ZIP" or "Street Address City, ST ZIP"
  const cityPatterns = [
    // Pattern: ", City, ST ZIP"
    /,\s*([A-Za-z\s]+),\s*[A-Z]{2}\s+\d{5}/i,
    // Pattern: " City, ST ZIP" (no comma before city)
    /\s([A-Za-z]+(?:\s+[A-Za-z]+)?),\s*[A-Z]{2}\s+\d{5}/i,
  ];

  for (const pattern of cityPatterns) {
    const cityMatch = raw.match(pattern);
    if (cityMatch) {
      city = cityMatch[1].trim().toUpperCase();
      break;
    }
  }

  // Fallback: try to find city from known CA cities
  if (!city) {
    city = extractKnownCity(raw) || '';
  }

  return {
    raw,
    normalized,
    city,
    state,
    zip,
  };
}

// Common California cities for fallback extraction
const KNOWN_CA_CITIES = [
  'LOS ANGELES',
  'LA',
  'KOREATOWN',
  'HOLLYWOOD',
  'GLENDALE',
  'BURBANK',
  'PASADENA',
  'ARCADIA',
  'ALHAMBRA',
  'MONTEREY PARK',
  'ROWLAND HEIGHTS',
  'DIAMOND BAR',
  'FULLERTON',
  'IRVINE',
  'ANAHEIM',
  'BUENA PARK',
  'GARDEN GROVE',
  'WESTMINSTER',
  'SANTA ANA',
  'COSTA MESA',
  'NEWPORT BEACH',
  'TORRANCE',
  'GARDENA',
  'CERRITOS',
  'LA PALMA',
  'CYPRESS',
  'LONG BEACH',
  'CARSON',
  'RANCHO CUCAMONGA',
  'ONTARIO',
  'POMONA',
  'WALNUT',
  'WEST COVINA',
  'COVINA',
  'CLAREMONT',
  'LA MIRADA',
  'WHITTIER',
  'DOWNEY',
  'NORWALK',
  'LAKEWOOD',
  'PARAMOUNT',
  'BELL',
  'BELLFLOWER',
  'ARTESIA',
  'HAWAIIAN GARDENS',
  'SAN DIEGO',
  'SAN FRANCISCO',
  'SAN JOSE',
  'OAKLAND',
  'FREMONT',
  'SANTA CLARA',
  'SUNNYVALE',
  'CUPERTINO',
  'MOUNTAIN VIEW',
  'PALO ALTO',
  'MILPITAS',
  'SANTA CLARITA',
  'VALENCIA',
  'PALMDALE',
  'LANCASTER',
  'BAKERSFIELD',
  'FRESNO',
  'SACRAMENTO',
  'RIVERSIDE',
  'SAN BERNARDINO',
  'FONTANA',
  'MORENO VALLEY',
  'CORONA',
  'TEMECULA',
  'MURRIETA',
];

function extractKnownCity(address: string): string | null {
  const upperAddress = address.toUpperCase();

  for (const city of KNOWN_CA_CITIES) {
    if (upperAddress.includes(city)) {
      return city;
    }
  }

  return null;
}

/**
 * Generate URL-friendly slug from business name
 */
export function generateSlug(nameKo: string, nameEn: string | null | undefined, id: number): string {
  // Prefer English name if available
  const name = nameEn?.trim() || nameKo;

  // Convert to lowercase and replace spaces with hyphens
  let slug = name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens

  // If slug is empty (e.g., Korean-only name), use transliteration or fallback
  if (!slug || slug.length < 2) {
    slug = 'business';
  }

  // Truncate to reasonable length and append ID
  slug = slug.substring(0, 50);

  return `${slug}-${id}`;
}

/**
 * Convert city name to URL slug
 */
export function cityToSlug(city: string): string {
  return city.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Convert state abbreviation to lowercase
 */
export function stateToSlug(state: string): string {
  return state.toLowerCase();
}
