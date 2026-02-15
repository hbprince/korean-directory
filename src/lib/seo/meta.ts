import { Metadata } from 'next';
import { getCityNameKo } from '@/lib/i18n/labels';

const SITE_NAME = '한인맵 HaninMap';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.haninmap.com';

// ─── Title / Meta helpers ──────────────────────────────────────────

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Build canonical URL from path segments */
export function canonicalUrl(...segments: string[]): string {
  return `${BASE_URL}/${segments.map(s => s.toLowerCase()).join('/')}`;
}

/** Shared hreflang alternates – single bilingual page, ko primary */
function hreflangAlternates(url: string) {
  return {
    canonical: url,
    languages: {
      'ko': url,
      'x-default': url,
    },
  };
}

// Minimum business count for a category page to be indexed
// Pages with fewer listings are considered "thin content" and should be noindex
const MIN_LISTINGS_FOR_INDEX = 3;

// ─── L1 Metadata (primary category pages) ──────────────────────────

export function generateL1Metadata(params: {
  city: string;
  state: string;
  categoryNameEn: string;
  categoryNameKo: string;
  count: number;
  categorySlug?: string;
  categoryDescriptionKo?: string;
  categoryDescriptionEn?: string;
  page?: number;
}): Metadata {
  const { city, state, categoryNameEn, categoryNameKo, count, categorySlug, categoryDescriptionKo, categoryDescriptionEn, page } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const cityKo = getCityNameKo(city);
  const stateDisplay = state.toUpperCase();

  // Title under 60 chars: "{cityKo} 한인 {categoryKo} {count}곳 | 한인맵"
  const title = count > 0
    ? `${cityKo} 한인 ${categoryNameKo} ${count}곳 | 한인맵`
    : `${cityKo} 한인 ${categoryNameKo} | 한인맵`;

  // Description under 155 chars
  let description: string;
  if (categoryDescriptionKo && count > 0) {
    description = `${cityKo} ${categoryDescriptionKo.slice(0, 80)} ${count}곳. 전화번호, 주소, 평점.`;
  } else {
    description = count > 0
      ? `${cityKo} 한인 ${categoryNameKo} ${count}곳. Korean ${categoryNameEn.toLowerCase()} in ${cityDisplay}, ${stateDisplay}. 전화번호, 주소, 평점.`
      : `${cityKo} 한인 ${categoryNameKo}. Korean ${categoryNameEn.toLowerCase()} in ${cityDisplay}, ${stateDisplay}.`;
  }

  const slug = categorySlug || categoryNameEn.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = canonicalUrl(state, city, slug);
  const url = page && page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

  // noindex thin content pages (fewer than MIN_LISTINGS_FOR_INDEX businesses)
  const robots = count >= MIN_LISTINGS_FOR_INDEX ? 'index,follow' : 'noindex,follow';

  return {
    title: { absolute: title },
    description,
    robots,
    twitter: { card: 'summary' },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
    },
    alternates: hreflangAlternates(url),
  };
}

// ─── L2 Metadata (subcategory pages) ───────────────────────────────

export function generateL2Metadata(params: {
  city: string;
  state: string;
  subcategoryNameEn: string;
  subcategoryNameKo: string;
  primaryCategoryNameEn: string;
  count: number;
  subcategorySlug?: string;
  subcategoryDescriptionKo?: string;
  subcategoryDescriptionEn?: string;
  page?: number;
}): Metadata {
  const { city, state, subcategoryNameEn, subcategoryNameKo, count, subcategorySlug, subcategoryDescriptionKo, subcategoryDescriptionEn, page } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const cityKo = getCityNameKo(city);
  const stateDisplay = state.toUpperCase();

  const title = count > 0
    ? `${cityKo} 한인 ${subcategoryNameKo} ${count}곳 | 한인맵`
    : `${cityKo} 한인 ${subcategoryNameKo} | 한인맵`;

  let description: string;
  if (subcategoryDescriptionKo && count > 0) {
    description = `${cityKo} ${subcategoryDescriptionKo.slice(0, 80)} ${count}곳. 전화번호, 주소, 평점.`;
  } else {
    description = count > 0
      ? `${cityKo} 한인 ${subcategoryNameKo} ${count}곳. Korean ${subcategoryNameEn.toLowerCase()} in ${cityDisplay}, ${stateDisplay}. 전화번호, 주소, 평점.`
      : `${cityKo} 한인 ${subcategoryNameKo}. Korean ${subcategoryNameEn.toLowerCase()} in ${cityDisplay}, ${stateDisplay}.`;
  }

  const slug = subcategorySlug || subcategoryNameEn.toLowerCase().replace(/\s+/g, '-');
  const baseUrl = canonicalUrl(state, city, slug);
  const url = page && page > 1 ? `${baseUrl}?page=${page}` : baseUrl;

  // noindex thin content pages (fewer than MIN_LISTINGS_FOR_INDEX businesses)
  const robots = count >= MIN_LISTINGS_FOR_INDEX ? 'index,follow' : 'noindex,follow';

  return {
    title: { absolute: title },
    description,
    robots,
    twitter: { card: 'summary' },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
    },
    alternates: hreflangAlternates(url),
  };
}

// ─── L3 Metadata (business detail pages) ───────────────────────────

export function generateL3Metadata(params: {
  businessName: string;
  city: string;
  state: string;
  categoryNameEn: string;
  categoryNameKo: string;
  slug: string;
  hasGooglePlace: boolean;
  rating?: number;
  reviewCount?: number;
}): Metadata {
  const { businessName, city, categoryNameKo, slug, hasGooglePlace, rating, reviewCount } = params;
  const cityKo = getCityNameKo(city);

  // Tightened title: business name + city KO
  const title = `${businessName} | ${cityKo} ${categoryNameKo}`;

  let description = `${businessName} - ${cityKo} 한인 ${categoryNameKo}.`;
  if (hasGooglePlace && rating && reviewCount) {
    description += ` 평점 ${rating.toFixed(1)}/5 (${reviewCount}개 리뷰).`;
  }
  description += ` 전화번호, 주소, 영업시간 안내.`;

  const url = `${BASE_URL}/biz/${slug}`;

  // Only index high-quality pages (rating >= 4.2, reviews >= 10)
  // Low-quality pages are still accessible but not indexed to prevent thin content issues
  const shouldIndex = shouldIndexL3({ hasGooglePlace, rating, reviewCount });
  const robots = shouldIndex ? 'index,follow' : 'noindex,follow';

  return {
    title,
    description,
    robots,
    twitter: { card: 'summary' },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url,
    },
    alternates: hreflangAlternates(url),
  };
}

export function shouldIndexL3(params: {
  hasGooglePlace: boolean;
  rating?: number;
  reviewCount?: number;
}): boolean {
  const { hasGooglePlace, rating, reviewCount } = params;
  if (!hasGooglePlace) return false;
  if (!rating || !reviewCount) return false;
  return rating >= 4.2 && reviewCount >= 10;
}

// ─── JSON-LD: BreadcrumbList ───────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── JSON-LD: ItemList ─────────────────────────────────────────────

export function generateItemListSchema(
  businesses: Array<{
    name: string;
    slug: string;
    position: number;
  }>,
  pageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: pageUrl,
    numberOfItems: businesses.length,
    itemListElement: businesses.map((biz) => ({
      '@type': 'ListItem',
      position: biz.position,
      name: biz.name,
      url: `${BASE_URL}/biz/${biz.slug}`,
    })),
  };
}

// ─── LocalBusiness @type mapping by category ─────────────────────

const CATEGORY_SCHEMA_TYPE: Record<string, string> = {
  medical: 'MedicalBusiness',
  dental: 'Dentist',
  legal: 'LegalService',
  food: 'Restaurant',
  'real-estate': 'RealEstateAgent',
  insurance: 'InsuranceAgency',
  financial: 'FinancialService',
  education: 'EducationalOrganization',
  beauty: 'BeautySalon',
  auto: 'AutoRepair',
  'home-services': 'HomeAndConstructionBusiness',
  travel: 'TravelAgency',
  shopping: 'Store',
};

// ─── JSON-LD: LocalBusiness (enhanced) ─────────────────────────────

export function generateLocalBusinessSchema(business: {
  name: string;
  nameKo: string;
  address: string;
  city: string;
  state: string;
  zip?: string | null;
  phone?: string | null;
  lat?: number | null;
  lng?: number | null;
  categoryNameEn: string;
  categorySlug?: string;
  website?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  slug: string;
  imageUrl?: string | null;
  googleMapsUrl?: string | null;
  openingHoursText?: string[] | null;
  addressCountry?: string;
}) {
  const schemaType = (business.categorySlug && CATEGORY_SCHEMA_TYPE[business.categorySlug]) || 'LocalBusiness';
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: business.name,
    alternateName: business.nameKo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip || undefined,
      addressCountry: business.addressCountry ?? 'US',
    },
    url: `${BASE_URL}/biz/${business.slug}`,
  };

  if (business.phone) {
    schema.telephone = business.phone;
  }

  if (business.lat && business.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.lat,
      longitude: business.lng,
    };
  }

  if (business.imageUrl) {
    schema.image = business.imageUrl;
  }

  // sameAs: Google Maps URL + website
  const sameAs: string[] = [];
  if (business.googleMapsUrl) sameAs.push(business.googleMapsUrl);
  if (business.website) sameAs.push(business.website);
  if (sameAs.length === 1) {
    schema.sameAs = sameAs[0];
  } else if (sameAs.length > 1) {
    schema.sameAs = sameAs;
  }

  if (business.rating && business.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
      bestRating: 5,
    };
  }

  // openingHoursSpecification from text (basic)
  if (business.openingHoursText && business.openingHoursText.length > 0) {
    schema.openingHours = business.openingHoursText;
  }

  return schema;
}

// ─── JSON-LD: FAQPage ──────────────────────────────────────────────

export function buildFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ─── Breadcrumb helpers (data, not schema) ─────────────────────────

export function buildCategoryBreadcrumbs(params: {
  state: string;
  city: string;
  categoryNameEn: string;
  categoryNameKo: string;
  categorySlug: string;
}): BreadcrumbItem[] {
  const { state, city, categoryNameEn, categoryNameKo, categorySlug } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const cityKo = getCityNameKo(city);
  const stateDisplay = state.toUpperCase();

  return [
    { name: '홈 (Home)', url: BASE_URL },
    { name: `${stateDisplay} ${categoryNameKo}`, url: canonicalUrl(state, 'all', categorySlug) },
    { name: `${cityKo} (${cityDisplay})`, url: canonicalUrl(state, city, categorySlug) },
  ];
}

export function buildBusinessBreadcrumbs(params: {
  state: string;
  city: string;
  categoryNameEn: string;
  categoryNameKo: string;
  categorySlug: string;
  businessName: string;
  businessSlug: string;
}): BreadcrumbItem[] {
  const { state, city, categoryNameEn, categoryNameKo, categorySlug, businessName, businessSlug } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const cityKo = getCityNameKo(city);
  const stateDisplay = state.toUpperCase();

  return [
    { name: '홈 (Home)', url: BASE_URL },
    { name: `${stateDisplay} ${categoryNameKo}`, url: canonicalUrl(state, 'all', categorySlug) },
    { name: `${cityKo} (${cityDisplay})`, url: canonicalUrl(state, city, categorySlug) },
    { name: businessName, url: `${BASE_URL}/biz/${businessSlug}` },
  ];
}
