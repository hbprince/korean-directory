# GEO (Generative Engine Optimization) Design Spec

**Date**: 2026-03-13
**Goal**: Optimize haninmap.com for LLM-based search engines (ChatGPT, Perplexity, Copilot, Claude) to increase both citation and business recommendation rates.

## Context

- ChatGPT is already the 5th largest traffic source (~10.4% of sessions)
- LLM referral traffic has lower bounce rates (33-41%) than direct (84.6%)
- robots.txt already allows GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot
- Comprehensive JSON-LD already in place (LocalBusiness, BreadcrumbList, FAQPage, Article)
- 10 high-quality Korean-language guide articles exist
- Category pages currently show business lists only, no editorial prose

## Design

### 1. Content Structure Optimization

#### 1-1. Category Page Editorial Summary

Add a 2-3 paragraph natural-language summary to the top of each category page (`/[state]/[city]/[category]`).

**Data source**: Server-side aggregation from DB — no LLM API calls.

**Template inputs**:
- Business count for category/city
- Average Google rating
- Review count range
- Common subcategories/specialties
- Neighborhood clustering (if data available)
- Insurance/language notes (category-specific)

**Example output** (`/ca/los-angeles/dental`):
> Los Angeles에는 한국어로 상담 가능한 한인 치과가 12곳 있습니다. 대부분 Koreatown과 Glendale 지역에 위치해 있으며, PPO/HMO 보험은 물론 보험 없이도 진료 가능한 곳이 많습니다. 평균 Google 평점은 4.5점이며, 임플란트, 교정, 일반 치료를 전문으로 합니다.

**Rendering**: New `<CategorySummary>` component rendered above the business list. Content generated at build/request time via a helper function in `src/lib/seo/` or `src/lib/pages/`.

**Indexing**: Summary text is included in the page HTML (not client-rendered), so LLM crawlers can read it directly.

#### 1-2. Business Detail Page Auto-Summary

For businesses lacking a `editorialSummary` from Google Places, generate a one-line summary from DB fields.

**Template**:
> "{cityName} 소재 한인 {categoryNameKo}. Google 평점 {rating} (리뷰 {reviewCount}개). 한국어 상담 가능. {specialties}."

**Implementation**: Helper function in `src/lib/seo/` that returns a summary string. Used in:
- Meta description fallback
- JSON-LD `description` field
- Visible on page as a subtitle/tagline

#### 1-3. Enhanced Category FAQ

Expand existing FAQ generation with LLM-citation-friendly Q&A patterns.

**New question templates per category type**:

Medical/Dental:
- "{city}에서 보험 없이 갈 수 있는 한인 {category}는?"
- "한인 {category} 첫 방문 시 필요한 것은?"
- "{city} 한인 {category} 평균 진료비는?"

Legal:
- "{city}에서 한국어 상담 가능한 {category}는?"
- "한인 {category} 수임료는 보통 얼마인가요?"

General:
- "{city} 한인 {category} 추천 기준은?"
- "{city}에서 평점이 높은 한인 {category}는?"

**Answer generation**: Template-based using actual DB aggregates (count, avg rating, top-rated business names).

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
- [Medical](/ca/los-angeles/medical): Korean doctors and clinics
- [Dental](/ca/los-angeles/dental): Korean dentists
...

## Guides
- [US Tax Filing Guide](/guides/us-tax-filing-guide): Complete tax guide for Korean Americans
...

## Coverage
- US: CA, NY, NJ, TX, WA, VA, GA, IL + more
- Canada: ON, BC (Toronto, Vancouver)
- Australia: NSW (Sydney)
```

**Generation**: Dynamic from DB (categories, guide list, city counts). Cached 24 hours.

#### 2-2. `/llms-full.txt`

Implementation: Next.js route handler at `src/app/llms-full.txt/route.ts`.

**Content**: Markdown listing of high-quality businesses (rating >= 4.2, reviews >= 10), grouped by state > city > category.

```markdown
## California

### Los Angeles - Dental
- **ABC Dental** (4.8★, 320 reviews) - Koreatown, (213) 555-1234
  Korean-speaking. Implants, orthodontics, general dentistry.

### Los Angeles - Medical
...
```

**Size constraint**: Cap at ~500KB. Include only top cities by business count. If exceeds limit, reduce to top 5 businesses per city/category.

**Cache**: 24 hours, `stale-while-revalidate`.

### 3. Schema.org Markup Enhancement

#### 3-1. `speakable` on Guide Pages

Add `speakable` property to Article JSON-LD on guide pages, targeting the summary and FAQ sections.

```json
{
  "@type": "Article",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".guide-summary", ".guide-faq"]
  }
}
```

**Files affected**: `src/lib/seo/meta.ts` (schema builder), `src/app/guides/[slug]/page.tsx` (CSS class addition).

#### 3-2. `mainEntity` on Category Pages

Enhance ItemList JSON-LD to include `mainEntity` linking to the LocalBusiness entities.

Current: ItemList with ListItem positions only.
New: ItemList with `mainEntity` array pointing to business URLs.

**Files affected**: `src/lib/seo/meta.ts` (`buildItemList` function).

#### 3-3. `sameAs` and `areaServed` on Business Pages

Add to LocalBusiness JSON-LD:
- `areaServed`: City/region the business serves
- `sameAs`: Google Maps URL, website URL (already partially present)

**Files affected**: `src/lib/seo/meta.ts` (`buildLocalBusinessSchema` function).

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/llms.txt/route.ts` | llms.txt endpoint |
| `src/app/llms-full.txt/route.ts` | llms-full.txt endpoint |
| `src/lib/seo/category-summary.ts` | Category editorial summary generator |
| `src/lib/seo/business-summary.ts` | Business auto-summary generator |
| `src/components/CategorySummary.tsx` | Category summary UI component |

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/seo/meta.ts` | Add speakable, mainEntity, sameAs, areaServed to schemas |
| `src/app/[state]/[city]/[category]/page.tsx` | Add CategorySummary component |
| `src/app/biz/[slug]/page.tsx` | Use auto-summary as fallback |
| `src/app/guides/[slug]/page.tsx` | Add CSS classes for speakable |
| `src/app/robots.txt/route.ts` | Add llms.txt reference |

## Out of Scope

- LLM API calls for content generation (all content is template-based)
- Paid LLM partnerships or API integrations
- Changes to existing guide article content
- International page changes (focus on US first, extend later)
- Analytics tracking for LLM referral traffic (separate task)

## Success Criteria

- `/llms.txt` and `/llms-full.txt` return valid responses
- Category pages render editorial summaries above business lists
- Business pages show auto-generated summary when no editorial summary exists
- Enhanced FAQ appears on category pages
- Schema.org markup passes validation (schema.org validator)
- No regression in build time or page load performance
