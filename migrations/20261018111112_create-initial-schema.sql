-- Migration: 20261018111112_create-initial-schema.sql
-- Description: Initial schema for JobPilot (profiles, agent_runs, jobs, agent_logs, resumes storage RLS)

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  current_title TEXT,
  experience_level TEXT,
  years_experience INTEGER,
  skills TEXT[] DEFAULT '{}'::TEXT[],
  industries TEXT[] DEFAULT '{}'::TEXT[],
  work_experience JSONB DEFAULT '[]'::JSONB,
  education JSONB DEFAULT '[]'::JSONB,
  job_titles_seeking TEXT[] DEFAULT '{}'::TEXT[],
  remote_preference TEXT,
  preferred_locations TEXT[] DEFAULT '{}'::TEXT[],
  salary_expectation TEXT,
  cover_letter_tone TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  work_authorization TEXT,
  resume_pdf_url TEXT,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. AGENT_RUNS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  job_title_searched TEXT,
  location_searched TEXT,
  jobs_found INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ==========================================
-- 3. JOBS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('search', 'url')),
  source_url TEXT,
  external_apply_url TEXT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary TEXT,
  job_type TEXT,
  about_role TEXT,
  responsibilities TEXT[] DEFAULT '{}'::TEXT[],
  requirements TEXT[] DEFAULT '{}'::TEXT[],
  nice_to_have TEXT[] DEFAULT '{}'::TEXT[],
  benefits TEXT[] DEFAULT '{}'::TEXT[],
  about_company TEXT,
  match_score INTEGER,
  match_reason TEXT,
  matched_skills TEXT[] DEFAULT '{}'::TEXT[],
  missing_skills TEXT[] DEFAULT '{}'::TEXT[],
  company_research JSONB,
  found_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. AGENT_LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('info', 'success', 'warning', 'error')),
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_agent_runs_user_id ON public.agent_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON public.agent_runs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_run_id ON public.jobs(run_id);
CREATE INDEX IF NOT EXISTS idx_jobs_found_at ON public.jobs(found_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_match_score ON public.jobs(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_id ON public.agent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_run_id ON public.agent_logs(run_id);

-- ==========================================
-- 6. TRIGGER FOR UPDATED_AT
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON public.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 7. ROW LEVEL SECURITY (RLS) FOR APPLICATION TABLES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE TO authenticated
  USING (id = (SELECT auth.uid()));

-- Agent Runs Policies
DROP POLICY IF EXISTS "agent_runs_select_policy" ON public.agent_runs;
CREATE POLICY "agent_runs_select_policy" ON public.agent_runs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "agent_runs_insert_policy" ON public.agent_runs;
CREATE POLICY "agent_runs_insert_policy" ON public.agent_runs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "agent_runs_update_policy" ON public.agent_runs;
CREATE POLICY "agent_runs_update_policy" ON public.agent_runs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "agent_runs_delete_policy" ON public.agent_runs;
CREATE POLICY "agent_runs_delete_policy" ON public.agent_runs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Jobs Policies
DROP POLICY IF EXISTS "jobs_select_policy" ON public.jobs;
CREATE POLICY "jobs_select_policy" ON public.jobs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "jobs_insert_policy" ON public.jobs;
CREATE POLICY "jobs_insert_policy" ON public.jobs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "jobs_update_policy" ON public.jobs;
CREATE POLICY "jobs_update_policy" ON public.jobs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "jobs_delete_policy" ON public.jobs;
CREATE POLICY "jobs_delete_policy" ON public.jobs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Agent Logs Policies
DROP POLICY IF EXISTS "agent_logs_select_policy" ON public.agent_logs;
CREATE POLICY "agent_logs_select_policy" ON public.agent_logs
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "agent_logs_insert_policy" ON public.agent_logs;
CREATE POLICY "agent_logs_insert_policy" ON public.agent_logs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "agent_logs_update_policy" ON public.agent_logs;
CREATE POLICY "agent_logs_update_policy" ON public.agent_logs
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "agent_logs_delete_policy" ON public.agent_logs;
CREATE POLICY "agent_logs_delete_policy" ON public.agent_logs
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Privileges on Application Tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_logs TO authenticated;

-- ==========================================
-- 8. STORAGE RLS FOR RESUMES BUCKET
-- ==========================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "storage_resumes_select_policy" ON storage.objects;
CREATE POLICY "storage_resumes_select_policy" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket = 'resumes'
    AND (
      uploaded_by = (SELECT auth.jwt() ->> 'sub')
      OR (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "storage_resumes_insert_policy" ON storage.objects;
CREATE POLICY "storage_resumes_insert_policy" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket = 'resumes'
    AND (
      uploaded_by = (SELECT auth.jwt() ->> 'sub')
      OR (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "storage_resumes_update_policy" ON storage.objects;
CREATE POLICY "storage_resumes_update_policy" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket = 'resumes'
    AND (
      uploaded_by = (SELECT auth.jwt() ->> 'sub')
      OR (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
    )
  )
  WITH CHECK (
    bucket = 'resumes'
    AND (
      uploaded_by = (SELECT auth.jwt() ->> 'sub')
      OR (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
    )
  );

DROP POLICY IF EXISTS "storage_resumes_delete_policy" ON storage.objects;
CREATE POLICY "storage_resumes_delete_policy" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'resumes'
    AND (
      uploaded_by = (SELECT auth.jwt() ->> 'sub')
      OR (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
    )
  );

GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
