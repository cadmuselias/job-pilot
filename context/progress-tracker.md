# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 3 — Find Jobs Page
**Last completed:** 08 Resume PDF Generation from Profile
**Next:** 09 Find Jobs Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

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
- Feature 06 (Profile Save Logic):
  - Created `jp/lib/insforge-server.ts` utilizing `createServerClient` from `@insforge/sdk/ssr` with Next.js cookie integration and URL decoding for authenticated server-side operations.
  - Implemented `saveProfile` Server Action in `jp/actions/profile.ts` with structured upsert to the `profiles` table, dynamic completion score calculation, and PostHog `profile_completed` trigger for first-time completion.
  - Implemented `uploadResume` Server Action in `jp/actions/profile.ts` with immediate upload to InsForge Storage (`resumes/{user_id}/resume.pdf`), generating a 7-day signed URL (`createSignedUrl`) for the private bucket and updating `resume_pdf_url` on the profile record.
  - Enhanced `AuthProvider.tsx` to restore session from `insforge_access_token` cookie on reload, query `/api/auth/sessions/current` directly to populate in-memory `TokenManager`, and prevent premature cookie clearance.
  - Updated `ResumeUpload.tsx` error handling to cleanly revert file state on error and display a login action banner when unauthorized.
  - Removed dummy fallback data from `app/profile/page.tsx` so actual user profile state or accurate empty state is always displayed.
  - Created completion calculation utility `calculateProfileCompletion` in `jp/lib/utils.ts` and exported `MATCH_THRESHOLD = 70`.
  - Configured Next.js 16 Partial Prerendering on `/profile` with a `<Suspense>` boundary and a custom `ProfileSkeleton` placeholder.
- Feature 07 (AI Profile Extraction from Resume):
  - Implemented `extractResumeAction` in `jp/actions/profile.ts`: verifies user auth, extracts PDF text via `pdf-parse`, and calls Google Gemini (`gemini-3-flash-preview` via `@google/genai`) with structured JSON schema prompt.
  - Multi-tier PDF source resolution: parses incoming in-memory `FormData`, falls back to `profile.resume_pdf_url`, then generates fresh signed URL from InsForge Storage (`resumes/{user.id}/resume.pdf`), then falls back to `storage.download()`.
  - Added Gemini multimodal PDF fallback (`inlineData: { mimeType: 'application/pdf', data: base64 }`) ensuring robust extraction even if PDF text parsing fails due to complex/image PDF formatting.
  - Added "Extract from Resume" CTA button in `jp/components/profile/ResumeUpload.tsx` with loading spinner, disabled state, and error/success messaging.
  - Created `jp/components/profile/ProfileView.tsx` to coordinate client state between `ResumeUpload` and `ProfileForm` using an idiomatic key-based re-render with smart field merging (existing OAuth info and filled fields preserved if omitted in resume).
  - Added an informative notification banner in `jp/components/profile/ProfileForm.tsx` alerting the user that fields were populated from their resume and ready for review and saving.
  - Imprinted UI patterns to `context/ui-registry.md` and passed 3-layer `/review` audit with zero issues. Next.js 16 production build verified.
- Feature 08 (Resume PDF Generation from Profile):
  - Created dedicated Next.js API Route Handler at `app/api/resume/generate/route.ts` with Node.js runtime and authenticated InsForge SSR server client.
  - Built ATS-optimized single-page PDF template in `jp/lib/pdf/ResumeTemplate.tsx` using `@react-pdf/renderer` strictly adhering to supported properties (`Helvetica`, standard typography, contact bar, summary, competencies, experience bullets, education).
  - Implemented early validation guardrail requiring candidate full name and either work experience or skills before invoking generation.
  - Gemini AI editorial enhancement: rewrites raw profile data into concise executive summary and achievement-oriented work experience bullets with strict JSON output.
  - Graceful raw profile fallback: if Gemini encounters rate limits or transient errors, safely compiles the PDF using raw profile fields without failing generation.
  - Server-side PDF compilation: renders binary buffer via `renderToBuffer()`, converts to type-safe `File` via `Uint8Array`, uploads directly to InsForge Storage (`resumes/{user_id}/resume.pdf` with `upsert: true`), resolves signed/public URL, and persists `resume_pdf_url` on `profiles`.
  - UI reactive integration in `ResumeUpload.tsx` & `ProfileView.tsx`: provides "Generate Resume from Profile" action, loading indicator ("Polishing with AI..."), error/success banners, and immediate active document link ("View" / "Replace"). Next.js router revalidation triggered.
  - Added Resume Removal flow: implemented `deleteResumeAction` in `jp/actions/profile.ts` (removes `${user.id}/resume.pdf` from InsForge Storage bucket and clears `profiles.resume_pdf_url = null`). Added "Remove" action in `ResumeUpload.tsx` allowing candidates to delete uploaded/generated CVs and cleanly reset back to the empty upload drop-zone.

---

## Notes

- InsForge backend has active OAuth providers: Google and GitHub.
- Anonymous key and backend URL configured in `.env.local`.


