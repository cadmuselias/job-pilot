# Memory — Feature 04: Database Schema & Backend Setup

Last updated: 2026-10-18 15:42

## What was built
- Authenticated InsForge CLI non-interactively and linked project `jobpilot_2` (`33933db3-8a84-40ad-a30f-1d9577398114`, host: `https://gmf4pd3h.eu-central.insforge.app`).
- Installed all 4 InsForge agent skills (`insforge`, `insforge-cli`, `insforge-debug`, `insforge-integrations`) and `find-skills` into `.agents/skills/`.
- Created database migration `migrations/20261018111112_create-initial-schema.sql` and applied it to the live database using `npx -y @insforge/cli db migrations up --all`:
  - Created `profiles` table matching all columns, data types, and defaults specified in `context/architecture.md`.
  - Created `agent_runs` table with user relation and status constraints (`running`, `completed`, `failed`).
  - Created `jobs` table with source constraint (`search`, `url`), arrays for responsibilities/requirements/skills, and `company_research` JSONB.
  - Created `agent_logs` table with level constraints (`info`, `success`, `warning`, `error`) and relations to runs/jobs.
  - Added indexes on `user_id`, `run_id`, `status`, `found_at`, and `match_score`.
  - Added PostgreSQL trigger function `handle_updated_at` to auto-update `updated_at` on `profiles`.
  - Enabled Row Level Security (RLS) on `profiles`, `agent_runs`, `jobs`, and `agent_logs` with CRUD policies scoped strictly to `(SELECT auth.uid())`.
- Created private InsForge Storage bucket `resumes` (`Public: No`) via `npx -y @insforge/cli storage create-bucket resumes --private`.
- Enabled RLS on `storage.objects` and added path-scoped access policies restricting read, write, update, and delete operations to the file owner (`(storage.foldername(key))[1] = auth.jwt() ->> 'sub'`).
- Created `jp/types/index.ts` exporting global TypeScript definitions for `Profile`, `AgentRun`, `Job`, `AgentLog`, `WorkExperienceItem`, `EducationItem`, and supporting union types.
- Updated `context/progress-tracker.md` marking Phase 1, Feature 04 as complete.

## Decisions made
- CLI Migration Approach: Used standard InsForge migration file (`migrations/20261018111112_create-initial-schema.sql`) via CLI instead of ad-hoc SQL queries to ensure idempotent and versioned schema trackability.
- RLS Performance Optimization: Wrapped `auth.uid()` calls as `(SELECT auth.uid())` in RLS policies to prevent per-row evaluation by PostgreSQL.
- Storage Privacy & Path Isolation: Made the `resumes` bucket private so direct public URL access is prohibited; enforced path-based RLS on `storage.objects` where the top-level directory corresponds to the user's `sub`.
- TypeScript Entity Mapping: Placed domain types in `jp/types/index.ts` so all downstream server actions, agent scripts, and components have shared types.

## Problems solved
- Agent skills install via link failed with code 1; resolved by running `npx -y skills add insforge/agent-skills` which cloned and installed all 4 skills non-interactively.
- Identified schema structure of `storage.objects` (specifically `key` rather than `name`) and confirmed `(storage.foldername(key))[1]` syntax before locking down storage RLS policies.

## Current state
- Phase 1 (Foundation: 01 Homepage, 02 Auth, 03 PostHog, 04 Database Schema) is 100% complete and verified.
- Database tables (`profiles`, `agent_runs`, `jobs`, `agent_logs`) and storage bucket (`resumes`) are live and operational on InsForge.
- `npm run lint` passes with 0 errors and 0 warnings.
- `npm run build` compiles with Turbopack and passes type checking with 0 errors.

## Next session starts with
- Phase 2, Feature 05: Profile Page — Full UI:
  - Create profile page route `jp/app/profile/page.tsx` with mock data.
  - Implement completion indicator ring and missing field tags banner.
  - Implement resume section (drag & drop upload zone, PDF only, Select Resume button, Generate Resume button).
  - Implement form sections: Personal Info, Professional Info (tags for skills/industries), Work Experience (up to 3 roles), Education, and Job Preferences.

## Open questions
- None.
