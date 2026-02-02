/**
 * Country configuration for multi-country routing.
 *
 * URL structure:
 *   US:        /{state}/{city}/{category}       (unchanged)
 *   Canada:    /canada/{region}/{city}/{category}
 *   Australia: /australia/{region}/{city}/{category}
 */

export interface CountryConfig {
  code: string;         // ISO country code (CA, AU)
  slug: string;         // URL slug (canada, australia)
  nameEn: string;
  nameKo: string;
  addressCountry: string; // For JSON-LD schema.org
  regions: Record<string, string>;       // Abbreviation → English name
  regionNameKo: Record<string, string>;  // Abbreviation → Korean name
  majorCities: Record<string, string>;   // UPPERCASE city → Korean name
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  canada: {
    code: 'CA',
    slug: 'canada',
    nameEn: 'Canada',
    nameKo: '캐나다',
    addressCountry: 'CA',
    regions: {
      ON: 'Ontario',
      BC: 'British Columbia',
      AB: 'Alberta',
      MB: 'Manitoba',
      SK: 'Saskatchewan',
      QC: 'Quebec',
      NS: 'Nova Scotia',
      NB: 'New Brunswick',
      NL: 'Newfoundland and Labrador',
      PE: 'Prince Edward Island',
      NT: 'Northwest Territories',
      NU: 'Nunavut',
      YT: 'Yukon',
    },
    regionNameKo: {
      ON: '온타리오',
      BC: '브리티시컬럼비아',
      AB: '앨버타',
      MB: '매니토바',
      SK: '서스캐처원',
      QC: '퀘벡',
      NS: '노바스코샤',
      NB: '뉴브런즈윅',
      NL: '뉴펀들랜드',
      PE: '프린스에드워드아일랜드',
      NT: '노스웨스트준주',
      NU: '누나부트',
      YT: '유콘',
    },
    majorCities: {
      TORONTO: '토론토',
      'NORTH YORK': '노스요크',
      SCARBOROUGH: '스카보로',
      ETOBICOKE: '에토비코',
      MISSISSAUGA: '미시사가',
      MARKHAM: '마캄',
      'RICHMOND HILL': '리치몬드힐',
      VAUGHAN: '본',
      BRAMPTON: '브램턴',
      OAKVILLE: '오크빌',
      BURLINGTON: '벌링턴',
      HAMILTON: '해밀턴',
      LONDON: '런던',
      OTTAWA: '오타와',
      KITCHENER: '키치너',
      WATERLOO: '워터루',
      VANCOUVER: '밴쿠버',
      BURNABY: '버나비',
      SURREY: '서레이',
      RICHMOND: '리치몬드',
      COQUITLAM: '코퀴틀럼',
      'NEW WESTMINSTER': '뉴웨스트민스터',
      'NORTH VANCOUVER': '노스밴쿠버',
      'WEST VANCOUVER': '웨스트밴쿠버',
      LANGLEY: '랭리',
      ABBOTSFORD: '애보츠포드',
      KELOWNA: '켈로나',
      VICTORIA: '빅토리아',
      CALGARY: '캘거리',
      EDMONTON: '에드먼턴',
      WINNIPEG: '위니펙',
      MONTREAL: '몬트리올',
    },
  },
  australia: {
    code: 'AU',
    slug: 'australia',
    nameEn: 'Australia',
    nameKo: '호주',
    addressCountry: 'AU',
    regions: {
      NSW: 'New South Wales',
      VIC: 'Victoria',
      QLD: 'Queensland',
      WA: 'Western Australia',
      SA: 'South Australia',
      TAS: 'Tasmania',
      ACT: 'Australian Capital Territory',
      NT: 'Northern Territory',
    },
    regionNameKo: {
      NSW: '뉴사우스웨일스',
      VIC: '빅토리아',
      QLD: '퀸즐랜드',
      WA: '서호주',
      SA: '남호주',
      TAS: '태즈메이니아',
      ACT: '캔버라수도준주',
      NT: '노던테리토리',
    },
    majorCities: {
      SYDNEY: '시드니',
      MELBOURNE: '멜버른',
      BRISBANE: '브리즈번',
      PERTH: '퍼스',
      ADELAIDE: '애들레이드',
      'GOLD COAST': '골드코스트',
      CANBERRA: '캔버라',
      HOBART: '호바트',
      DARWIN: '다윈',
      NEWCASTLE: '뉴캐슬',
      WOLLONGONG: '울릉공',
      GEELONG: '질롱',
      CAIRNS: '케언즈',
      TOWNSVILLE: '타운즈빌',
      STRATHFIELD: '스트라스필드',
      EASTWOOD: '이스트우드',
      CHATSWOOD: '챗스우드',
      CAMPSIE: '캠시',
      BURWOOD: '버우드',
    },
  },
};

// ─── Lookup helpers ─────────────────────────────────────────────────

/** Map of URL slug → country config */
const SLUG_MAP = new Map(
  Object.values(COUNTRY_CONFIGS).map(c => [c.slug, c])
);

/** Map of ISO code → country config */
const CODE_MAP = new Map(
  Object.values(COUNTRY_CONFIGS).map(c => [c.code, c])
);

/**
 * Get country config by URL slug (e.g., "canada" → CA config).
 * Returns null if not a valid international country slug.
 */
export function getCountryBySlug(slug: string): CountryConfig | null {
  return SLUG_MAP.get(slug.toLowerCase()) ?? null;
}

/**
 * Get country config by ISO code (e.g., "CA" → Canada config).
 */
export function getCountryByCode(code: string): CountryConfig | null {
  return CODE_MAP.get(code.toUpperCase()) ?? null;
}

/**
 * Get the Korean name of a city in a given country.
 * Falls back to title-cased English name.
 */
export function getIntlCityNameKo(city: string, countrySlug: string): string {
  const config = COUNTRY_CONFIGS[countrySlug];
  if (!config) return toTitleCase(city);

  const upper = city.toUpperCase().replace(/-/g, ' ');
  return config.majorCities[upper] ?? toTitleCase(city.replace(/-/g, ' '));
}

/**
 * Get the Korean name of a region in a given country.
 */
export function getIntlRegionNameKo(regionCode: string, countrySlug: string): string {
  const config = COUNTRY_CONFIGS[countrySlug];
  if (!config) return regionCode;

  return config.regionNameKo[regionCode.toUpperCase()] ?? regionCode;
}

/**
 * Get the English name of a region in a given country.
 */
export function getIntlRegionNameEn(regionCode: string, countrySlug: string): string {
  const config = COUNTRY_CONFIGS[countrySlug];
  if (!config) return regionCode;

  return config.regions[regionCode.toUpperCase()] ?? regionCode;
}

/**
 * Check if a string is a valid international country slug.
 */
export function isCountrySlug(slug: string): boolean {
  return SLUG_MAP.has(slug.toLowerCase());
}

/**
 * Get all country configs as an array.
 */
export function getAllCountries(): CountryConfig[] {
  return Object.values(COUNTRY_CONFIGS);
}

// Helper
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
