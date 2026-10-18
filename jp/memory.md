# Memory — Feature 02: Auth

Last updated: 2026-10-16 13:55

## What was built
- Installed `@insforge/sdk@latest` in `jp/`.
- Configured backend environment credentials in `jp/.env.local` (`NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_ANON_KEY`).
- Created InsForge browser client instance in `jp/lib/insforge-client.ts`.
- Created reactive `AuthProvider` and `useAuth` hook in `jp/components/auth/AuthProvider.tsx`:
  - Tracks user and loading state via `insforge.auth.getCurrentUser()` and `onAuthStateChange`.
  - Automatically synchronizes the `insforge_access_token` session cookie with browser cookies for edge proxy recognition.
  - Exposes `signInWithOAuth` (Google & GitHub) and `signOut`.
- Wrapped application root layout in `jp/app/layout.tsx` with `<AuthProvider>`.
- Created high-aesthetic login page at `jp/app/(auth)/login/page.tsx`:
  - Ambient glowing mesh backdrop (`bg-hero-gradient` + `bg-diagonal-stripes`).
  - Elevated glassmorphic card (`rounded-3xl border border-border bg-surface/95 backdrop-blur-xl shadow-xl`).
  - Feature chips ("Instant matching", "Company dossiers", "No password needed").
  - Polished Google & GitHub OAuth action buttons with hover lift and micro-interactions.
  - Return link `← Back to home` and disclaimer links.
- Created OAuth callback handler at `jp/app/(auth)/callback/page.tsx`:
  - Intercepts OAuth redirect from InsForge.
  - Completes PKCE code exchange verification and forwards user to return target or home page (`"/"`).
  - Error state handling with dedicated failure card and return button.
- Created Next.js 16 request proxy at `jp/proxy.ts`:
  - Replaces deprecated `middleware.ts` per Next.js 16 conventions.
  - Intercepts unauthenticated access to `/dashboard/:path*`, `/profile/:path*`, and `/find-jobs/:path*`.
  - Redirects visitors to `/login?returnTo=...`.
- Updated homepage components (`Navbar.tsx`, `Hero.tsx`, `CallToAction.tsx`):
  - CTAs ("Start for free" and "Get Started") route to `/dashboard` when authenticated, `/login` when unauthenticated.
  - Navbar shows user status and sign-out button when authenticated.
- Imprinted `LoginPage` and `CallbackPage` to `context/ui-registry.md`.
- Updated `context/progress-tracker.md` marking Feature 02 complete.

## Decisions made
- Next.js 16 `proxy.ts`: Migrated from `middleware.ts` to root `proxy.ts` with `export function proxy(request)` adhering to Next.js 16 file convention.
- Dedicated `/callback` Route: Isolated OAuth token exchange route outside protected route matchers to prevent redirect race conditions.
- Target Destination Fallback: Defaulted redirect destination to `"/"` (Home page) since `/dashboard` is part of Phase 5.
- Clean Page Navigation: Used `window.location.href = returnTo` post-auth exchange to ensure Server Components and proxy cookie readers update immediately.
- Two-Layer Protection: Server/edge interception via `proxy.ts` + reactive client context via `AuthProvider`.

## Problems solved
- Solved missing Next.js 16 proxy convention: replaced legacy `middleware.ts` with `proxy.ts`.
- Solved OAuth redirect target issue: `returnTo` previously defaulted to unbuilt `/dashboard`, causing a 404. Updated default to `"/"` with full-window refresh.
- Solved basic login aesthetics: upgraded minimal card to a high-polish glassmorphic interface with ambient background lighting and micro-interactions.

## Current state
- Feature 02 (Auth) is 100% complete, fully tested, and verified.
- Protected routes redirect unauthenticated users to `/login`.
- TypeScript verification (`npx tsc --noEmit`) passes with 0 errors.
- Dev server running on `http://localhost:3000`.

## Next session starts with
- Phase 1, Feature 03: PostHog Initialization:
  - Create `lib/posthog-client.ts` (browser client with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`).
  - Create `lib/posthog-server.ts` (server client with `flushAt: 1` and `flushInterval: 0`).
  - Initialize PostHog provider in root app layout.
  - Wire `posthog.identify()` on user login and `posthog.reset()` on logout.

## Open questions
- None.
