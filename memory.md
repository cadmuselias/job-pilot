# Memory — Feature 10: Arbeitnow Job Discovery & AI Scoring

Last updated: 2026-10-25 15:45

## What was built

- Adopted **Arbeitnow** as the zero-key, free public ATS job feed provider for JobPilot:
  - `jp/lib/arbeitnow.ts`: Fetches listings from `https://www.arbeitnow.com/api/job-board-api`, applies weighted tokenized matching across `title`, `tags`, `description`, and location/remote preferences, strips HTML formatting, and extracts structured job fields.
- Implemented Job Discovery & AI Scoring Agent:
  - `jp/agent/job-discovery.ts`: Coordinates end-to-end discovery. Batches up to 8-10 candidate jobs into a single Gemini (`gemini-3-flash-preview`) prompt with `responseMimeType: "application/json"`, returning structured compatibility evaluations (`matchScore`, `matchReason`, `matchedSkills`, `missingSkills`, `salary`, `aboutRole`, `responsibilities`, `requirements`, `niceToHave`, `benefits`, `aboutCompany`).
  - Persists runs to `agent_runs` (`status: running -> completed/failed`), audit logs to `agent_logs`, and scored job listings to `jobs` table with `source: 'search'`.
  - Performs deduplication on `jobs.source_url` for the authenticated user to avoid redundant entries.
  - Emits PostHog server events (`job_search_started`, `job_found`).
- Created API Route Handler:
  - `jp/app/api/agent/find/route.ts`: Authenticates user session with InsForge SSR client, parses `{ jobTitle, location }`, invokes the discovery agent, and returns `{ success: true, count, strongMatchesCount, jobs }`.
- Connected Find Jobs Frontend:
  - `jp/components/find-jobs/SearchControls.tsx`: Added `isLoading` state, spinning `Loader2` indicator, "Discovering Jobs..." label, and disabled state on inputs/button during search.
  - `jp/components/find-jobs/FindJobsView.tsx`: Wired `handleSearchSubmit` to `POST /api/agent/find`. Updates real discovered jobs directly in state, updates the green discovery feedback banner (*"Found X jobs and saved Y strong matches"*), and displays error alerts if unauthenticated or on failure.
- Documentation & Registries:
  - `context/progress-tracker.md`: Marked Phase 3 Feature 10 complete with technical decision log.
  - `context/ui-registry.md`: Imprinted `SearchControls` loading state patterns.
- Verification:
  - ESLint: 0 errors, 0 warnings.
  - Next.js Turbopack build (`npm run build`): Exit code 0, static prerender and dynamic route `ƒ /api/agent/find` generated.

## Decisions made

- **Arbeitnow Over Paid Adzuna**: Sourced listings from Arbeitnow's public endpoint with zero API key requirement, generous rate limits, and full ATS descriptions (leveraging richer text context for higher quality AI matching).
- **Batched Gemini Scoring**: Evaluated all 8-10 candidates against candidate profile in a single JSON-structured Gemini call (~2s execution) rather than sequential round trips.
- **Deduplication in DB**: Matched `source_url` against existing records for `user_id` before inserting into `jobs`, updating existing records if re-discovered.
- **Graceful Unauthenticated UX**: Protected route returns 401 and UI surfaces a clear alert prompting the user to log in to search and save jobs to their pipeline.

## Problems solved

- **Next.js 16 Partial Prerendering on /find-jobs**:
  - Avoided uncached dynamic cookie reads during static prerendering by keeping the page statically rendered while delegating authenticated search and dynamic discovery to the client coordinator and API route.
- **Clean ESLint 9 Compliance**:
  - Removed unused eslint-disable comment in `agent/job-discovery.ts` to ensure 0 errors and 0 warnings.

## Current state

- Phase 1 (Foundation), Phase 2 (Profile Page), and Phase 3 Features 09 & 10 (Find Jobs UI & Arbeitnow Discovery) are 100% complete and verified.
- Production build compiles cleanly (`npm run build` exit code 0).
- Dev server running on `http://localhost:3000`.

## Next session starts with

- **Phase 3 — Feature 11: Filter + Sort + Pagination**
  - Run `/architect feature 11` before building.
  - Wire filter tabs (All Matches, High Match >= 70, Low Match < 70), sort dropdown (Match Score, Newest, Oldest), text search, and pagination to real InsForge DB data.
  - Support fetching and updating the user's saved pipeline from InsForge.

## Open questions

- None.
