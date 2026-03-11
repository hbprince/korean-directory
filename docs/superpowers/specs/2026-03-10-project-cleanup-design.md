# Project Cleanup & Organization Design

**Date:** 2026-03-10
**Status:** Approved
**Scope:** File structure, Git management, documentation

## Context

Haninmap is a Korean business directory (Next.js 14 + Supabase + Vercel). Solo developer with occasional collaborator. The project has accumulated disorganization: scripts are unsorted, reports are scattered, CLAUDE.md is empty, Git conventions are inconsistent, and a stale branch remains.

## Goals

1. Clean and logical file/folder structure
2. Consistent Git conventions (commits, branches)
3. CLAUDE.md with project context and conventions
4. Remove stale artifacts

## Non-Goals

- commitlint/husky automation
- CHANGELOG or version tagging
- Test framework setup
- PR/issue templates

---

## 1. File/Folder Structure

### 1.1 scripts/ Reorganization

Current: 30+ scripts flat in `scripts/` (except `scripts/seo/` and `scripts/promote/`).

Target:

```
scripts/
  ops/            # Periodic operational scripts
  analytics/      # Analysis and querying
  data/           # Data ingestion, seeding, import
  migration/      # One-time DB/category fixes
  seo/            # SEO tools (existing folder, expanded)
```

**Mapping:**

| Target | Files |
|--------|-------|
| `ops/` | `daily-gsc-submit.sh`, `calculate-trust-scores.ts`, `crawl-alert-feeds.ts`, `crawl-community-mentions.ts`, `crawl-gov-guides.ts`, `crawl-gov-guides-batch2.ts` |
| `analytics/` | `query-ga4-analytics.ts`, `query-gsc-analytics.ts`, `check-index-status.ts`, `sample-index-status.ts`, `db-check.ts`, `audit-bilingual.ts`, `audit-category-distribution.ts`, `audit-category-outliers.ts` |
| `data/` | `ingest.ts`, `seed-enrichment.ts`, `seed-guides.ts`, `import-hanindoc-enrichment.ts`, `promote-au.ts`, `promote-ca.ts`, `promote/` (directory) |
| `migration/` | `fix-all-categories.ts`, `fix-all-subcategories.ts`, `fix-categories.ts`, `fix-remaining-nulls.ts`, `fix-subcategories.ts`, `check-subcategories.ts`, `taxonomy-fix.ts`, `update-radiokorea-categories.ts`, `run-migration.ts` |
| `seo/` | existing `seo/audit-indexing.ts` + `seoFinalAudit.ts`, `submit-to-gsc.ts`, `generate-url-list.ts` |

**Important: `promote/` import chain.** `promote-ca.ts` and `promote-au.ts` import from `./promote/promote-country`, and `promote/promote-country.ts` uses `../../src/` relative paths to reach `src/lib/`. After moving to `scripts/data/`, the relative depth changes. Fix: update `promote/promote-country.ts` imports from `../../src/` to `../../../src/`.

**Stale package.json entries.** The following scripts are referenced in `package.json` but do not exist on disk: `crawl-ca.ts`, `crawl-au.ts`, `enrichment-report.ts`, `taxonomy-remap.ts`. These stale entries should be removed from `package.json`.

### 1.2 reports/ Archiving

Move all files in `reports/` to `reports/archive/`. The directory remains for future reports but current one-time outputs are archived.

### 1.3 Root Directory

No file moves needed. Temporary files (`urls-*.txt`, `.gsc-offset`, `logs/`) are already gitignored.

---

## 2. Git Management

### 2.1 Commit Convention

Conventional Commits format:

```
<type>: <description in Korean or English>

[optional body]
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `perf`

Examples:
- `feat: 비즈니스 상세 페이지에 지도 추가`
- `fix: 모바일 네비게이션 닫힘 버그 수정`
- `chore: 의존성 업데이트`

### 2.2 Branch Strategy (GitHub Flow)

- `main` = always deployable
- Feature branches: `feat/`, `fix/`, `chore/` prefix
- Merge to main, then delete branch
- Direct commits to main OK for small changes

### 2.3 Cleanup

- Delete merged `feat/list-ui-redesign` branch
- Commit currently uncommitted files with proper messages

---

## 3. CLAUDE.md

Write project context document covering:

- Tech stack and key dependencies
- Project structure (updated after reorganization)
- Development commands (from package.json scripts)
- Commit and branch conventions
- Key architectural notes (App Router, Prisma, i18n)

---

## 4. package.json Script Paths

Update ALL `package.json` script paths to reflect new `scripts/` subdirectory structure. This includes:

- `analytics/`: `db:check`, `audit:bilingual`, `audit:seo` (moved to seo/), `audit:category-distribution`, `audit:category-outliers`
- `data/`: `ingest`, `seed:enrich`, `enrich:import-hanindoc`, `promote:ca`, `promote:au`
- `migration/`: `taxonomy:fix`
- `seo/`: `seo:audit` (already correct), `urls:generate`, `urls:submit`, `audit:seo` (seoFinalAudit.ts)
- `ops/`: `crawl:alerts`

**Remove stale entries:** `crawl:ca`, `crawl:au`, `enrich:report`, `taxonomy:remap` (files don't exist on disk).

**Note:** This section covers only `package.json` entries. Any external invocations (cron jobs like `daily-gsc-submit.sh`, shell aliases, documentation) using direct `npx tsx scripts/X.ts` paths should also be audited and updated.

---

## Implementation Order

1. Move scripts to subdirectories
2. Update package.json script paths
3. Move reports to archive
4. Delete stale branch
5. Write CLAUDE.md
6. Commit everything with proper conventional commit messages
