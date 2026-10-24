# Memory — Feature 07: AI Profile Extraction from Resume

Last updated: 2026-10-24 21:38

## What was built

- Implemented `extractResumeAction` in `jp/actions/profile.ts`:
  - Next.js Server Action verifying current user authentication via `createInsforgeServer()`.
  - Multi-tier PDF source resolution: inspects incoming `FormData` ("resume" File), falls back to `profile.resume_pdf_url`, then fetches fresh signed URL via `storage.from("resumes").createSignedUrl(...)`, and finally falls back to `storage.from("resumes").download(...)`.
  - Dual extraction engine: parses PDF text using `pdf-parse`; if text extraction fails or yields insufficient text (<50 characters), seamlessly falls back to Google Gemini native multimodal PDF parsing (`inlineData: { mimeType: 'application/pdf', data: base64 }`).
  - Uses Google GenAI SDK (`@google/genai`) with `gemini-3-flash-preview` and `responseMimeType: "application/json"` to generate structured candidate profile fields.
- Created `jp/components/profile/ProfileView.tsx`:
  - Client component coordinating state between `ResumeUpload` and `ProfileForm`.
  - Smart synchronous field merging: merges extracted data with existing initial profile data (preserves user's email, name, existing values if not found in resume).
  - Uses key-based remounting (`ProfileForm key={...-v${extractVersion}}`) to eliminate cascading `useEffect` state updates and satisfy React 19 / ESLint compiler rules.
- Updated `jp/components/profile/ResumeUpload.tsx`:
  - Added "Extract from Resume" CTA button with `Sparkles` icon, dynamic `Loader2 animate-spin` loading indicator, disabled state, and contextual helper text.
  - Added extraction success banner (`bg-success-lightest`, `border-success-light`, `text-success`) and error banner (`bg-error/10`, `border-error/20`, `text-error`).
  - Preserved `selectedFile` in component state so the client can forward the in-memory uploaded file directly to `extractResumeAction` via `FormData`.
- Updated `jp/components/profile/ProfileForm.tsx`:
  - Added `isExtracted` prop and dismissible feedback banner (`bg-accent-muted/40`, `border-accent/30`, `text-accent`) notifying users that fields were auto-filled from their resume and prompting review before clicking Save Profile.
- Updated project context files:
  - `context/progress-tracker.md`: Marked Feature 07 complete with decisions.
  - `context/ui-registry.md`: Imprinted `ResumeUpload`, `ProfileForm`, and `AIExtractionNotice` visual design tokens.
  - Executed `/review` audit with zero issues across all 3 layers (plan alignment, system integrity, production readiness).
  - Verified `npm run lint` (0 errors) and Next.js Turbopack `npm run build` (exit code 0).

## Decisions made

- Dual PDF Extraction Pipeline: `pdf-parse` is used for high-speed text extraction from text-based PDFs. For complex, scanned, or non-standard PDFs, Gemini's native multimodal inline PDF parser acts as a robust server-side fallback.
- Client State Coordination via Key Remounting: Kept `ProfileForm` uncontrolled with `initialData` defaults and avoided synchronization `useEffect` cycles in favor of key-based re-rendering (`key="profile-form-v${extractVersion}"`) orchestrated by `ProfileView`.
- Manual Review Before Save: Extraction populates client-side form state without automatically writing to the database, ensuring candidates retain full control to edit and review before persisting to InsForge PostgreSQL.
- Server-Side Gemini API Integration: `GEMINI_API_KEY` is accessed strictly inside the Server Action and is never exposed to the client bundle.

## Problems solved

- "Could not extract text from this PDF":
  - Next.js Turbopack server environment conflict with internal worker dependencies in PDF text parsers.
  - Resolved by passing `selectedFile` directly from the client via `FormData` rather than waiting for background storage replication, adding multi-tier storage fallback, and implementing native Gemini multimodal PDF parsing as a resilient fallback.
- React compiler `set-state-in-effect` lint warning in `ProfileForm`:
  - Avoided cascading `useEffect` state updates by delegating data merging to `ProfileView` and remounting the form with fresh `initialData`.

## Current state

- Phase 1 (Foundation) and Phase 2 through Feature 07 are 100% complete, reviewed, imprinted, and verified.
- `npm run lint` passes with 0 errors and 0 warnings.
- `npm run build` passes with exit code 0.
- All changes committed and pushed to `main` branch.

## Next session starts with

- Phase 2, Feature 08: Resume PDF Generation from Profile
  - Plan and architect route/action to generate a clean professional PDF resume from current profile data using AI + `@react-pdf/renderer`.
  - Wire "Generate Resume from Profile" button in `jp/components/profile/ResumeUpload.tsx`.
  - Save rendered PDF buffer to InsForge Storage at `resumes/{user_id}/resume.pdf` (upsert: true) and update `resume_pdf_url` on `profiles`.

## Open questions

- None.
