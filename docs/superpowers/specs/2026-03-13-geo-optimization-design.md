# GEO (Generative Engine Optimization) Design Spec

**Date**: 2026-03-13
**Goal**: Optimize haninmap.com for LLM-based search engines (ChatGPT, Perplexity, Copilot, Claude) to increase both citation and business recommendation rates.

## Context

- ChatGPT is already the 5th largest traffic source (~10.4% of sessions)
- LLM referral traffic has lower bounce rates (33-41%) than direct (84.6%)
- robots.txt already allows GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot
- Comprehensive JSON-LD already in place (LocalBusiness, BreadcrumbList, FAQPage, Article)
- 10 high-quality Korean-language guide articles exist
- Category pages already have a `<CategoryIntro>` component with bilingual editorial prose, category-specific context, count, avg rating, and review count

## Design

### 1. Content Structure Optimization

#### 1-1. Enhance Existing `CategoryIntro` Component

The existing `<CategoryIntro>` (`src/components/CategoryIntro.tsx`) already provides bilingual editorial prose with business count, avg rating, review count, and category-specific context for 15 categories. Rather than creating a new component, **enhance it** with additional data points that improve LLM citability:

**New data inputs to add**:
- Top-rated business names (up to 3) — gives LLMs concrete recommendations to cite
- Common subcategories/specialties — helps LLMs understand what services are available

**Changes to `CategoryIntro`**:
- Add `topBusinessNames?: string[]` and `subcategories?: string[]` props
- Weave these into the existing Korean/English prose blocks
- Example addition to Korean block: "평점이 높은 곳으로는 ABC Dental, Seoul Dental Clinic 등이 있으며, 임플란트, 교정, 일반 치료를 전문으로 합니다."

**No change to positioning** — it already renders on category pages. The international pages (`src/lib/pages/international-listing.tsx`) also use this component; they will automatically benefit from the enhancement.

**Data sourcing**: The category page already queries businesses. Pass top 3 by rating and distinct subcategory names as additional props.

#### 1-2. Business Detail Page Auto-Summary

For businesses lacking an `editorialSummary` from Google Places, generate a one-line summary from DB fields. When `editorialSummary` exists in GooglePlace, it continues to be used unchanged — the auto-summary is generated only when `editorialSummary` is null/empty.

**Template**:
> "{cityName} 소재 한인 {categoryNameKo}. Google 평점 {rating} (리뷰 {reviewCount}개). 한국어 상담 가능. {specialties}."

**Implementation**: Helper function in `src/lib/seo/business-summary.ts` that returns a summary string. Used in:
- Meta description fallback
- JSON-LD `description` field
- Visible on page as a subtitle/tagline

#### 1-3. Enhanced Category FAQ

Augment (not replace) the existing `generateCategoryFAQs()` in `src/components/FAQSection.tsx`. The existing 14 category-specific FAQ sets and 2 common FAQs remain unchanged.

**New questions appended** per category type:

Medical/Dental:
- "{city}에서 보험 없이 갈 수 있는 한인 {category}는?"
- "한인 {category} 첫 방문 시 필요한 것은?"

Legal:
- "{city}에서 한국어 상담 가능한 {category}는?"

General (all categories):
- "{city} 한인 {category} 추천 기준은?"
- "{city}에서 평점이 높은 한인 {category}는?"

**Answer generation**: Template-based using count and avg rating (same data already available to the FAQ generator). No new DB queries required — top-rated business names are NOT included in FAQ answers to keep the existing function signature simple.

**Integration**: Add new entries to `CATEGORY_SPECIFIC_FAQS` map and the common FAQ list in `FAQSection.tsx`.

### 2. LLM-Specific Endpoints

#### 2-1. `/llms.txt`

Implementation: Next.js route handler at `src/app/llms.txt/route.ts`.

**Content structure**:
```markdown
# HaninMap (한인맵)

> Korean business directory for the US, Canada, and Australia.
> Find Korean-speaking doctors, dentists, lawyers, CPAs, restaurants, and more.

## About
HaninMap is a bilingual (Korean/English) directory helping Korean Americans,
Korean Canadians, and Korean Australians find local Korean-speaking businesses
and professionals.

## Categories
- Medical: Korean doctors and clinics
- Dental: Korean dentists
- Legal: Korean lawyers and attorneys
- Financial: CPAs, tax preparers, accountants
...

## Guides
- [US Tax Filing Guide](https://www.haninmap.com/guides/us-tax-filing-guide): Complete tax guide for Korean Americans
- [Immigration Lawyer Guide](https://www.haninmap.com/guides/us-immigration-lawyer-guide): How to choose an immigration lawyer
...

## Coverage
- US: CA, NY, NJ, TX, WA, VA, GA, IL + more
- Canada: ON, BC (Toronto, Vancouver)
- Australia: NSW (Sydney)

## Optional
- [Full business listing](https://www.haninmap.com/llms-full.txt)
```

**Categories section**: Lists each category once with a description — no city-specific URLs (those belong in `llms-full.txt`).

**Generation**: Dynamic from DB (category list, published guides, coverage stats). Cached via `Cache-Control: public, max-age=86400, s-maxage=86400` (same pattern as existing `robots.txt/route.ts`).

#### 2-2. `/llms-full.txt`

Implementation: Next.js route handler at `src/app/llms-full.txt/route.ts`.

**Content**: Markdown listing of high-quality businesses (rating >= 4.2, reviews >= 10 — matching existing `shouldIndexL3` criteria), grouped by state > city > category.

```markdown
## California

### Los Angeles - Dental
- **ABC Dental** (4.8★, 320 reviews) - Koreatown, (213) 555-1234
  Korean-speaking. Implants, orthodontics, general dentistry.

### Los Angeles - Medical
...
```

**Size constraint** (UTF-8 encoded bytes):
- Target: under 500KB
- Truncation algorithm: iterate states alphabetically, take top 10 cities per state by business count, take top 10 businesses per city/category by rating. Stop adding entries when approaching 450KB.
- Hard floor: if no businesses meet quality criteria, return only the header section with a note that the full listing is available on the website.

**Cache**: `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600`.

### 3. Schema.org Markup Enhancement

#### 3-1. `speakable` on Guide Pages

Add `speakable` property to Article JSON-LD on guide pages.

```json
{
  "@type": "Article",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".guide-summary", ".guide-faq"]
  }
}
```

**Implementation**:
- In `src/app/guides/[slug]/page.tsx`: add `className="guide-summary"` to the summary `<p>` tag, and wrap the `<FAQSection>` call in a `<div className="guide-faq">` wrapper div (keeps FAQSection component unchanged).
- In `src/lib/seo/meta.ts`: add `speakable` field to the Article schema builder.

#### 3-2. `mainEntity` on Category Pages

Enhance ItemList JSON-LD with `mainEntity` using `@id` references (lightweight, no inline objects):

```json
{
  "@type": "ItemList",
  "mainEntity": [
    { "@type": "LocalBusiness", "@id": "https://www.haninmap.com/biz/business-123" },
    { "@type": "LocalBusiness", "@id": "https://www.haninmap.com/biz/business-456" }
  ],
  "itemListElement": [...]
}
```

**Files affected**: `src/lib/seo/meta.ts` (`buildItemList` function — add `mainEntity` array from business slugs).

#### 3-3. `sameAs` and `areaServed` on Business Pages

Add to LocalBusiness JSON-LD:
- `areaServed`: `{ "@type": "City", "name": "{cityName}, {state}" }`
- `sameAs`: Google Maps URL (constructed from `googlePlace.placeId`), website URL

**Files affected**: `src/lib/seo/meta.ts` (`buildLocalBusinessSchema` function).

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/llms.txt/route.ts` | llms.txt endpoint |
| `src/app/llms-full.txt/route.ts` | llms-full.txt endpoint |
| `src/lib/seo/business-summary.ts` | Business auto-summary generator |

## Files to Modify

| File | Change |
|------|--------|
| `src/components/CategoryIntro.tsx` | Add `topBusinessNames` and `subcategories` props, weave into prose |
| `src/components/FAQSection.tsx` | Append new LLM-friendly FAQ templates to existing sets |
| `src/lib/seo/meta.ts` | Add speakable, mainEntity, sameAs, areaServed to schemas |
| `src/app/[state]/[city]/[category]/page.tsx` | Pass new props to CategoryIntro |
| `src/app/biz/[slug]/page.tsx` | Use auto-summary as fallback description |
| `src/app/guides/[slug]/page.tsx` | Add CSS classes for speakable, wrap FAQSection |
| `src/app/robots.txt/route.ts` | Add llms.txt mention in comment block |
| `src/lib/pages/international-listing.tsx` | Pass new props to CategoryIntro (auto-benefits) |

## Out of Scope

- LLM API calls for content generation (all content is template-based)
- Paid LLM partnerships or API integrations
- Changes to existing guide article content
- Neighborhood clustering (no discrete neighborhood data in schema)
- Analytics tracking for LLM referral traffic (separate task)

## Success Criteria

- `/llms.txt` and `/llms-full.txt` return valid, well-formed responses
- Category pages render enhanced editorial summaries with top business names
- Business pages show auto-generated summary when no editorial summary exists
- Enhanced FAQ questions appear on category pages alongside existing FAQs
- Schema.org markup passes validation (schema.org validator)
- No increase in build time beyond 10%
- LLM referral traffic does not decrease after deployment (baseline: ~10.4% of sessions)
- `/llms.txt` and `/llms-full.txt` receive crawler traffic within 30 days (verify via server logs)
