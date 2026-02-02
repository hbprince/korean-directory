BEGIN;

-- ============================================================
-- Enable Row Level Security on all public tables
-- ============================================================

-- 1) Enable RLS
ALTER TABLE public."Business" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."GooglePlace" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EnrichmentQueue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EnrichmentBudget" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PageMetric" ENABLE ROW LEVEL SECURITY;

-- Optional hardening: FORCE RLS so even table owners obey policies
-- (service_role bypasses RLS regardless)
ALTER TABLE public."Business" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."Category" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."GooglePlace" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."EnrichmentQueue" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."EnrichmentBudget" FORCE ROW LEVEL SECURITY;
ALTER TABLE public."PageMetric" FORCE ROW LEVEL SECURITY;

-- 2) Drop any existing policies to avoid duplicates
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('Business','Category','GooglePlace','EnrichmentQueue','EnrichmentBudget','PageMetric')
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- ============================================================
-- 3) Public read policies (anon + authenticated)
--    These tables power the directory listing/detail pages.
-- ============================================================
CREATE POLICY "public_read_business"
  ON public."Business"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_category"
  ON public."Category"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "public_read_googleplace"
  ON public."GooglePlace"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- 4) Service-only tables: deny all for anon + authenticated
--    Service role bypasses RLS, so server jobs still work.
-- ============================================================
CREATE POLICY "deny_all_enrichmentqueue"
  ON public."EnrichmentQueue"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_all_enrichmentbudget"
  ON public."EnrichmentBudget"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "deny_all_pagemetric"
  ON public."PageMetric"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMIT;
