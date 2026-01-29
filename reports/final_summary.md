# Taxonomy Audit & Fix - Final Summary

**Date:** 2026-01-29

## Overview

This report summarizes the comprehensive category mapping audit and fixes performed on the Korean business directory database.

---

## Before/After Comparison

### Overall Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total Businesses | 63,169 | 63,811 | +642 |
| RadioKorea | 32,417 | 33,059 | +642 |
| KoreaDaily | 30,752 | 30,752 | 0 |
| Subcategories | 118 | 125 | +7 |
| Flagged Outliers | 12 | 95* | +83 |

*Note: Increased outlier flags are due to new detection rules for newly created subcategories (shipping, logistics, nightlife) which flag existing records that could be further refined.

### Primary Category Distribution Changes

| Category | Before | After | Change |
|----------|--------|-------|--------|
| beauty | 2,528 | 2,512 | -16 (moved to fitness) |
| community | 7,803 | 7,819 | +16 (gained fitness) |
| food | 8,016 | 8,138 | +122 (nightlife consolidated) |
| home-services | 7,733 | 7,818 | +85 (gained laundry) |
| medical | 5,360 | 5,384 | +24 (gained korean-medicine) |
| professional | 2,463 | 2,378 | -85 (lost laundry) |
| shopping | 7,795 | 8,291 | +496 (gained health-supplements) |

---

## New Subcategories Created (7)

| Slug | Korean | English | Parent |
|------|--------|---------|--------|
| optometrist | 검안의 | Optometrist | medical |
| health-supplements | 건강식품 | Health Supplements | shopping |
| laundry | 세탁소 | Laundry | home-services |
| fitness | 피트니스 | Fitness | community |
| nightlife | 유흥 | Nightlife | food |
| shipping | 배송/택배 | Shipping | home-services |
| logistics | 물류/창고 | Logistics | home-services |

---

## Fixes Applied (B1-B6)

### B1: RadioKorea B10 검안의 (8 records)
- **Issue:** Optometrists were incorrectly mapped to ophthalmology
- **Fix:** Created new `medical>optometrist` subcategory
- **Records moved:** 8

### B2: KoreaDaily Category 13 건강식품 (112 records)
- **Issue:** Health supplement stores incorrectly under medical category
- **Fix:**
  - 88 businesses → `shopping>health-supplements`
  - 24 Korean medicine clinics → `medical>korean-medicine`

### B3: S07 세탁소 (85 records)
- **Issue:** Laundry businesses under professional instead of home-services
- **Fix:** Created `home-services>laundry`, moved all laundry businesses
- **Mapping updated:** S07 → `home-services>laundry`

### B4: Gym/Fitness (16 records)
- **Issue:** Fitness centers were under beauty>spa
- **Fix:** Created `community>fitness`, moved fitness-related businesses
- **Keywords:** 헬스, 피트니스, fitness, gym, 운동기구

### B5: Nightlife (463 records)
- **Issue:** Nightlife venues (노래방, 카라오케, bars) had no dedicated subcategory
- **Fix:** Created `food>nightlife`, assigned nightlife businesses
- **Mapping updated:** N01, N03 → `food>nightlife`

### B6: Logistics Split (73 records)
- **Issue:** Moving, shipping, and logistics were all under `home-services>moving`
- **Fix:** Split into three subcategories:
  - `home-services>moving` (kept for movers)
  - `home-services>shipping` (26 records) - courier/parcel/택배
  - `home-services>logistics` (47 records) - warehouse/customs/물류
- **Mapping updated:** T01 → `home-services>shipping`

---

## Source Mapping Updates

### categoryMapping.ts Changes

```typescript
// B1 FIX: Optometrist
'B10': { primary: 'medical', sub: 'optometrist' }, // was ophthalmology

// B3 FIX: Laundry
'S07': { primary: 'home-services', sub: 'laundry' }, // was professional

// B5 FIX: Nightlife
'N01': { primary: 'food', sub: 'nightlife' }, // was food (no sub)
'N03': { primary: 'food', sub: 'nightlife' }, // was food (no sub)

// B6 FIX: Shipping
'T01': { primary: 'home-services', sub: 'shipping' }, // was moving
```

---

## Total Impact

| Fix | Records Affected |
|-----|-----------------|
| B1: Optometrist | 8 |
| B2: Health Supplements | 88 |
| B2: Korean Medicine | 24 |
| B3: Laundry | 85 |
| B4: Fitness | 16 |
| B5: Nightlife | 463 |
| B6: Shipping | 26 |
| B6: Logistics | 47 |
| **Total** | **757** |

---

## Remaining Work (Optional)

The post-fix outlier audit identified 95 records that could be further refined:

| Flag Type | Count | Description |
|-----------|-------|-------------|
| LOGISTICS | 32 | Additional logistics candidates in moving |
| NIGHTLIFE | 26 | Additional nightlife candidates |
| SHIPPING | 25 | Additional shipping candidates |
| POSSIBLE_BEAUTY | 5 | Medical clinics with 미용 in name |
| POSSIBLE_SHOPPING | 4 | Businesses with 마트/슈퍼 in name |
| POSSIBLE_COMMUNITY | 2 | Contains 헬스 keyword |
| FITNESS | 2 | Additional fitness candidates |
| HEALTH_SUPPLEMENT | 1 | Additional supplement store |
| BATHHOUSE | 1 | 찜질방 candidate |

These are edge cases that may warrant manual review.

---

## Files Modified

### Scripts Created
- `scripts/audit-category-distribution.ts` - Distribution analysis
- `scripts/audit-category-outliers.ts` - Outlier detection
- `scripts/taxonomy-fix.ts` - Automated fix script
- `scripts/taxonomy-remap.ts` - Future re-import tool

### Configuration Updated
- `src/lib/taxonomy/categoryMapping.ts` - Source mappings
- `package.json` - NPM scripts added

### Reports Generated
- `reports/category_distribution.json` / `.md`
- `reports/category_outliers.json` / `.md`
- `reports/taxonomy_fix_result.json` / `.md`
- `reports/final_summary.md` (this file)

---

## Verification

To verify the fixes:

```bash
# Run distribution audit
npm run audit:category-distribution

# Run outlier detection
npm run audit:category-outliers

# View new subcategories
npx prisma studio
```

---

## Conclusion

All B1-B6 fixes have been successfully applied:
- 7 new subcategories created
- 757 business records reassigned
- Source mappings updated for future imports
- Audit infrastructure established for ongoing monitoring
