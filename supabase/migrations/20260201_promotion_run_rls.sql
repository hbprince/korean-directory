BEGIN;

-- ============================================================
-- RLS for PromotionRun: deny all access via anon/authenticated
-- Service role bypasses RLS, so server-side scripts still work.
-- ============================================================

ALTER TABLE public."PromotionRun" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PromotionRun" FORCE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid duplicates
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'PromotionRun'
  )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

CREATE POLICY "deny_all_promotionrun"
  ON public."PromotionRun"
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

COMMIT;
