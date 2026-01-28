import { Metadata } from 'next';
import { getCityNameKo } from '@/lib/i18n/labels';

const SITE_NAME = '한인맵 HaninMap';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.haninmap.com';

/**
 * Generate metadata for L1 (state/city/primary-category) pages
 */
export function generateL1Metadata(params: {
  city: string;
  state: string;
  categoryNameEn: string;
  categoryNameKo: string;
  count: number;
  categorySlug?: string;
}): Metadata {
  const { city, state, categoryNameEn, categoryNameKo, count, categorySlug } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const cityKo = getCityNameKo(city);
  const stateDisplay = state.toUpperCase();

  // English-first title with Korean
  const title = `Korean ${categoryNameEn} in ${cityDisplay}, ${stateDisplay} | ${cityKo} ${categoryNameKo} (한국어)`;
  const description = count > 0
    ? `Browse ${count} Korean-speaking ${categoryNameEn.toLowerCase()} in ${cityDisplay}. ${cityKo} 한인 ${categoryNameKo} ${count}곳. 전화번호, 주소, 리뷰.`
    : `Find Korean-speaking ${categoryNameEn.toLowerCase()} in ${cityDisplay}, ${stateDisplay}. ${cityKo} 한인 ${categoryNameKo}.`;

  // noindex for 0-result pages
  const robots = count === 0 ? 'noindex,follow' : 'index,follow';

  // Use slug if provided, otherwise derive from name
  const slug = categorySlug || categoryNameEn.toLowerCase().replace(/\s+/g, '-');
  const canonicalUrl = `${BASE_URL}/${state.toLowerCase()}/${city.toLowerCase()}/${slug}`;

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate metadata for L2 (subcategory) pages
 */
export function generateL2Metadata(params: {
  city: string;
  state: string;
  subcategoryNameEn: string;
  subcategoryNameKo: string;
  primaryCategoryNameEn: string;
  count: number;
  subcategorySlug?: string;
}): Metadata {
  const { city, state, subcategoryNameEn, subcategoryNameKo, count, subcategorySlug } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const cityKo = getCityNameKo(city);
  const stateDisplay = state.toUpperCase();

  // English-first title with Korean
  const title = `Korean ${subcategoryNameEn} in ${cityDisplay}, ${stateDisplay} | ${cityKo} ${subcategoryNameKo} (한국어)`;
  const description = count > 0
    ? `Find ${count} Korean-speaking ${subcategoryNameEn.toLowerCase()} in ${cityDisplay}. ${cityKo} 한인 ${subcategoryNameKo} ${count}곳. 전화번호, 주소, 리뷰.`
    : `Find Korean-speaking ${subcategoryNameEn.toLowerCase()} in ${cityDisplay}, ${stateDisplay}. ${cityKo} 한인 ${subcategoryNameKo}.`;

  // noindex for 0-result pages
  const robots = count === 0 ? 'noindex,follow' : 'index,follow';

  // Use slug if provided, otherwise derive from name
  const slug = subcategorySlug || subcategoryNameEn.toLowerCase().replace(/\s+/g, '-');
  const canonicalUrl = `${BASE_URL}/${state.toLowerCase()}/${city.toLowerCase()}/${slug}`;

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
      url: canonicalUrl,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Generate metadata for L3 (business detail) pages
 */
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
  const { businessName, city, state, categoryNameEn, slug, hasGooglePlace, rating, reviewCount } = params;
  const cityDisplay = toTitleCase(city.replace(/-/g, ' '));
  const stateDisplay = state.toUpperCase();

  const title = `${businessName} | Korean ${categoryNameEn} in ${cityDisplay}`;
  let description = `${businessName} - Korean ${categoryNameEn.toLowerCase()} serving ${cityDisplay}, ${stateDisplay}.`;

  if (hasGooglePlace && rating && reviewCount) {
    description += ` Rated ${rating.toFixed(1)}/5 based on ${reviewCount} reviews.`;
  }

  description += ` Contact info, hours, and directions.`;

  // Determine if page should be indexed
  const shouldIndex = shouldIndexL3({ hasGooglePlace, rating, reviewCount });

  return {
    title,
    description,
    robots: shouldIndex ? 'index,follow' : 'noindex,follow',
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: `${BASE_URL}/biz/${slug}`,
    },
  };
}

/**
 * Determine if an L3 page should be indexed
 */
export function shouldIndexL3(params: {
  hasGooglePlace: boolean;
  rating?: number;
  reviewCount?: number;
}): boolean {
  const { hasGooglePlace, rating, reviewCount } = params;

  if (!hasGooglePlace) return false;
  if (!rating || !reviewCount) return false;
  if (rating >= 4.2 && reviewCount >= 10) return true;

  return false;
}

/**
 * Generate LocalBusiness JSON-LD schema
 */
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
  website?: string | null;
  rating?: number | null;
  reviewCount?: number | null;
  slug: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    alternateName: business.nameKo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip || undefined,
      addressCountry: 'US',
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

  if (business.website) {
    schema.sameAs = business.website;
  }

  if (business.rating && business.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate ItemList JSON-LD schema for list pages
 */
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

/**
 * Convert string to title case
 */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
