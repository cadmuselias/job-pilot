# Memory — Feature 08: Resume PDF Generation from Profile

Last updated: 2026-10-24 23:18

## What was built

- Installed `@react-pdf/renderer` in `jp/`.
- Created `jp/lib/pdf/ResumeTemplate.tsx`:
  - ATS-optimized single-page PDF document template built with `@react-pdf/renderer`.
  - Strictly follows supported CSS properties and uses project color/typography tokens (`Helvetica`, `Helvetica-Bold`).
  - Structured sections: Header & Contact Bar, Professional Summary, Core Competencies & Skills, Work Experience with achievement bullet points, and Education.
  - Explicitly typed return `ReactElement<DocumentProps>`.
- Created `jp/app/api/resume/generate/route.ts`:
  - Next.js API Route Handler verifying user authentication via `createInsforgeServer()`.
  - Early guardrail checking that candidate full name and either work experience or skills exist before generating.
  - AI editorial enhancement: queries Google Gemini (`gemini-3-flash-preview` via `@google/genai`) to rewrite raw experience bullets and summary into high-impact accomplishments with strict JSON output.
  - Graceful fallback: seamlessly falls back to raw profile fields if Gemini encounters errors or rate limits.
  - Server-side PDF compilation via `renderToBuffer()`, converted to type-safe `File` via `Uint8Array`.
  - Uploads buffer directly to InsForge Storage (`resumes/{user.id}/resume.pdf` with `upsert: true`), resolves signed/public URL, and persists `resume_pdf_url` on `profiles`.
- Implemented `deleteResumeAction` in `jp/actions/profile.ts`:
  - Deletes `${user.id}/resume.pdf` from the InsForge Storage `resumes` bucket.
  - Resets `resume_pdf_url = null` in the `profiles` table.
  - Revalidates `/profile`.
- Enhanced `jp/components/profile/ResumeUpload.tsx`:
  - Complete resume lifecycle UI:
    - **Upload**: Drag-and-drop zone and file selector with 5MB limit.
    - **Extract**: "Extract from Resume" CTA triggering `extractResumeAction`.
    - **Generate**: "Generate Resume from Profile" CTA calling `/api/resume/generate` with loading spinner ("Polishing with AI...").
    - **Active Badge Actions**: `View` (opens PDF in new tab), `Download` (client-side blob download saving local `.pdf` file with fallback), `Replace` (re-triggers file selector), and `Remove` (purges file from storage & DB, restoring clean empty drop-zone).
    - Status banners for upload errors, extraction error/success, and generation error/success.
- Updated `jp/components/profile/ProfileView.tsx`:
  - Coordinates active resume URL across upload, generate, and delete actions, triggering `router.refresh()`.
- Updated project context files:
  - `context/progress-tracker.md`: Marked Phase 2 Feature 08 complete with full decisions log.
  - `context/ui-registry.md`: Imprinted visual patterns for `ResumeUpload` and `ResumeGenerateAction`.
- Verification & Quality:
  - Passed 3-layer `/review` audit with 0 issues.
  - `npm run lint`: 0 errors, 0 warnings.
  - `npm run build`: Production build and route generation succeeded with exit code 0.
  - All changes committed and pushed to `main`.

## Decisions made

- **Minimum Profile Guardrail**: Early validation requires candidate full name and either work experience or skills before invoking PDF generation, preventing blank document generation.
- **Dedicated Route Handler**: Used `app/api/resume/generate/route.ts` to isolate `@react-pdf/renderer` buffer compilation and Gemini processing from client bundles.
- **Graceful Fallback**: If Gemini encounters rate limits or transient errors, the pipeline falls back to compiling the PDF from raw profile data without failing generation.
- **Full Lifecycle Resume Management**: Included explicit View, Download (client-side Blob streamer), Replace, and Remove (storage deletion + DB nullification) to give users complete control over their CV assets.
- **Strict Token Adherence**: All component styles adhere to semantic design tokens (`bg-surface`, `border-border`, `text-accent`, `bg-error/10`, `bg-success-lightest`).

## Problems solved

- **Next.js 16 `cacheComponents` Route Conflict**:
  - Removed incompatible route segment configs (`export const dynamic = 'force-dynamic'` and `export const runtime = 'nodejs'`) to satisfy Next.js 16 build requirements.
- **TypeScript `Buffer` to `BlobPart` Compatibility**:
  - Converted `@react-pdf/renderer` buffer to `Uint8Array` when instantiating `new File([new Uint8Array(pdfBuffer)], ...)` to eliminate Node/browser buffer typing conflicts.
- **Missing Resume Deletion & Download UX**:
  - Resolved user inability to clear or download their resume by implementing `deleteResumeAction` and `handleDownloadResume` with fallback.

## Current state

- Phase 1 (Foundation) and Phase 2 (Profile Page) are 100% complete, reviewed, imprinted, and verified.
- `npm run lint` passes with 0 errors and 0 warnings.
- `npm run build` passes with exit code 0.
- All changes committed and pushed to `main` branch.

## Next session starts with

- **Phase 3 — Find Jobs Page: Feature 09 (Find Jobs Page — Full UI)**
  - Build the complete Find Jobs page UI (`app/find-jobs/page.tsx` and components in `components/find-jobs/`) with mock data.
  - Implement Search Controls Card at top (Job Title input, Location input, Find Jobs button, results banner).
  - Implement Jobs List section below (Filter bar, Jobs table with match score progress bar, salary estimate, source badge, pagination).

## Open questions

- None.
