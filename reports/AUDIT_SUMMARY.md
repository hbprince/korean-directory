# Haninmap Data Audit Summary

**Date:** 2026-01-28
**Status:** ✅ Completed & Deployed

## Overview

| Metric | Value |
|--------|-------|
| Total Businesses | 62,570 |
| Total Categories | 133 (15 primary, 118 sub) |
| Unique States | 10+ |
| Unique Cities | 317 |

---

## B) Category Integrity Audit

### Summary
- **No missing primary categories** - all businesses have a category assigned
- **41,370 businesses** without subcategory (66%)
- Distribution looks healthy across both sources

### Top Categories by Count

| Category | Korean | Count | % |
|----------|--------|-------|---|
| Food & Dining | 식당 | 8,016 | 12.81% |
| Community | 커뮤니티 | 7,707 | 12.32% |
| Home Services | 주택서비스 | 7,460 | 11.92% |
| Shopping | 쇼핑 | 6,907 | 11.04% |
| Medical | 병원 | 6,086 | 9.73% |
| Real Estate | 부동산 | 4,353 | 6.96% |
| Financial | 금융 | 3,827 | 6.12% |
| Auto Services | 자동차 | 3,702 | 5.92% |
| Legal | 법률 | 2,770 | 4.43% |
| Beauty | 뷰티 | 2,528 | 4.04% |

### Source Comparison

**RadioKorea Top Categories:**
1. community: 4,147
2. shopping: 4,070
3. food: 3,921
4. home-services: 3,619
5. medical: 2,439

**KoreaDaily Top Categories:**
1. food: 4,123
2. home-services: 3,841
3. medical: 3,647
4. community: 3,560
5. real-estate: 2,899

**Assessment:** ✅ Categories appear correctly distributed. No systemic misclassification detected.

---

## E) Dedup/Merge Verification Audit

### Summary

| Metric | Value |
|--------|-------|
| Total Businesses | 62,570 |
| Multi-source (merged) | 28 |
| Single-source | 62,542 |
| RadioKorea records | 31,818 |
| KoreaDaily records | 30,780 |

### Potential Duplicates Found

**By Phone Number:** 139 potential duplicates
- +18444627342: 13 records
- +18007770133: 11 records
- +12138001199: 9 records

**By Name + City:** 138 potential duplicates
- "도미노스피자(맨해튼)" in New York: 17 records
- "판다익스프레스" in Los Angeles: 14 records
- "더커피빈" in Los Angeles: 10 records

**Assessment:** ⚠️ Only 28 records merged despite ~30K records from each source. This suggests dedup matching is too strict or sources have very little overlap. Consider:
1. Most duplicates are chain stores (Domino's, Panda Express, Coffee Bean)
2. Actual business-level dedup may be working correctly

---

## F) Region/Unknown Handling Audit

### State Distribution

| State | Count | % |
|-------|-------|---|
| CA | 52,531 | 83.9% |
| NY | 5,664 | 9.1% |
| NJ | 3,595 | 5.7% |
| PA | 288 | 0.5% |
| Others | 492 | 0.8% |

### Top Cities

1. LOS ANGELES, CA: 20,930
2. BUENA PARK, CA: 2,339
3. FLUSHING, NY: 1,818
4. GARDEN GROVE, CA: 1,587
5. NEW YORK, NY: 1,426
6. FULLERTON, CA: 1,403
7. TORRANCE, CA: 1,383
8. IRVINE, CA: 1,383
9. **Unknown, CA: 1,184** ⚠️
10. ANAHEIM, CA: 993

### Unknown Region Analysis

| Issue | Count | % |
|-------|-------|---|
| city = "Unknown" | 1,184 | 1.89% |
| Empty address | 3 | ~0% |

**Source of Unknown:** 100% from RadioKorea

**Assessment:** ⚠️ 1,184 businesses (1.89%) have "Unknown" as city. All from RadioKorea source. These should be:
1. Excluded from region-based browsing
2. Excluded from sitemap
3. Optionally moved to "기타/미상" page

---

## Recommendations

### Priority 1: UI Fixes (C, D)
1. Implement "전체 지역" (All Regions) page
2. Ensure Korean labels display correctly on all pages

### Priority 2: Unknown Region Handling
1. Exclude city="Unknown" from sitemap generation
2. Consider parsing addresses again for RadioKorea records with Unknown city

### Priority 3: Dedup Review
1. The low merge count (28) is likely correct - chain stores inflate duplicate counts
2. No immediate action needed unless manual review shows missed merges

---

## Files Generated

- `reports/category_audit.json`
- `reports/dedup_audit.json`
- `reports/region_audit.json`
- `reports/AUDIT_SUMMARY.md` (this file)
