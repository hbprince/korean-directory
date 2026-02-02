BEGIN;

-- ============================================================
-- 1) Add countryCode column to Business table
--    Default 'US' preserves all existing ~71K records
-- ============================================================
ALTER TABLE public."Business" ADD COLUMN IF NOT EXISTS "countryCode" TEXT NOT NULL DEFAULT 'US';
CREATE INDEX IF NOT EXISTS "Business_countryCode_idx" ON public."Business"("countryCode");

-- ============================================================
-- 2) Create PromotionRun table for tracking promotion pipeline
-- ============================================================
CREATE TABLE IF NOT EXISTS public."PromotionRun" (
  "id"              SERIAL PRIMARY KEY,
  "countryCode"     TEXT NOT NULL,
  "status"          TEXT NOT NULL DEFAULT 'running',
  "startedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt"     TIMESTAMP(3),
  "totalProcessed"  INTEGER NOT NULL DEFAULT 0,
  "totalPromoted"   INTEGER NOT NULL DEFAULT 0,
  "totalSkipped"    INTEGER NOT NULL DEFAULT 0,
  "totalErrors"     INTEGER NOT NULL DEFAULT 0,
  "skippedSample"   JSONB,
  "errorLog"        TEXT
);

CREATE INDEX IF NOT EXISTS "PromotionRun_countryCode_idx" ON public."PromotionRun"("countryCode");

COMMIT;
