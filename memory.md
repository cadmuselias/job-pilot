# Memory — Feature 06: Profile Save Logic & CV Upload Stabilization

Last updated: 2026-10-24 17:20

## What was built
- Implemented `jp/actions/profile.ts`:
  - `saveProfile`: Server Action that validates authentication via `createInsforgeServer()`, formats roles, education, and skills, calculates dynamic completion score, upserts into the `profiles` table, triggers PostHog `profile_completed` event on first-time 100% completion, and calls `revalidatePath('/profile')`.
  - `uploadResume`: Server Action that validates PDF format and size (<5MB), uploads directly to InsForge Storage (`resumes/{user_id}/resume.pdf`), mints a 7-day signed URL (`createSignedUrl(storagePath, 604800)`) for the private bucket, updates `resume_pdf_url` on the user's profile, and calls `revalidatePath('/profile')`.
- Implemented `jp/lib/insforge-server.ts`: Server-side client factory utilizing `createServerClient` from `@insforge/sdk/ssr` with Next.js headers `cookies()` integration and `decodeURIComponent` token parsing.
- Implemented `jp/lib/utils.ts`: Created pure utility `calculateProfileCompletion` to compute percentage (0-100%) and missing required fields (`fullName`, `phone`, `location`, `currentTitle`, `experienceLevel`, `yearsExperience`, `skills`, `workExperience`, `education`, `jobTitlesSeeking`) and exported `MATCH_THRESHOLD = 70`.
- Enhanced `jp/components/auth/AuthProvider.tsx`:
  - Added cookie restoration on mount (`getAuthCookie()`).
  - Added direct verification against backend `/api/auth/sessions/current` with active Bearer token to seed in-memory `TokenManager.saveSession()`.
  - Protected cookies from being wiped on client initialization; cookie deletion now occurs only on explicit HTTP 401 Unauthorized responses.
- Updated `jp/components/profile/ResumeUpload.tsx`:
  - Corrected file state management so `selectedFileName` only persists upon successful upload and reverts if an error occurs.
  - Added direct login navigation link within the error banner when unauthorized errors occur.
- Updated `jp/app/profile/page.tsx`:
  - Removed hardcoded mock fallback data ("Faizan Ali", "Vercel", "faizan@jsmastery.pro").
  - Form now loads real authenticated profile data from InsForge DB or clean empty states.
  - Implemented Next.js 16 Partial Prerendering with `<Suspense>` boundary and `ProfileSkeleton`.
- Updated documentation in `context/progress-tracker.md` and `context/ui-registry.md`.

## Decisions made
- Private Storage Signed URLs: Since the `resumes` bucket is private (`Public: No`), `createSignedUrl` with 7 days TTL (604,800s) is generated for document viewing/previews rather than public URLs.
- Two-Way Session Seeding: Instead of relying strictly on in-memory state on page reload, client reads `insforge_access_token` from cookies and verifies with backend sessions endpoint to populate SDK `TokenManager` and React `user` state.
- Pure Server Actions for Data Mutations: Kept all DB writes, storage uploads, and PostHog server event emissions in `actions/profile.ts`, keeping components purely presentation-focused.

## Problems solved
- "Unauthorized. Please log in again" on CV Upload: Root cause was `AuthProvider` previously calling `getCurrentUser()` without an in-memory session on page load, receiving `null`, and prematurely deleting `insforge_access_token` from `document.cookie`. When `uploadResume` ran, the Server Action received no auth cookie. Fixed by seeding the token from cookie and preserving it unless explicitly unauthorized.
- Conflicting UI state on upload failure: `selectedFileName` was being set before `uploadResume` completed, showing both a green "Uploaded: Italy CV.pdf" checkmark and a red error banner on failure. Fixed by only persisting file selection upon upload success.

## Current state
- Phase 1 (Foundation) and Phase 2 (Features 05 and 06) are 100% complete and verified.
- `npm run lint` passes with 0 errors and 0 warnings.
- `npm run build` compiles with Turbopack, and TypeScript checks pass with 0 errors.
- Working tree clean, committed, and pushed to `origin/main`.

## Next session starts with
- Phase 2, Feature 07: AI Profile Extraction from Resume:
  - Add "Extract from Resume" button in `ResumeUpload` component after a resume PDF is uploaded or present.
  - Extract raw text from PDF buffer using `pdf-parse`.
  - Feed text to GPT-4o / OpenRouter to extract structured JSON matching profile fields.
  - Auto-fill `ProfileForm` fields with extracted data for user review and saving.

## Open questions
- None.
