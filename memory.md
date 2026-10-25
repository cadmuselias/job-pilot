# Memory — Feature 10: Arbeitnow Job Discovery, AI Scoring & Client Infrastructure Hardening

Last updated: 2026-10-25 17:37

## What was built

- **Arbeitnow Job Discovery & AI Scoring** (Feature 10):
  - `jp/lib/arbeitnow.ts`: Free ATS job feed scraper and relevance ranker against candidate preferences with HTML tag stripping.
  - `jp/agent/job-discovery.ts`: End-to-end Gemini (`gemini-3-flash-preview`) scoring agent with batched JSON schema evaluation, DB deduplication by `source_url`, audit logging to `agent_runs` and `agent_logs`, and PostHog event logging (`job_search_started`, `job_found`).
  - `jp/app/api/agent/find/route.ts`: Authenticated Next.js route handler supporting Bearer tokens and cookie authentication.
  - `jp/components/find-jobs/FindJobsView.tsx`: Live search, real database pipeline loaded on mount, sample mock jobs removed, multi-tier auth resolution.
  - `jp/components/find-jobs/SearchControls.tsx`: Loading state with spinner (`Loader2`) and label transitions.
  - `jp/proxy.ts`: Route protection for `/find-jobs`, `/dashboard`, `/profile`.
- **Client Infrastructure & Console Error Resolution**:
  - `jp/app/layout.tsx`: Added `suppressHydrationWarning` to `<html>` and `<body>` tags to guard against hydration mismatches caused by 3rd-party browser extensions (`Scribe`, `WebCRX`).
  - `jp/lib/posthog-client.ts`: Configured PostHog initialization with `autocapture: false`, `disable_session_recording: true`, `capture_dead_clicks: false`, and `disable_external_dependency_loading: true`, preventing PostHog from attempting to load external CDN scripts in local dev or adblocked environments.
- **Registries & Documentation**:
  - `context/ui-registry.md`: Imprinted `SearchControls`, `JobFilters`, `JobsTable`, `JobsPagination`, `FindJobsView`, `FindJobsPage`, and `RootLayout`.
  - `context/progress-tracker.md`: Updated Phase 3 Feature 10 with implementation notes and hardened client infrastructure details.

## Decisions made

- **PostHog Minimal Client**: Disabled external dependency loading and session recording in the client SDK since JobPilot relies exclusively on custom business events (`job_search_started`, `job_found`, `profile_completed`, `company_researched`) without invasive DOM recording.
- **Hydration Guard**: Used `suppressHydrationWarning` on `<html>` and `<body>` root elements rather than removing extensions or using client-only rendering, preserving SSR performance.
- **Multi-Tier Token Resolution**: Client extracts auth token across memory, cookies, and localStorage, sending `Authorization: Bearer <token>` to prevent 401 unauthenticated drops during API requests.
- **Batched Gemini AI Scoring**: Evaluated all candidate jobs in a single structured Gemini prompt call (~2s round-trip).

## Problems solved

- **5 Browser Console Errors on `/find-jobs`**:
  - PostHog `[SessionRecording] "could not load recorder"` and `[Dead Clicks] "failed to load script"`: Fixed by setting `disable_session_recording: true`, `capture_dead_clicks: false`, and `disable_external_dependency_loading: true` in `lib/posthog-client.ts`.
  - React Hydration Mismatch (`webcrx-bridged=""`, `data-scribe-recorder-ready="true"`): Fixed by setting `suppressHydrationWarning` on `<html>` and `<body>` in `app/layout.tsx`.
- **401 Unauthorized for Authenticated Search**:
  - Fixed by passing explicit `Authorization: Bearer <token>` in `FindJobsView.tsx` with server-side `overrideToken` extraction in `insforge-server.ts`.
- **Sample Mock Jobs Persisting**:
  - Replaced mock job array with real saved jobs from the database.

## Current state

- Phase 1 (Foundation), Phase 2 (Profile Page), and Phase 3 Features 09 & 10 (Find Jobs UI & Discovery Engine) are 100% complete and verified.
- Production build compiles cleanly (`npm run build` exit code 0).
- ESLint passes cleanly (`npx eslint .` 0 errors, 0 warnings).
- Zero console errors in browser devtools.
- All code committed and pushed to `main` (`628ed37`).

## Next session starts with

- **Phase 3 — Feature 11: Filter + Sort + Pagination**
  - Run `/architect feature 11` before building.
  - Wire client-side filtering (Match Score threshold >= 70% vs all), sorting (Match Score desc, Found At desc, Found At asc), and pagination (10 per page) over the active jobs array in `FindJobsView.tsx`.
  - Optionally support server-side query params in `GET /api/agent/find` for scaling larger datasets.

## Open questions

- None.
