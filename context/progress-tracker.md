# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 04 Database Schema
**Next:** 05 Profile Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Dedicated `/callback` route used for handling OAuth return parameters (`insforge_code`), executing code exchange, and synchronizing auth cookies before forwarding to `/dashboard`.
- Next.js 16 `proxy.ts` convention implemented: checks for the session cookie `insforge_access_token` and intercepts unauthenticated access to `/dashboard`, `/profile`, `/find-jobs`, redirecting to `/login?returnTo=...`.
- Client-side `AuthProvider` / `useAuth` hook tracks reactive auth state and keeps cookies synchronized across tab sessions.
- PostHog client setup in `lib/posthog-client.ts` with manual pageview tracking (`capture_pageview: false`) and wrapped via `PostHogProvider` in root `app/layout.tsx`.
- PostHog server-side client implemented in `lib/posthog-server.ts` with `posthog-node` (`flushAt: 1`, `flushInterval: 0`).
- Identity lifecycle integrated: `posthog.identify()` on user authentication and `posthog.reset()` on sign-out/session clear.
- InsForge migration `20261018111112_create-initial-schema.sql` applied to live database:
  - Created tables `profiles`, `agent_runs`, `jobs`, `agent_logs` adhering strictly to `context/architecture.md`.
  - Configured Row Level Security (RLS) on all 4 tables restricting access exclusively to authenticated owners via `(SELECT auth.uid())`.
  - Created private `resumes` storage bucket with path-scoped RLS policies on `storage.objects` allowing authenticated users access only to their own files (`(storage.foldername(key))[1] = auth.jwt() ->> 'sub'`).
  - Added indexes for user lookups, statuses, and job search sort fields (`found_at`, `match_score`).
  - Implemented `handle_updated_at` trigger for auto-updating `updated_at` timestamp on `profiles`.
  - Exported global TypeScript interfaces in `jp/types/index.ts`.

---

## Notes

- InsForge backend has active OAuth providers: Google and GitHub.
- Anonymous key and backend URL configured in `.env.local`.


