import prisma from '../db/prisma';
import { recordApiCall, canMakeApiCall } from './budget';
import { markProcessing, markDone, markFailed, getNextQueueBatch } from './queue';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface PlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: {
    location: { lat: number; lng: number };
  };
}

interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  geometry?: {
    location: { lat: number; lng: number };
  };
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    weekday_text?: string[];
    open_now?: boolean;
  };
  website?: string;
  types?: string[];
}

/**
 * Search for a place using Google Text Search API
 */
export async function searchPlace(
  businessName: string,
  address: string
): Promise<PlaceSearchResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY not configured');
  }

  if (!(await canMakeApiCall())) {
    throw new Error('Monthly API budget exhausted');
  }

  const query = `${businessName} ${address}`;
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.set('query', query);
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

  const response = await fetch(url.toString());
  await recordApiCall('text_search');

  if (!response.ok) {
    throw new Error(`Google API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 'ZERO_RESULTS' || !data.results?.length) {
    return null;
  }

  if (data.status !== 'OK') {
    throw new Error(`Google API status: ${data.status}`);
  }

  return data.results[0];
}

/**
 * Get place details using Google Place Details API
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetailsResult | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY not configured');
  }

  if (!(await canMakeApiCall())) {
    throw new Error('Monthly API budget exhausted');
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set(
    'fields',
    'place_id,name,formatted_address,formatted_phone_number,international_phone_number,geometry,rating,user_ratings_total,opening_hours,website,types'
  );
  url.searchParams.set('key', GOOGLE_MAPS_API_KEY);

  const response = await fetch(url.toString());
  await recordApiCall('place_details');

  if (!response.ok) {
    throw new Error(`Google API error: ${response.status}`);
  }

  const data = await response.json();

  if (data.status === 'NOT_FOUND') {
    return null;
  }

  if (data.status !== 'OK') {
    throw new Error(`Google API status: ${data.status}`);
  }

  return data.result;
}

/**
 * Enrich a single business with Google Place data
 */
export async function enrichBusiness(businessId: number): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      nameKo: true,
      nameEn: true,
      addressRaw: true,
      city: true,
      state: true,
    },
  });

  if (!business) {
    return false;
  }

  // Try English name first, then Korean
  const searchName = business.nameEn || business.nameKo;
  const searchAddress = `${business.addressRaw} ${business.city}, ${business.state}`;

  try {
    // Step 1: Find the place
    const searchResult = await searchPlace(searchName, searchAddress);

    if (!searchResult) {
      // Place not found
      await prisma.googlePlace.upsert({
        where: { businessId },
        create: {
          businessId,
          placeId: '',
          fetchStatus: 'not_found',
          lastFetchedAt: new Date(),
        },
        update: {
          fetchStatus: 'not_found',
          lastFetchedAt: new Date(),
        },
      });
      return false;
    }

    // Step 2: Get detailed info
    const details = await getPlaceDetails(searchResult.place_id);

    if (!details) {
      await prisma.googlePlace.upsert({
        where: { businessId },
        create: {
          businessId,
          placeId: searchResult.place_id,
          fetchStatus: 'error',
          lastFetchedAt: new Date(),
        },
        update: {
          placeId: searchResult.place_id,
          fetchStatus: 'error',
          lastFetchedAt: new Date(),
        },
      });
      return false;
    }

    // Step 3: Save to database
    await prisma.googlePlace.upsert({
      where: { businessId },
      create: {
        businessId,
        placeId: details.place_id,
        rating: details.rating ?? null,
        userRatingsTotal: details.user_ratings_total ?? null,
        formattedAddress: details.formatted_address ?? null,
        lat: details.geometry?.location.lat ?? null,
        lng: details.geometry?.location.lng ?? null,
        openingHoursText: details.opening_hours?.weekday_text ?? undefined,
        types: details.types ?? undefined,
        website: details.website ?? null,
        phoneE164: details.international_phone_number ?? null,
        fetchStatus: 'ok',
        lastFetchedAt: new Date(),
      },
      update: {
        placeId: details.place_id,
        rating: details.rating ?? null,
        userRatingsTotal: details.user_ratings_total ?? null,
        formattedAddress: details.formatted_address ?? null,
        lat: details.geometry?.location.lat ?? null,
        lng: details.geometry?.location.lng ?? null,
        openingHoursText: details.opening_hours?.weekday_text ?? undefined,
        types: details.types ?? undefined,
        website: details.website ?? null,
        phoneE164: details.international_phone_number ?? null,
        fetchStatus: 'ok',
        lastFetchedAt: new Date(),
      },
    });

    // Update business with lat/lng if not already set
    if (!business) {
      return false;
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { id: businessId },
      select: { lat: true, lng: true },
    });

    if ((!existingBusiness?.lat || !existingBusiness?.lng) && details.geometry?.location) {
      await prisma.business.update({
        where: { id: businessId },
        data: {
          lat: details.geometry.location.lat,
          lng: details.geometry.location.lng,
        },
      });
    }

    return true;
  } catch (error) {
    console.error(`Failed to enrich business ${businessId}:`, error);

    await prisma.googlePlace.upsert({
      where: { businessId },
      create: {
        businessId,
        placeId: '',
        fetchStatus: 'error',
        lastFetchedAt: new Date(),
      },
      update: {
        fetchStatus: 'error',
        lastFetchedAt: new Date(),
      },
    });

    return false;
  }
}

/**
 * Process enrichment queue - called by cron job
 */
export async function processEnrichmentQueue(batchSize: number = 10): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const items = await getNextQueueBatch(batchSize);

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  for (const item of items) {
    if (!(await canMakeApiCall())) {
      console.log('Budget exhausted, stopping queue processing');
      break;
    }

    await markProcessing(item.id);

    try {
      const success = await enrichBusiness(item.businessId);

      if (success) {
        await markDone(item.id);
        succeeded++;
      } else {
        await markFailed(item.id, 'Place not found or enrichment failed');
        failed++;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await markFailed(item.id, errorMessage);
      failed++;
    }

    processed++;
  }

  return { processed, succeeded, failed };
}

/**
 * Check if a business needs re-enrichment (stale data)
 */
export async function needsReEnrichment(businessId: number, staleDays: number = 90): Promise<boolean> {
  const place = await prisma.googlePlace.findUnique({
    where: { businessId },
    select: { lastFetchedAt: true, fetchStatus: true },
  });

  if (!place) return true;
  if (place.fetchStatus !== 'ok') return true;

  const staleDate = new Date(Date.now() - staleDays * 24 * 60 * 60 * 1000);
  return place.lastFetchedAt < staleDate;
}
