# List UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade category page business cards and detail page to create a fast, visually rich browsing experience that differentiates from RadioKorea's 2000s-era text lists.

**Architecture:** Enhance existing `BusinessCard` component with photo thumbnail, directions CTA, and today's hours. Add Google Static Maps image to the business detail page for businesses with coordinates. All changes are within existing Next.js SSR/ISR pages — no new routes or API endpoints needed.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Prisma, Google Static Maps API

---

### Task 1: Enhance BusinessCard with photo, hours, and directions CTA

**Files:**
- Modify: `src/components/BusinessCard.tsx`
- Modify: `src/app/[state]/[city]/[category]/page.tsx` (pass new props)

**Step 1: Update BusinessCard props and UI**

Add `photoRef`, `todayHours`, and `addressRaw` (already passed) to enable:
- Thumbnail image (left side of card, using existing `/api/photo` proxy)
- Today's hours text below open/closed badge
- Directions button alongside existing call button

Update `src/components/BusinessCard.tsx` to this:

```tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { formatBilingual, UI_LABELS } from '@/lib/i18n/labels';
import { trackCallClick, trackDirectionsClick } from '@/lib/analytics/ga';

export interface BusinessCardProps {
  id: number;
  nameKo: string;
  nameEn?: string | null;
  addressRaw: string;
  city: string;
  state: string;
  phoneRaw?: string | null;
  phoneE164?: string | null;
  slug: string;
  rating?: number | null;
  reviewCount?: number | null;
  categorySlug: string;
  categoryNameEn: string;
  openNow?: boolean | null;
  trustScore?: number;
  communityMentions?: number;
  upVotes?: number;
  // New props
  photoRef?: string | null;
  todayHours?: string | null;
}

export function BusinessCard({
  id,
  nameKo,
  nameEn,
  addressRaw,
  city,
  state,
  phoneRaw,
  phoneE164,
  slug,
  rating,
  reviewCount,
  categoryNameEn,
  openNow,
  trustScore,
  communityMentions,
  upVotes,
  photoRef,
  todayHours,
}: BusinessCardProps) {
  const [imgError, setImgError] = useState(false);
  const displayName = formatBilingual(nameKo, nameEn);

  const handleCallClick = () => {
    trackCallClick({
      phone: phoneE164 || phoneRaw || undefined,
      businessId: id,
      businessName: nameEn || nameKo,
      city,
      category: categoryNameEn,
    });
  };

  const handleDirectionsClick = () => {
    trackDirectionsClick({
      businessId: id,
      businessName: nameEn || nameKo,
      city,
      category: categoryNameEn,
      destination: addressRaw,
    });
  };

  const showPhoto = photoRef && !imgError;

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
      <div className={showPhoto ? 'flex' : ''}>
        {/* Thumbnail */}
        {showPhoto && (
          <div className="relative w-28 min-h-[7rem] shrink-0 bg-gray-100">
            <Image
              src={`/api/photo?ref=${encodeURIComponent(photoRef)}&maxwidth=200`}
              alt={nameKo}
              fill
              className="object-cover"
              sizes="112px"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="flex-1 p-4 min-w-0">
          {/* Title */}
          <Link href={`/biz/${slug}`} className="block">
            <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
              {displayName}
            </h3>
          </Link>

          {/* Address */}
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{addressRaw}</p>

          {/* Rating + Open/Closed + Hours */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
            {rating != null && reviewCount != null && (
              <div className="flex items-center text-sm">
                <span className="text-yellow-500 mr-0.5">★</span>
                <span className="font-medium">{rating.toFixed(1)}</span>
                <span className="text-gray-400 ml-0.5">({reviewCount})</span>
              </div>
            )}

            {openNow != null && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                openNow
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}>
                {openNow ? '영업중' : '영업종료'}
              </span>
            )}

            {todayHours && (
              <span className="text-xs text-gray-400 truncate max-w-[180px]">
                {todayHours}
              </span>
            )}
          </div>

          {/* Trust Score & Community Signals */}
          {(trustScore || communityMentions || upVotes) ? (
            <div className="flex items-center flex-wrap gap-2 mt-1.5 text-xs">
              {trustScore != null && trustScore > 0 && (
                <span className={`font-medium px-2 py-0.5 rounded-full ${
                  trustScore >= 80
                    ? 'bg-green-50 text-green-700'
                    : trustScore >= 60
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  신뢰 {trustScore}
                </span>
              )}
              {communityMentions != null && communityMentions > 0 && (
                <span className="text-gray-400">커뮤니티 {communityMentions}회</span>
              )}
              {upVotes != null && upVotes > 0 && (
                <span className="text-gray-400">👍 {upVotes}</span>
              )}
            </div>
          ) : null}

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 mt-3">
            {phoneRaw && (
              <a
                href={`tel:${phoneE164 || phoneRaw}`}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCallClick();
                }}
              >
                📞 {UI_LABELS.call.ko}
              </a>
            )}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressRaw)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDirectionsClick();
              }}
            >
              🗺 {UI_LABELS.directions.ko}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mt-3"></div>
      <div className="flex gap-2 mt-3">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}
```

**Step 2: Update category page to pass new props**

In `src/app/[state]/[city]/[category]/page.tsx`:

a) Add `photosJson` to the Prisma select on `googlePlace`:

```typescript
// Change the googlePlace select in the business query (~line 274-278)
googlePlace: {
  select: {
    rating: true,
    userRatingsTotal: true,
    openingHoursJson: true,
    photosJson: true,       // ADD
  },
},
```

b) Import `getTodayHours` helper:

```typescript
// Add to the import from helpers (~line 28)
import { computeOpenNow, getTodayHours } from '@/lib/enrichment/helpers';
```

c) Add a helper to extract first photo ref (add after imports):

```typescript
function getFirstPhotoRef(photosJson: unknown): string | null {
  if (!photosJson || !Array.isArray(photosJson) || photosJson.length === 0) return null;
  const first = photosJson[0] as { url?: string };
  if (!first?.url) return null;
  try {
    return new URL(first.url).searchParams.get('photoreference');
  } catch {
    return null;
  }
}
```

d) Pass new props to BusinessCard (~line 451-470):

```tsx
<BusinessCard
  key={business.id}
  id={business.id}
  nameKo={business.nameKo}
  nameEn={business.nameEn}
  addressRaw={business.addressRaw}
  city={business.city}
  state={business.state}
  phoneRaw={business.phoneRaw}
  phoneE164={business.phoneE164}
  slug={business.slug || `business-${business.id}`}
  rating={business.googlePlace?.rating}
  reviewCount={business.googlePlace?.userRatingsTotal}
  categorySlug={business.primaryCategory.slug}
  categoryNameEn={business.primaryCategory.nameEn}
  openNow={computeOpenNow(business.googlePlace?.openingHoursJson)}
  trustScore={trustMap.get(String(business.id))}
  communityMentions={mentionMap.get(String(business.id))}
  upVotes={upVoteMap.get(String(business.id))}
  photoRef={process.env.GOOGLE_MAPS_API_KEY ? getFirstPhotoRef(business.googlePlace?.photosJson) : null}
  todayHours={getTodayHours(business.googlePlace?.openingHoursJson)}
/>
```

**Step 3: Run dev server and verify visually**

Run: `cd "/Users/hbrandon/Dev Projects/haninmap" && npm run dev`

Open: `http://localhost:3000/ca/los-angeles/medical`

Expected: Cards now show photo thumbnails (where available), today's hours, and both Call + Directions buttons.

**Step 4: Commit**

```bash
git add src/components/BusinessCard.tsx src/app/\[state\]/\[city\]/\[category\]/page.tsx
git commit -m "feat: enhance BusinessCard with photo, hours, directions CTA"
```

---

### Task 2: Update international pages to pass new props

**Files:**
- Modify: `src/lib/pages/international-listing.tsx`

**Step 1: Apply same changes to international listing**

The international pages (Canada, Australia) use `InternationalCategoryPage` from `src/lib/pages/international-listing.tsx`. Apply the same changes:

a) Add `photosJson` to googlePlace select
b) Import `getTodayHours` from helpers
c) Add `getFirstPhotoRef` helper
d) Pass `photoRef` and `todayHours` to BusinessCard

The pattern is identical to Task 1 Step 2.

**Step 2: Verify**

Open: `http://localhost:3000/canada/on/toronto/medical`
Expected: Same enhanced cards as US pages.

**Step 3: Commit**

```bash
git add src/lib/pages/international-listing.tsx
git commit -m "feat: enhance international listing cards with photo, hours, directions"
```

---

### Task 3: Add Google Static Maps to business detail page

**Files:**
- Modify: `src/app/biz/[slug]/page.tsx`

**Step 1: Replace the text-only location section with Static Maps image**

In `src/app/biz/[slug]/page.tsx`, find the location section (~line 292-313) and replace with:

```tsx
{/* Map */}
{(() => {
  const lat = googlePlace?.lat || business.lat;
  const lng = googlePlace?.lng || business.lng;
  const mapsUrl = googlePlace?.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${displayName} ${business.addressRaw}`
  )}`;

  if (!lat || !lng) {
    // No coordinates: show address with link only
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">위치 (Location)</h2>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-3">{business.addressRaw}</p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.addressRaw)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            🗺 Google 지도에서 보기
          </a>
        </div>
      </section>
    );
  }

  // Has coordinates: show Static Maps image
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&scale=2&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4">위치 (Location)</h2>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
      >
        {apiKey ? (
          <img
            src={staticMapUrl}
            alt={`${nameKo} 위치 지도`}
            width={600}
            height={300}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : (
          <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400 text-sm">
            지도를 불러올 수 없습니다
          </div>
        )}
      </a>
      <div className="flex items-center gap-3 mt-3">
        <p className="text-sm text-gray-600 flex-1">{business.addressRaw}</p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          🗺 길찾기
        </a>
      </div>
    </section>
  );
})()}
```

Note: We use a regular `<img>` tag (not Next.js `<Image>`) for the static map because the URL is dynamically constructed with an API key — Next.js Image optimization doesn't add value here and would require configuring an external domain.

Also need to add `nameKo` reference. The variable `displayName` already exists but for alt text we use `nameKo` directly which is already available from `business.nameKo`. Replace `nameKo` in the alt text with `business.nameKo`.

**Step 2: Add GOOGLE_MAPS_API_KEY to .env**

Verify the key exists in `.env`. If not already there, add:

```
GOOGLE_MAPS_API_KEY=your-key-here
```

The key must have Static Maps API enabled in Google Cloud Console.

**Step 3: Verify**

Open a business detail page that has coordinates (check DB for a business with lat/lng in GooglePlace).
Expected: Map image showing business location with red marker, clickable to open Google Maps.

Open a business detail page WITHOUT coordinates.
Expected: Address text with "Google 지도에서 보기" link (no map image).

**Step 4: Commit**

```bash
git add src/app/biz/\[slug\]/page.tsx
git commit -m "feat: add Google Static Maps to business detail page"
```

---

### Task 4: Check data coverage and verify end-to-end

**Files:** None (data check only)

**Step 1: Check how many businesses have Google Places data**

Run:
```bash
cd "/Users/hbrandon/Dev Projects/haninmap"
npx tsx -e "
  const { PrismaClient } = require('@prisma/client');
  const p = new PrismaClient();
  (async () => {
    const total = await p.business.count();
    const withGP = await p.googlePlace.count({ where: { fetchStatus: 'ok' } });
    const withCoords = await p.googlePlace.count({ where: { lat: { not: null }, lng: { not: null } } });
    const withPhotos = await p.googlePlace.count({ where: { photosJson: { not: null } } });
    const withHours = await p.googlePlace.count({ where: { openingHoursJson: { not: null } } });
    console.log('Total businesses:', total);
    console.log('With Google Place:', withGP);
    console.log('With coordinates:', withCoords);
    console.log('With photos:', withPhotos);
    console.log('With hours:', withHours);
    await p.\$disconnect();
  })();
"
```

This tells us what percentage of cards will show enhanced data.

**Step 2: Visual QA checklist**

Open these pages and verify:

1. `http://localhost:3000/ca/los-angeles/medical` — US category page
2. `http://localhost:3000/canada/on/toronto/medical` — Canada page (if exists)
3. A `/biz/[slug]` page WITH coordinates — verify static map
4. A `/biz/[slug]` page WITHOUT coordinates — verify fallback
5. Mobile viewport (Chrome DevTools, 375px) — verify card layout, touch targets

**Step 3: Run build to catch TypeScript errors**

Run: `npm run build`
Expected: Build succeeds with no type errors.

**Step 4: Final commit if any fixes**

```bash
git add -A
git commit -m "fix: QA fixes for list UI redesign"
```
