# Project Cleanup Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize scripts, clean up Git, and document project conventions.

**Architecture:** File moves + import path fixes + package.json updates + CLAUDE.md creation. No new code, no behavior changes.

**Tech Stack:** Next.js 14, TypeScript, Prisma, Vercel

**Spec:** `docs/superpowers/specs/2026-03-10-project-cleanup-design.md`

---

## Chunk 1: Scripts Reorganization

### Task 1: Create subdirectories and move scripts

**Files:**
- Create directories: `scripts/ops/`, `scripts/analytics/`, `scripts/data/`, `scripts/migration/`
- Move files per mapping below (existing `scripts/seo/` and `scripts/promote/` stay for now)

- [ ] **Step 1: Create subdirectories**

```bash
cd "/Users/hbrandon/Dev Projects/haninmap"
mkdir -p scripts/ops scripts/analytics scripts/data scripts/migration
```

- [ ] **Step 2: Move ops/ scripts**

```bash
mv scripts/daily-gsc-submit.sh scripts/ops/
mv scripts/calculate-trust-scores.ts scripts/ops/
mv scripts/crawl-alert-feeds.ts scripts/ops/
mv scripts/crawl-community-mentions.ts scripts/ops/
mv scripts/crawl-gov-guides.ts scripts/ops/
mv scripts/crawl-gov-guides-batch2.ts scripts/ops/
```

- [ ] **Step 3: Move analytics/ scripts**

```bash
mv scripts/query-ga4-analytics.ts scripts/analytics/
mv scripts/query-gsc-analytics.ts scripts/analytics/
mv scripts/check-index-status.ts scripts/analytics/
mv scripts/sample-index-status.ts scripts/analytics/
mv scripts/db-check.ts scripts/analytics/
mv scripts/audit-bilingual.ts scripts/analytics/
mv scripts/audit-category-distribution.ts scripts/analytics/
mv scripts/audit-category-outliers.ts scripts/analytics/
```

- [ ] **Step 4: Move data/ scripts (including promote/ directory)**

```bash
mv scripts/ingest.ts scripts/data/
mv scripts/seed-enrichment.ts scripts/data/
mv scripts/seed-guides.ts scripts/data/
mv scripts/import-hanindoc-enrichment.ts scripts/data/
mv scripts/promote-au.ts scripts/data/
mv scripts/promote-ca.ts scripts/data/
mv scripts/promote scripts/data/promote
```

- [ ] **Step 5: Move migration/ scripts**

```bash
mv scripts/fix-all-categories.ts scripts/migration/
mv scripts/fix-all-subcategories.ts scripts/migration/
mv scripts/fix-categories.ts scripts/migration/
mv scripts/fix-remaining-nulls.ts scripts/migration/
mv scripts/fix-subcategories.ts scripts/migration/
mv scripts/check-subcategories.ts scripts/migration/
mv scripts/taxonomy-fix.ts scripts/migration/
mv scripts/update-radiokorea-categories.ts scripts/migration/
mv scripts/run-migration.ts scripts/migration/
```

- [ ] **Step 6: Move remaining SEO scripts into existing seo/**

```bash
mv scripts/seoFinalAudit.ts scripts/seo/
mv scripts/submit-to-gsc.ts scripts/seo/
mv scripts/generate-url-list.ts scripts/seo/
```

- [ ] **Step 7: Verify scripts/ root is clean**

```bash
ls scripts/
```

Expected: only subdirectories remain (`ops/`, `analytics/`, `data/`, `migration/`, `seo/`)

---

### Task 2: Fix import paths in moved scripts

All scripts that used `../src/` now need `../../src/` (one level deeper).
The `promote/promote-country.ts` used `../../src/` and now needs `../../../src/`.

**Files to modify:**

- [ ] **Step 1: Fix `scripts/data/ingest.ts`** — change `../src/` to `../../src/`

Lines 10-18: Update three import paths:
```
'../src/lib/ingestion/normalize'  →  '../../src/lib/ingestion/normalize'
'../src/lib/taxonomy/categoryMapping'  →  '../../src/lib/taxonomy/categoryMapping'
'../src/lib/taxonomy/categories'  →  '../../src/lib/taxonomy/categories'
'../src/lib/dedupe/dedupe'  →  '../../src/lib/dedupe/dedupe'
```

- [ ] **Step 2: Fix `scripts/data/seed-enrichment.ts`** — change `../src/` to `../../src/`

Lines 7-8:
```
'../src/lib/enrichment/queue'  →  '../../src/lib/enrichment/queue'
'../src/lib/enrichment/budget'  →  '../../src/lib/enrichment/budget'
```

- [ ] **Step 3: Fix `scripts/data/promote/promote-country.ts`** — change `../../src/` to `../../../src/`

Lines 12, 13-19:
```
'../../src/lib/ingestion/normalize'  →  '../../../src/lib/ingestion/normalize'
'../../src/lib/dedupe/dedupe'  →  '../../../src/lib/dedupe/dedupe'
```

- [ ] **Step 4: Fix `scripts/migration/fix-subcategories.ts`** — change `../src/` to `../../src/`

Line 12:
```
'../src/lib/taxonomy/categoryMapping'  →  '../../src/lib/taxonomy/categoryMapping'
```

- [ ] **Step 5: Fix `scripts/migration/fix-remaining-nulls.ts`** — change `../src/` to `../../src/`

Line 22:
```
'../src/lib/taxonomy/categoryMapping'  →  '../../src/lib/taxonomy/categoryMapping'
```

- [ ] **Step 6: Fix `scripts/migration/update-radiokorea-categories.ts`** — change `../src/` to `../../src/`

Line 9:
```
'../src/lib/taxonomy/categoryMapping'  →  '../../src/lib/taxonomy/categoryMapping'
```

- [ ] **Step 7: Fix `scripts/analytics/audit-bilingual.ts`** — change `../src/` to `../../src/`

Lines 9-10:
```
'../src/lib/i18n/labels'  →  '../../src/lib/i18n/labels'
'../src/components/FAQSection'  →  '../../src/components/FAQSection'
```

- [ ] **Step 8: Fix `scripts/ops/daily-gsc-submit.sh`** — update script path

Line 78: change `scripts/submit-to-gsc.ts` to `scripts/seo/submit-to-gsc.ts`

- [ ] **Step 9: Verify imports compile**

```bash
cd "/Users/hbrandon/Dev Projects/haninmap"
npx tsc --noEmit 2>&1 | head -30
```

Expected: no new errors related to script imports (existing errors OK)

- [ ] **Step 10: Commit**

```bash
git add scripts/
git commit -m "refactor: reorganize scripts into ops/analytics/data/migration/seo subdirectories"
```

---

## Chunk 2: package.json & Reports

### Task 3: Update package.json script paths and remove stale entries

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update all script paths**

In `package.json` `"scripts"` section, update these entries:

```json
"db:check": "npx tsx scripts/analytics/db-check.ts",
"ingest": "npx tsx scripts/data/ingest.ts",
"seed:enrich": "npx tsx scripts/data/seed-enrichment.ts",
"audit:bilingual": "npx tsx scripts/analytics/audit-bilingual.ts",
"audit:seo": "npx tsx scripts/seo/seoFinalAudit.ts",
"audit:category-distribution": "npx tsx scripts/analytics/audit-category-distribution.ts",
"audit:category-outliers": "npx tsx scripts/analytics/audit-category-outliers.ts",
"taxonomy:fix": "npx tsx scripts/migration/taxonomy-fix.ts",
"enrich:import-hanindoc": "npx tsx scripts/data/import-hanindoc-enrichment.ts",
"promote:ca": "npx tsx scripts/data/promote-ca.ts",
"promote:au": "npx tsx scripts/data/promote-au.ts",
"urls:generate": "npx tsx scripts/seo/generate-url-list.ts",
"urls:submit": "npx tsx scripts/seo/submit-to-gsc.ts",
"urls:status": "npx tsx scripts/analytics/check-index-status.ts",
"crawl:alerts": "npx tsx scripts/ops/crawl-alert-feeds.ts"
```

Note: `seo:audit` already points to `scripts/seo/audit-indexing.ts` — no change needed.

- [ ] **Step 2: Remove stale entries**

Delete these 4 entries from `package.json` (files don't exist on disk):

```
"crawl:ca"
"crawl:au"
"enrich:report"
"taxonomy:remap"
```

- [ ] **Step 3: Verify package.json is valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json'))"
```

Expected: no output (valid JSON)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: update script paths and remove stale entries in package.json"
```

---

### Task 4: Archive reports

**Files:**
- Move: all files in `reports/` to `reports/archive/`

- [ ] **Step 1: Create archive and move files**

```bash
mkdir -p reports/archive
mv reports/*.md reports/archive/
mv reports/*.json reports/archive/
```

- [ ] **Step 2: Verify**

```bash
ls reports/
ls reports/archive/
```

Expected: `reports/` contains only `archive/`. `archive/` contains all 14 original files.

- [ ] **Step 3: Commit**

```bash
git add reports/
git commit -m "chore: archive one-time report outputs to reports/archive/"
```

---

## Chunk 3: Git Cleanup & CLAUDE.md

### Task 5: Git cleanup

- [ ] **Step 1: Delete merged branch**

```bash
git branch -d feat/list-ui-redesign
```

Expected: `Deleted branch feat/list-ui-redesign`

- [ ] **Step 2: Commit uncommitted new files**

The spec document and plan document should be committed:

```bash
git add docs/superpowers/
git commit -m "docs: add project cleanup design spec and implementation plan"
```

---

### Task 6: Write CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (currently empty)

- [ ] **Step 1: Write CLAUDE.md with project context**

```markdown
# Haninmap

Korean business directory for the US, Canada, and Australia.

## Tech Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (PostgreSQL) + Prisma ORM
- Vercel deployment, Google OAuth (NextAuth)

## Project Structure

```
src/
  app/           Pages and API routes (App Router)
  components/    React UI components
  lib/           Business logic, DB, SEO, i18n, enrichment
  hooks/         Custom React hooks
scripts/
  ops/           Periodic operational scripts (crawlers, trust scores)
  analytics/     Analysis and querying (GA4, GSC, audits)
  data/          Data ingestion, seeding, import, promotion
  migration/     One-time DB/category fixes
  seo/           SEO auditing and URL submission
data/            Static guide content (markdown)
prisma/          Database schema
reports/archive/ Historical audit reports
docs/            Design specs and plans
```

## Dev Commands

```bash
npm run dev          # Local dev server
npm run build        # Production build (runs prisma generate first)
npm run lint         # ESLint
npm run db:studio    # Prisma Studio (DB browser)
npm run db:push      # Push schema changes to DB
npm run db:migrate   # Run Prisma migrations
```

## Conventions

- **Commits:** conventional commits — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `style:`, `perf:`
- **Branches:** `feat/`, `fix/`, `chore/` prefix → merge to main → delete branch
- **Language:** Korean commit body OK, prefix always English
- **Small changes:** direct commits to main are fine
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: write CLAUDE.md with project structure and conventions"
```

---

### Task 7: Final verification

- [ ] **Step 1: Run build to verify nothing is broken**

```bash
npm run build
```

Expected: build succeeds with no new errors

- [ ] **Step 2: Check git status is clean**

```bash
git status
```

Expected: clean working tree, on branch main
