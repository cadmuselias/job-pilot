# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar
- **File**: `components/layout/Navbar.tsx`
- **Container**: `sticky top-0 z-50 w-full bg-surface border-b border-border`
- **Inner Wrapper**: `max-w-[1440px] mx-auto h-16 px-6 flex items-center justify-between`
- **Nav Links**: `text-sm font-medium text-text-dark hover:text-accent transition-colors`
- **Primary CTA**: `bg-overlay-dark hover:bg-black text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors`

### Hero
- **File**: `components/homepage/Hero.tsx`
- **Container**: `max-w-[1360px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16`
- **Card**: `relative overflow-hidden rounded-3xl border border-border bg-hero-gradient shadow-sm pt-14 sm:pt-20 pb-8 sm:pb-12 text-center`
- **Headline**: `text-4xl sm:text-5xl md:text-[60px] font-bold tracking-tight text-text-primary leading-[1.14]`
- **Subtitle**: `text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed`
- **Primary Button**: `bg-overlay-dark hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 shadow-sm`
- **Secondary Button**: `bg-surface hover:bg-surface-secondary text-text-primary border border-border px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm`

### Features
- **File**: `components/homepage/Features.tsx`
- **Feature Block 1**: `border-t border-border bg-surface py-16 sm:py-20`
- **Feature Block 2**: `border-t border-border py-16 sm:py-24`
- **Section Heading**: `text-3xl sm:text-4xl lg:text-[42px] font-bold text-text-primary tracking-tight leading-tight`
- **Feature Divider List**: `mt-8 border-y border-border divide-y divide-border`
- **Active Feature Item**: `py-5 pl-5 border-l-2 border-accent -ml-[1px]`
- **Feature Item**: `py-5 pl-5`
- **Feature Title**: `text-base font-semibold text-text-primary`
- **Feature Description**: `text-sm text-text-secondary leading-relaxed`

### Testimonial
- **File**: `components/homepage/Testimonial.tsx`
- **Section**: `border-t border-b border-border bg-surface py-20 sm:py-28`
- **Label**: `text-accent text-xs font-semibold tracking-widest uppercase mb-6 inline-block`
- **Quote**: `text-2xl sm:text-3xl md:text-[32px] font-medium text-text-primary leading-snug tracking-tight mb-8`
- **Avatar**: `w-11 h-11 rounded-lg object-cover border border-border mb-2.5`
- **Author Name**: `text-sm font-semibold text-text-primary`
- **Author Title**: `text-xs text-text-secondary mt-0.5`

### CallToAction
- **File**: `components/homepage/CallToAction.tsx`
- **Container**: `max-w-[1360px] mx-auto px-4 sm:px-6 py-12 sm:py-20`
- **Card**: `relative overflow-hidden rounded-3xl border border-border bg-cta-gradient px-6 py-16 sm:py-20 text-center shadow-sm`
- **Heading**: `text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tight leading-tight max-w-3xl mx-auto`
- **Heading Line 1**: `block with whitespace-nowrap on 'feel a'`
- **Heading Line 2**: `block for 'lot less overwhelming'`
- **Subtitle**: `text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed`

### Footer
- **File**: `components/layout/Footer.tsx`
- **Container**: `w-full bg-surface border-t border-border mt-auto`
- **Inner Wrapper**: `max-w-[1440px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4`
- **Links**: `text-xs sm:text-sm text-text-dark hover:text-accent transition-colors`

### LoginPage

File: `app/(auth)/login/page.tsx`
Last updated: 2026-10-16

| Property | Class |
|---|---|
| Background | `bg-background` (page with `bg-diagonal-stripes`), `bg-surface/95` (card) |
| Border | `border-border`, `border-accent/20` (badge) |
| Border radius | `rounded-3xl` (card), `rounded-2xl` (badge), `rounded-xl` (buttons), `rounded-full` (chips) |
| Text — primary | `text-text-primary` (`font-bold text-2xl sm:text-[28px]`) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-text-muted` (`text-xs` / `text-[11px]`) |
| Spacing | `p-8 sm:p-10` (card interior), `space-y-3` (buttons), `gap-2` (chips) |
| Hover state | `hover:bg-surface-secondary` (Google), `hover:bg-black` (GitHub), `hover:scale-[1.02]` (logo) |
| Shadow | `shadow-xl` (card), `shadow-xs hover:shadow-sm` (buttons) |
| Accent usage | `text-accent`, `bg-accent-light/50`, `border-accent/20`, `bg-hero-gradient` (ambient glow) |

**Pattern notes:**
- Backed by an atmospheric radial glow (`absolute -top-36 left-1/2 -translate-x-1/2 w-[760px] h-[480px] bg-hero-gradient blur-3xl opacity-80`).
- Card features a subtle top highlight shimmer (`before:absolute before:inset-x-8 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-accent/40 before:to-transparent`).
- All interactive buttons implement micro-scaling (`active:scale-[0.99]`).

---

### CallbackPage

File: `app/(auth)/callback/page.tsx`
Last updated: 2026-10-16

| Property | Class |
|---|---|
| Background | `bg-background` (page), `bg-surface` (card), `bg-surface-secondary` (error badge) |
| Border | `border-border` |
| Border radius | `rounded-2xl` (card), `rounded-full` (spinner / badge), `rounded-lg` (button) |
| Text — primary | `text-text-primary` (`text-lg font-semibold` / `text-xl font-bold`) |
| Text — secondary | `text-text-secondary` (`text-sm`) |
| Spacing | `p-8 sm:p-10` (card interior), `py-12` (container) |
| Hover state | `hover:bg-black` (back to login button) |
| Shadow | `shadow-sm` |
| Accent usage | `border-accent` (spinner) |

### CompletionIndicator

File: `components/profile/CompletionIndicator.tsx`
Last updated: 2026-10-20

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-error/5` (missing field badges) |
| Border | `border-border` (card), `border-error/30` (badge), `border-2 border-error` (alert circle) |
| Border radius | `rounded-2xl` (card), `rounded-md` (badges), `rounded-full` (progress ring) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-2xl font-bold` progress value) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-error` (`text-[11px] font-semibold tracking-wider uppercase`) |
| Spacing | `p-6` (card interior), `gap-6` (flex items), `gap-2` (tags row), `space-y-3` |
| Hover state | none (status banner) |
| Shadow | `shadow-xs` |
| Accent usage | SVG progress arc `var(--color-error)` and track `var(--color-border-light)` |

**Pattern notes:**
- Warns users of incomplete profile status using prominent alert icon and 70% radial progress arc.
- Missing field chips use uppercase tracking with `text-error` and subtle background tint (`bg-error/5`).

---

### ResumeUpload

File: `components/profile/ResumeUpload.tsx`
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-surface-secondary/20` (drop zone), `bg-accent-muted/40` (drag-over), `bg-accent-muted` (cloud icon badge), `bg-success-lightest` (uploaded pill / extraction success / generation success), `bg-error/10` (error banner), `bg-accent` (extract & generate buttons) |
| Border | `border-border` (card/select button), `border-2 border-dashed border-border-muted` (drop zone), `border-success-light` (pill / extraction success / generation success), `border-error/20` (error banner) |
| Border radius | `rounded-2xl` (card), `rounded-xl` (drop zone), `rounded-full` (cloud badge), `rounded-lg` (buttons, error/success banners, pill) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-sm font-semibold` drop title) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-text-muted` (`text-xs` / `text-[11px]`), `text-error` (error message / remove button), `text-success` (uploaded indicator / success message) |
| Spacing | `p-6` (card), `py-8 px-6` (drop zone), `gap-2` / `gap-3` (badge & actions), `mt-6 pt-5` (generation row) |
| Hover state | `hover:border-accent/40` (drop zone), `hover:bg-surface-secondary` (select button), `hover:bg-accent-dark` (extract & generate buttons), `hover:underline` (View & Download links), `hover:text-text-primary` (Replace button), `hover:text-error/80` (Remove button) |
| Shadow | `shadow-xs` (card, select button, extract button, generate button) |
| Accent usage | `text-accent` (upload cloud icon, View link, Download action), `bg-accent` / `hover:bg-accent-dark` (extract & generate buttons), `bg-accent-muted` (icon badge) |

**Pattern notes:**
- Drag-and-drop zone dynamically switches border to `border-accent` and background to `bg-accent-muted/40` on dragover.
- Active resume confirmation pill displays filename with discrete contextual action triggers: `View` (opens PDF in new tab), `Download` (client-side blob download with spinner), `Replace` (re-triggers file selector), and `Remove` (purges file from InsForge Storage and database).
- Primary AI extraction and PDF generation CTAs use solid `bg-accent` with micro-scaling (`active:scale-[0.99]`) and spinner transitions during async operations.
- Success confirmation banner and pill use `bg-success-lightest` with `border-success-light` and `text-success`.
- Error banner renders `bg-error/10` with `border-error/20` and embeds an inline `Log in` action link when authorization fails.

---

### ProfileForm

File: `components/profile/ProfileForm.tsx`
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Background | `bg-surface` (card, inputs, skill tags), `bg-accent-muted/40` (AI extraction banner), `bg-surface-secondary/20` (role card), `bg-surface-secondary` (add button), `bg-accent` (save button) |
| Border | `border-border` (card, inputs, dividers, tags), `border-accent/30` (AI extraction banner), `border-border-light` (role card) |
| Border radius | `rounded-2xl` (card), `rounded-xl` (AI extraction banner, role card, save button), `rounded-lg` (inputs, select dropdowns), `rounded-full` (skill tags) |
| Text — primary | `text-text-primary` (`text-lg font-semibold` title, `text-sm font-semibold` section headings, `text-sm` input text) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-text-dark` (`text-[11px] font-semibold tracking-wider uppercase` labels), `text-text-muted` (placeholders) |
| Spacing | `p-6` (card interior), `p-4` (AI extraction banner), `p-4 sm:p-5` (role card), `px-3 py-2` (inputs), `my-6` (dividers), `space-y-4` (sections), `gap-4` (grids) |
| Hover state | `hover:bg-surface-tertiary` (tag add button), `hover:text-error` (tag remove), `hover:bg-accent-dark` (save button), `hover:text-accent-dark` (+ Add role), `hover:text-text-primary` (banner dismiss) |
| Shadow | `shadow-xs` (card), `shadow-2xs` (skill chips), `shadow-sm` (save button) |
| Accent usage | `text-accent` (Sparkles icon, extraction banner), `border-accent/30` & `bg-accent-muted/40` (extraction banner), `focus:ring-accent focus:border-accent` (inputs), `bg-accent hover:bg-accent-dark` (save button), `text-accent` (+ Add role) |

**Pattern notes:**
- AI extraction feedback banner alerts users to review auto-filled data before saving, using `bg-accent-muted/40` with `border-accent/30` and a dismiss icon button.
- Uppercase subheadings (`text-[11px] font-semibold tracking-wider text-text-dark uppercase`) for form labels provide clear scannability.
- Interactive skill tags use `rounded-full` pills with discrete `X` remove targets.
- Focus ring explicitly adopts `focus:ring-1 focus:ring-accent focus:border-accent`.

---

### ProfilePage

File: `app/profile/page.tsx`
Last updated: 2026-10-20

| Property | Class |
|---|---|
| Background | `bg-background` (full page) |
| Border | None (page container) |
| Border radius | None |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing | `max-w-[860px] mx-auto px-4 sm:px-6 py-8 space-y-6` |
| Hover state | Inherited from children |
| Shadow | None |
| Accent usage | Inherited from children |

**Pattern notes:**
- Single-column centered container (`max-w-[860px]`) with vertical stacking (`space-y-6`) keeping all cards aligned and readable.
- Employs Next.js 16 Partial Prerendering with `<Suspense>` boundary and `ProfileSkeleton` placeholder.

---

### ProfileSkeleton

File: `app/profile/page.tsx`
Last updated: 2026-10-20

| Property | Class |
|---|---|
| Background | `bg-surface` (cards), `bg-surface-secondary` (skeletons), `bg-surface-secondary/40` |
| Border | `border-border`, `border-border-muted` (dashed inner zone) |
| Border radius | `rounded-2xl` (cards), `rounded-xl` (inner containers), `rounded-md` / `rounded-lg` (bars) |
| Text | None (placeholder shapes) |
| Spacing | `space-y-6 animate-pulse`, `p-6` |
| Animation | `animate-pulse` |

**Pattern notes:**
- Mirrors the exact 3-tier card layout of the profile page (CompletionIndicator, ResumeUpload, ProfileForm) to eliminate layout shift during server streaming.

---

### AIExtractionNotice

File: `components/profile/ProfileForm.tsx`
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Background | `bg-accent-muted/40` |
| Border | `border border-accent/30` |
| Border radius | `rounded-xl` |
| Text — primary | `text-text-primary` (`font-semibold text-sm`) |
| Text — secondary | `text-text-secondary` (`text-xs`), `text-text-muted` (dismiss button) |
| Spacing | `p-4`, `gap-3` |
| Hover state | `hover:text-text-primary` (dismiss button) |
| Shadow | None |
| Accent usage | `text-accent` (Sparkles icon), `bg-accent-muted/40` (container), `border-accent/30` |

**Pattern notes:**
- Standard banner pattern for AI-assisted fill notifications.
- Dismiss button uses subtle icon padding (`p-1 rounded-md text-text-muted hover:text-text-primary cursor-pointer`).
- Accommodates a title, explanatory text, and bold action callout.

---

### ResumeGenerateAction

File: `components/profile/ResumeUpload.tsx`
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Container | `mt-6 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4` |
| Text — title | `text-sm font-medium text-text-primary block` |
| Text — subtitle | `text-xs text-text-secondary mt-0.5 block` |
| Button — primary | `bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-2 rounded-lg shadow-xs inline-flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shrink-0 disabled:opacity-60 disabled:cursor-not-allowed` |
| Success banner | `text-xs text-success bg-success-lightest border border-success-light px-3.5 py-2 rounded-lg max-w-md w-full flex items-center gap-2` |
| Error banner | `text-xs text-error bg-error/10 border border-error/20 px-3.5 py-2 rounded-lg max-w-md w-full flex items-center gap-2` |
| Icon | `w-4 h-4 text-white` (Sparkles), `w-4 h-4 animate-spin text-white` (Loader2) |

**Pattern notes:**
- Bottom card CTA row with explanatory text on the left and primary action button on the right.
- Visual loading feedback with rotating spinner and label transition ("Polishing with AI...").
- Integrated success/error banners maintaining strict token adherence without raw colors.

---

### SearchControls

File: `components/find-jobs/SearchControls.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (banner), `bg-accent` (button) |
| Border | `border-border` (card/inputs), `border-success-light/80` (banner) |
| Border radius | `rounded-2xl` (card), `rounded-xl` (banner), `rounded-lg` (inputs/button) |
| Text — primary | `text-text-primary` (`text-sm` inputs), `text-white` (button) |
| Text — secondary | `text-text-secondary` (`text-xs font-semibold tracking-wider uppercase` labels), `text-text-muted` (placeholders), `text-success-foreground` (banner) |
| Spacing | `p-6` (card), `gap-4` (grid), `px-4 py-3` (banner), `pl-10 pr-3.5 py-2.5` (search input) |
| Hover state | `hover:bg-accent-dark` (button), `focus:ring-1 focus:ring-accent focus:border-accent` (inputs) |
| Shadow | `shadow-xs` (card, button), `shadow-2xs` (inputs) |
| Accent usage | `bg-accent hover:bg-accent-dark text-white` (find jobs button), `focus:ring-accent` |

**Pattern notes:**
- Top-of-page search control card with aligned inputs and primary action button using `items-end` grid alignment.
- Notification banner below inputs with `bg-success-lightest` and Sparkles icon for discovery feedback.
- Loading state: disables inputs and primary button (`disabled:opacity-60 disabled:cursor-not-allowed`), displays spinning `Loader2` icon (`animate-spin`), and transitions label to "Discovering Jobs...".

---

### JobFilters

File: `components/find-jobs/JobFilters.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-surface` (bar & sort trigger), `bg-surface-secondary` (tabs group & hover pill), `bg-accent-muted` (active tab badge), `bg-surface-tertiary` (inactive tab badge), `bg-accent-muted/40` (active sort item) |
| Border | `border-border` (bar, tabs container, sort trigger & popover), `border-border/70` (active tab) |
| Border radius | `rounded-2xl` (bar), `rounded-xl` (segmented tabs group & sort popover), `rounded-lg` (tabs, sort trigger, search input), `rounded-full` (tab count badges) |
| Text — primary | `text-text-primary` (`text-sm font-semibold` active tab & sort label, `text-sm` input) |
| Text — secondary | `text-text-secondary` (inactive tabs, sort label prefix, sort chevron), `text-text-muted` (search icon, clear button, inactive badge) |
| Spacing | `p-4` (bar), `p-1` (tabs group), `px-3 py-1.5` (tab button), `px-2 py-0.5` (tab badge), `px-3.5 py-2` (sort trigger & items), `gap-1.5` (tabs), `gap-4` (bar elements) |
| Hover state | `hover:bg-surface/50` (inactive tabs), `hover:bg-surface-secondary` (sort trigger & items), `hover:text-text-primary` (clear button & inactive tabs) |
| Shadow | `shadow-xs` (bar), `shadow-2xs` (active tab & sort trigger), `shadow-lg` (sort popover) |
| Accent usage | `text-accent bg-accent-muted` (active tab count badge), `text-accent font-semibold bg-accent-muted/40` (active sort option) |

**Pattern notes:**
- Segmented match tier tabs (`All Matches`, `High Match (≥70%)`, `Low Match (<70%)`) with dynamic count badges for 1-click filtering.
- Text search input with clear button (`X`) for immediate company or role filtering.
- Dedicated Sort dropdown (`Match Score`, `Newest First`, `Oldest First`) with outside-click dismissal.

---

### JobsTable

File: `components/find-jobs/JobsTable.tsx`
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Background | `bg-surface` (card & table rows), `bg-surface-secondary/60` (row hover), `bg-surface-secondary` (company icon box), `bg-border-light` (progress track) |
| Border | `border-border` (card, row dividers, header divider), `border-border-light` (company icon box) |
| Border radius | `rounded-2xl` (outer card), `rounded-lg` (company icon box), `rounded-full` (progress track & bar) |
| Text — primary | `text-text-primary` (`text-sm font-semibold` company, `text-sm font-medium` role & salary, `text-sm font-semibold` score) |
| Text — secondary | `text-text-secondary` (`text-xs font-semibold tracking-wider uppercase` headers, `text-sm` date found) |
| Spacing | `px-6 py-4` (table cells and header), `gap-3` (company & progress bar flex items) |
| Hover state | `hover:bg-surface-secondary/60` (table row) |
| Shadow | `shadow-xs` (card) |
| Accent / Status usage | Match score fill: `>=90%` `bg-success`, `80-89%` `bg-info-medium`, `70-79%` `bg-warning`, `<70%` `bg-text-muted` |

**Pattern notes:**
- Clean table presentation without alternating row colors; rows separated by `border-b border-border`.
- Company column pairs a subtle gray rounded icon container (`w-9 h-9`) with bold company typography.
- Horizontal score indicator uses 4px/6px rounded track with semantic score tier color coding.

---

### JobsPagination

File: `components/find-jobs/JobsPagination.tsx`
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Background | `bg-surface` (footer container & inactive buttons), `bg-accent-muted/40` (active page button), `bg-surface-secondary` (hover buttons) |
| Border | `border-t border-border` (footer separator), `border-border` (buttons), `border-accent` (active page button) |
| Border radius | `rounded-lg` (all pagination buttons) |
| Text — primary | `text-text-primary` (`font-semibold` in counter text, button text) |
| Text — secondary | `text-text-secondary` (`text-sm` counter text, Previous button text), `text-text-muted` (disabled buttons, ellipsis) |
| Spacing | `px-6 py-4` (footer container), `px-3.5 py-1.5` (Prev/Next), `px-3 py-1.5` (page numbers) |
| Hover state | `hover:bg-surface-secondary` (enabled buttons) |
| Shadow | `shadow-2xs` (buttons) |
| Accent usage | `border-accent text-accent bg-accent-muted/40 font-semibold` (active page button) |

**Pattern notes:**
- Table footer pagination bar seamlessly integrated at the bottom of the table card.
- Adaptive page windowing displaying current page, neighbors, and last page with ellipsis.

---

### FindJobsView

File: `components/find-jobs/FindJobsView.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | None (coordinator wrapper), `bg-surface` (error banner) |
| Border | `border border-error/30` (error banner) |
| Border radius | `rounded-xl` (error banner) |
| Text — primary | `text-error` (`text-sm font-medium` error text) |
| Text — secondary | `text-xs font-semibold underline hover:text-error/80` (login action link) |
| Spacing | `space-y-6` (root container), `px-4 py-3` (banner interior), `gap-2.5` (banner elements) |
| Hover state | `hover:text-error/80` (action link) |
| Shadow | `shadow-2xs` (error banner) |
| Status / Error usage | `text-error`, `border-error/30`, `bg-surface` for subtle non-intrusive alert |

**Pattern notes:**
- View coordinator managing live job discovery requests, search filters, match thresholds, sorting, and pagination.
- Renders contextual error notification banner when unauthenticated or on network failure, with an inline "Log In" direct action redirecting to `/login?returnTo=/find-jobs`.
- Automatically loads saved database pipeline on initial mount and replaces table results upon new search execution.
- Integrates proactive token retrieval via `getToken()` and automatic single-retry on 401 with refreshed credentials.

---

### FindJobsPage

File: `app/find-jobs/page.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-background` (full page) |
| Border | None (page container) |
| Border radius | None |
| Text — primary | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing | `max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6` |
| Hover state | Inherited from children |
| Shadow | None |
| Accent usage | Inherited from children |

**Pattern notes:**
- Wide centered layout container (`max-w-[1360px]`) accommodating multi-column search controls, toolbar filters, and data table.
- Standard 24px vertical section gap (`space-y-6`).

---

### RootLayout

File: `app/layout.tsx`
Last updated: 2026-10-25

| Property | Class / Attribute |
|---|---|
| Background | None on html/body (children default to `bg-background`) |
| Border | None |
| Border radius | None |
| Text — primary | Inherited |
| Text — secondary | Inherited |
| Spacing | `min-h-full flex flex-col` (body container) |
| Attributes | `suppressHydrationWarning` on `<html>` and `<body>` to guard against 3rd-party extension mutations |
| Font Variable | `${inter.variable} h-full antialiased` |
| Shadow | None |
| Accent usage | None |

**Pattern notes:**
- Root layout wraps application tree in `PostHogProvider` and `AuthProvider`.
- Uses `suppressHydrationWarning` on both `<html>` and `<body>` tags to prevent hydration mismatches caused by browser extension attribute injections.
- Employs `min-h-full flex flex-col` for sticky footer support across all route pages.

---

### JobHeader

File: `components/job-details/JobHeader.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-surface-secondary` (building icon box / button hover), `bg-success-lightest` (match badge) |
| Border | `border-border` (card & external button), `border-border-light` (icon box), `border-success-light/60` (match badge) |
| Border radius | `rounded-2xl` (card & icon box), `rounded-full` (match badge), `rounded-lg` (external button) |
| Text — primary | `text-text-primary` (`text-2xl font-bold` title, `text-sm font-medium` button text) |
| Text — secondary | `text-text-secondary` (`text-sm font-medium` company, back link text & icons), `text-success-foreground` (match badge) |
| Spacing | `p-6` (card), `gap-4` (flex items), `gap-2` (title badges row), `px-4 py-2` (button), `px-2.5 py-0.5` (match badge), `mb-6` (back link) |
| Hover state | `hover:text-text-primary` (back link), `hover:bg-surface-secondary` (view job post button) |
| Shadow | `shadow-xs` (card), `shadow-2xs` (external button) |
| Accent usage | None directly; uses `bg-success-lightest` / `text-success-foreground` for match score badge |

**Pattern notes:**
- Header card with left-hand company building square icon (`w-14 h-14 rounded-2xl bg-surface-secondary border border-border-light`), bold title (`text-2xl font-bold text-text-primary`), company name, dot separator, and pill match score badge (`bg-success-lightest text-success-foreground border border-success-light/60`).
- Right-hand external action button linking to `redirect_url` with `ExternalLink` icon and `shadow-2xs`.
- Top navigation link with `ChevronLeft` returning to `/find-jobs`. Smooth color transitions with `group` and `hover:text-text-primary`.

---

### JobMetrics

File: `components/job-details/JobMetrics.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-surface` (cards), `bg-success-lightest` (salary icon), `bg-info-lightest` (location icon), `bg-accent-muted` (job type icon), `bg-surface-secondary` (calendar icon) |
| Border | `border-border` (cards), `border-border-light` (calendar icon box) |
| Border radius | `rounded-2xl` (cards), `rounded-xl` (metric icon containers) |
| Text — primary | `text-text-primary` (`text-base font-bold` values) |
| Text — secondary | `text-text-secondary` (`text-[11px] font-semibold tracking-wider uppercase` labels) |
| Spacing | `p-5` (cards), `gap-4` (grid), `gap-3.5` (card interior flex) |
| Hover state | None (metric cards) |
| Shadow | `shadow-xs` (cards) |
| Accent usage | `bg-accent-muted text-accent` (Job Type icon box), `text-success bg-success-lightest` (Salary), `text-info-medium bg-info-lightest` (Location) |

**Pattern notes:**
- 4-column responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`) detailing Salary Est., Location, Job Type, and Date Found.
- Each item features a specialized 44x44px rounded container with thematic token backgrounds and icons.

---

### MatchReasoning

File: `components/job-details/MatchReasoning.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (sparkles icon container) |
| Border | `border-border` (card) |
| Border radius | `rounded-2xl` (card), `rounded-lg` (sparkles icon box) |
| Text — primary | `text-text-primary` (`text-sm font-normal leading-relaxed` reasoning paragraph) |
| Text — secondary | `text-text-secondary` (`text-xs font-semibold tracking-wider uppercase` header) |
| Spacing | `p-6` (card), `mb-3.5` (header gap), `gap-2.5` (header elements) |
| Hover state | None |
| Shadow | `shadow-xs` (card) |
| Accent usage | `text-success-alt bg-success-lightest` (AI Sparkles icon container) |

**Pattern notes:**
- AI synthesis card delivering explanation of candidate compatibility with clean line-height and typography.

---

### SkillsComparison

File: `components/job-details/SkillsComparison.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (matched pills), `bg-accent-muted` (gap pills) |
| Border | `border-border` (card), `border-success-light/60` (matched pills), `border-accent/20` (gap pills) |
| Border radius | `rounded-2xl` (card), `rounded-full` (skill pills) |
| Text — primary | `text-success-foreground` (matched skills), `text-accent` (gap skills) |
| Text — secondary | `text-text-secondary` (`text-xs font-semibold tracking-wider uppercase` header, `text-xs font-medium` section labels), `text-text-muted` (empty fallbacks) |
| Spacing | `p-6` (card), `px-3 py-1` (skill pills), `gap-2` (pill wraps), `mb-4` / `mt-5 mb-2.5` (section spacing) |
| Hover state | None (status chips) |
| Shadow | `shadow-xs` (card) |
| Accent usage | `bg-accent-muted text-accent border-accent/20` (Gap skills pills), `bg-success-lightest text-success-foreground` (You have pills) |

**Pattern notes:**
- 2-tier comparative breakdown displaying "You have" skills with checkmark icons and "Gap skills" with cross icons.

---

### JobDescriptionView

File: `components/job-details/JobDescriptionView.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-surface` (card) |
| Border | `border-border` (card) |
| Border radius | `rounded-2xl` (card) |
| Text — primary | `text-text-primary` (`text-base font-semibold` header, `text-sm leading-relaxed` content) |
| Text — secondary | `text-text-secondary` (FileText icon, uppercase subheaders), `text-text-muted` (empty fallback) |
| Spacing | `p-6` (card), `mb-4` (header row), `space-y-4` (content body), `gap-2.5`, `mt-2.5` (toggle button) |
| Hover state | `hover:text-accent-dark` (toggle button) |
| Shadow | `shadow-xs` (card) |
| Accent usage | `text-accent hover:text-accent-dark` (Read Full Description / Show Less toggle button) |

**Pattern notes:**
- Document body renderer supporting structured lists (Responsibilities, Requirements, Nice to Have, Benefits) and unstructured text with whitespace preservation.
- Implements interactive "Read Full Description" / "Show Less" toggle button with `ChevronDown` / `ChevronUp` icons for descriptions exceeding 320 characters.
- Sanitizes severed trailing fragments from character-boundary legacy cuts, ensuring complete sentence rendering.

---

### CompanyResearchCard

File: `components/job-details/CompanyResearchCard.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-accent-muted` (header icon), `bg-accent hover:bg-accent-dark` (primary CTA button), `bg-surface-secondary` (sub-sections, pills, badges), `bg-accent-muted/60` (Your Edge callout container), `bg-error/10` (error banner) |
| Border | `border-border` (card container & tech pills), `border-border-light` (sub-sections), `border-accent/25` (Your Edge callout), `border-success-light` (Active Dossier badge), `border-error/20` (error banner) |
| Border radius | `rounded-2xl` (card container), `rounded-xl` (callout card, overview box, empty state, error banner), `rounded-lg` (header icon, buttons, Q&A blocks), `rounded-md` (tech pills), `rounded-full` (badges & bullets) |
| Text — primary | `text-text-primary` (`text-base font-semibold` header, `text-sm` body), `text-white` (primary button), `text-error` (error banner) |
| Text — secondary | `text-text-secondary` (`text-xs` section labels, sub-bullets), `text-text-muted` (sources, sub-labels) |
| Spacing | `p-6` (card padding), `mb-6 pb-4` (header boundary), `space-y-6` (dossier sections), `gap-1.5` (tech pills), `gap-2` (Q&A and bullet rows), `p-3.5` (error banner) |
| Hover state | `hover:bg-accent-dark` (primary CTA), `hover:bg-surface-secondary` (refresh button), `hover:text-error/80` (retry link) |
| Shadow | `shadow-xs` (card & primary button), `shadow-2xs` (sub-cards, callouts) |
| Accent usage | `bg-accent hover:bg-accent-dark text-white` (Research Company button), `bg-accent-muted text-accent` (header icon, loading spinner), `bg-accent-muted/60 border-accent/25 text-accent` (Your Edge highlighted card), `bg-success-lightest text-success-foreground` (Active Dossier badge) |

**Pattern notes:**
- Complete 9-field company intelligence briefing renderer: Company Overview, Technologies & Platform pills, Your Competitive Edge highlight callout, Why This Role, Culture & Norms, Gaps Reframed as Strategy, High-Signal Interview Questions, Preparation Topics, and Verified Web Sources.
- Multi-state transitions: Empty state with call-to-action → active cloud-session investigation loader with animated step progression → rich 9-field structured briefing with secondary "Refresh Dossier" option.
- Error banner strictly adheres to design tokens (`bg-error/10 border-error/20 text-error hover:text-error/80`) with an inline Retry trigger.
- Integrates transparent auth token refresh and automatic single-retry upon 401 unauthenticated status.

---

### ApplyButton

File: `components/job-details/ApplyButton.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-accent hover:bg-accent-dark` (button), `bg-accent/60` (disabled fallback) |
| Border | None |
| Border radius | `rounded-xl` |
| Text — primary | `text-white` (`text-sm sm:text-base font-medium`) |
| Spacing | `pt-2` (container), `py-3.5 px-6` (button) |
| Hover state | `hover:bg-accent-dark active:scale-[0.99]` |
| Shadow | `shadow-xs` |
| Accent usage | `bg-accent hover:bg-accent-dark` primary CTA |

**Pattern notes:**
- Full-width high-priority action button at page bottom directing candidate to external job application.

---

### JobDetailsPage

File: `app/find-jobs/[id]/page.tsx`
Last updated: 2026-10-25

| Property | Class |
|---|---|
| Background | `bg-background` (full page) |
| Border | None |
| Border radius | None |
| Text — primary | Inherited |
| Text — secondary | Inherited |
| Spacing | `max-w-[860px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6` |
| Hover state | Inherited from children |
| Shadow | None |
| Accent usage | Inherited from children |

**Pattern notes:**
- Centered single-column layout (`max-w-[860px]`) with vertical stacking (`space-y-6`) matching `context/designs/job-details.png`.
- Implements Next.js 16 Partial Prerendering with `<Suspense fallback={<JobDetailsSkeleton />}>` for zero layout shift during async server data streaming.

---

### StatCardGrid

File: `components/dashboard/StatCardGrid.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (trend pill) |
| Border | `border-border` (card), `hover:border-border-muted` |
| Border radius | `rounded-2xl` (card), `rounded-sm` (trend pill) |
| Text — primary | `text-text-primary` (`text-3xl sm:text-[32px] font-bold`) |
| Text — secondary | `text-text-secondary` (`text-sm font-medium` label), `text-text-muted` (`text-xs`), `text-success-darker` (`text-xs font-medium` trend) |
| Spacing | `p-6` (card), `px-2 py-0.5` (trend pill), `gap-6` (grid) |
| Hover state | `hover:border-border-muted transition-all` |
| Shadow | `shadow-xs` |
| Accent usage | `bg-success-lightest text-success-darker` (trend indicators) |

**Pattern notes:**
- 4-column metric grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`) displaying numerical stats, trend badges, and contextual subtitles.

---

### RecentActivityCard

File: `components/dashboard/RecentActivityCard.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-info-lightest` / `bg-success-lightest` / `bg-accent-muted` (node rings) |
| Border | `border-border` (card), `w-[1.5px] bg-border-light` (timeline line) |
| Border radius | `rounded-2xl` (card), `rounded-full` (status nodes & inner dots) |
| Text — primary | `text-text-primary` (`text-base font-semibold` title, `text-sm font-medium` activity item) |
| Text — secondary | `text-text-muted` (`text-xs` timestamps) |
| Spacing | `p-6` (card), `space-y-6` (timeline items), `gap-4` (flex items) |
| Hover state | None |
| Shadow | `shadow-xs` |
| Node styling | Ring-4 with inner dot: purple (`bg-accent ring-accent-light`), blue (`bg-info ring-info-light`), green (`bg-success-alt ring-success-light`) |

**Pattern notes:**
- Vertical timeline component with continuous connecting vertical line (`w-[1.5px] bg-border-light`) connecting multi-colored status nodes.

---

### CompanyResearchChart

File: `components/dashboard/CompanyResearchChart.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-info-lightest` (active tooltip badge) |
| Border | `border-border` (card), `stroke="var(--color-border)" stroke-dasharray="4 4"` (gridlines) |
| Border radius | `rounded-2xl` (card), `rx={4}` (rounded bar tops), `rounded-full` (tooltip badge) |
| Text — primary | `text-text-primary` (`text-base font-semibold` title, `fill-text-primary font-semibold` active axis) |
| Text — secondary | `fill-text-muted text-[12px]` (axis ticks), `text-info` (tooltip badge) |
| Spacing | `p-6` (card), `h-[240px]` (chart area) |
| Hover state | Dynamic bar color transition (`var(--color-info-medium)`), interactive hover pill |
| Shadow | `shadow-xs` |
| Accent usage | `var(--color-info)` (bars), `var(--color-info-medium)` (hovered bar) |

**Pattern notes:**
- Responsive SVG bar chart with horizontal dashed gridlines (Y-axis 0-12) and Mon-Sun weekly distribution.

---

### JobsOverTimeChart

File: `components/dashboard/JobsOverTimeChart.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-accent-muted` (tooltip badge) |
| Border | `border-border` (card), `stroke="var(--color-border)" stroke-dasharray="4 4"` (gridlines) |
| Border radius | `rounded-2xl` (card), `rounded-full` (tooltip badge) |
| Text — primary | `text-text-primary` (`text-base font-semibold` title, `fill-text-primary font-semibold` active axis) |
| Text — secondary | `fill-text-muted text-[12px]` (axis ticks), `text-accent` (tooltip badge) |
| Spacing | `p-6` (card), `h-[260px]` (chart area) |
| Hover state | Interactive hover dot (`r={7}` ring, `r={4}` center), dashed guideline, hover badge |
| Shadow | `shadow-xs` |
| Accent usage | `stroke="var(--color-accent)"` (3px smooth cubic curve), `fill="url(#jobsCurveGradient)"` (gradient area fill) |

**Pattern notes:**
- Smooth Catmull-Rom cubic Bezier curve with multi-stop vertical linear gradient area fill below curve.

---

### ScoreDistributionChart

File: `components/dashboard/ScoreDistributionChart.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (tooltip badge) |
| Border | `border-border` (card), `stroke="var(--color-border)" stroke-dasharray="4 4"` (gridlines) |
| Border radius | `rounded-2xl` (card), `rx={4}` (rounded bar tops), `rounded-full` (tooltip badge) |
| Text — primary | `text-text-primary` (`text-base font-semibold` title) |
| Text — secondary | `fill-text-muted text-[12px]` (axis ticks & ranges), `text-success` (tooltip badge) |
| Spacing | `p-6` (card), `h-[260px]` (chart area) |
| Hover state | Bar color transition to `var(--color-success-alt)` on hover |
| Shadow | `shadow-xs` |
| Accent usage | `var(--color-success)` / `var(--color-success-alt)` (bars) |

**Pattern notes:**
- 5-bucket distribution bar chart for match score ranges (`50-60%` through `90-100%`) on a 0-100 scale.

---

### IncompleteProfileBanner

File: `components/dashboard/IncompleteProfileBanner.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-warning/10` (icon box & pill), `bg-overlay-dark hover:bg-black` (button) |
| Border | `border-warning/30` (card), `border-warning/20` (icon box & pill) |
| Border radius | `rounded-2xl` (card), `rounded-xl` (icon box), `rounded-full` (pill), `rounded-lg` (button) |
| Text — primary | `text-text-primary` (`text-sm font-semibold` title), `text-white` (button) |
| Text — secondary | `text-text-secondary` (`text-xs`), `text-warning` (`text-[11px] font-semibold`), `text-text-muted` (close button) |
| Spacing | `p-4 sm:p-5` (card), `gap-3.5` (interior), `px-4 py-2` (button) |
| Hover state | `hover:bg-black` (button), `hover:bg-surface-secondary` (close button) |
| Shadow | `shadow-xs` |
| Accent usage | `border-warning/30`, `text-warning`, `bg-warning/10` |

**Pattern notes:**
- Top alert banner with dismiss trigger and direct action navigation button to `/profile`.

---

### DashboardPage

File: `app/dashboard/page.tsx`
Last updated: 2026-10-26

| Property | Class |
|---|---|
| Background | `bg-background` (full page) |
| Border | None |
| Border radius | None |
| Text — primary | Inherited |
| Text — secondary | Inherited |
| Spacing | `max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-8` |
| Hover state | Inherited from children |
| Shadow | None |
| Accent usage | Inherited from children |

**Pattern notes:**
- Async Server Component with Next.js 16 Partial Prerendering and `<Suspense fallback={<DashboardSkeleton />}>`.
- Grid arrangement: 4-col stat grid, 2-col middle row (Recent Activity & Company Research), and 12-col bottom row (8-col Jobs Over Time & 4-col Match Score Distribution).

---

### StatCardGrid

File: `components/dashboard/StatCardGrid.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (positive trend pill), `bg-error/10` (negative trend pill) |
| Border | `border-border` (card), `hover:border-border-muted` |
| Border radius | `rounded-2xl` (card), `rounded-sm` (trend pill) |
| Text — primary | `text-text-primary` (`text-3xl sm:text-[32px] font-bold tracking-tight`) |
| Text — secondary | `text-text-secondary` (`text-sm font-medium` label), `text-text-muted` (`text-xs`), `text-success-darker` (positive trend), `text-error` (negative trend) |
| Spacing | `p-6` (card), `px-2 py-0.5` (trend pill), `gap-6` (grid), `min-h-[22px]` (trend container) |
| Hover state | `hover:border-border-muted transition-all` |
| Shadow | `shadow-xs` |
| Semantic usage | `bg-success-lightest text-success-darker` (positive trend), `bg-error/10 text-error` (negative trend) |

**Pattern notes:**
- 4-column metric grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`) displaying real user job metrics, trend indicators, and contextual subtitles.
- Dynamically handles positive and negative deltas with design tokens and renders genuine onboarding zero-states.

---

### DashboardView

File: `components/dashboard/DashboardView.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | None (layout coordinator) |
| Border | None |
| Border radius | None |
| Text — primary | Inherited |
| Text — secondary | Inherited |
| Spacing | `space-y-6` (root container), `gap-6` (card grid rows) |
| Hover state | Inherited from children |
| Shadow | None |
| Accent usage | Inherited from children |

**Pattern notes:**
- Main dashboard client coordinator managing responsive layout arrangements:
  - Metric stat grid: 4 columns (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`).
  - Middle row: 2 equal-width cards (`grid-cols-1 lg:grid-cols-2 gap-6 items-stretch`).
  - Bottom row: 12-column split with 8 cols for Jobs Over Time curve chart and 4 cols for Score Distribution bars (`grid-cols-1 lg:grid-cols-12 gap-6 items-stretch`).
- Conditionally renders `IncompleteProfileBanner` when profile is incomplete.

---

### DashboardSkeleton

File: `components/dashboard/DashboardSkeleton.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | `bg-surface` (outer card containers), `bg-surface-secondary` (placeholder bars), `bg-surface-secondary/70`, `bg-surface-secondary/60` (chart bars), `bg-surface-secondary/50`, `bg-surface-secondary/30` |
| Border | `border-border` (card containers), `border-t border-border/40` (chart footers) |
| Border radius | `rounded-2xl` (card containers), `rounded-xl` (chart area), `rounded-md` (placeholder text bars), `rounded-t-md` (chart bars), `rounded-full` (timeline dot placeholders) |
| Text | None (pure pulse placeholder blocks) |
| Spacing | `space-y-6 animate-pulse`, `p-6` (card containers), `gap-6` (grids), `gap-4` (flex items) |
| Hover state | None |
| Shadow | None |
| Animation | `animate-pulse` with `aria-hidden="true"` |

**Pattern notes:**
- Exact structural zero-CLS pulse skeleton replicating the complete dashboard grid (4 stat cards, 2 middle cards with timeline and bar heights, 8-col area chart box, and 4-col distribution bars).
- Used inside `<Suspense fallback={<DashboardSkeleton />}>` on `/dashboard` with Next.js 16 Partial Prerendering.

---

### RecentActivityCard

File: `components/dashboard/RecentActivityCard.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-info-lightest` (researched outer), `bg-info` (researched inner), `bg-success-lightest` (discovery outer), `bg-success-alt` (discovery inner), `bg-accent-muted` (tailored outer & empty icon), `bg-accent` (tailored inner), `bg-border-light` (timeline line) |
| Border | `border-border` (card) |
| Border radius | `rounded-2xl` (card), `rounded-full` (status nodes & empty icon container) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-sm font-medium` activity title) |
| Text — secondary | `text-text-muted` (`text-xs` relative timestamp, `text-xs` empty state prompt) |
| Spacing | `p-6` (card), `space-y-6` (timeline list), `gap-4` (timeline items), `py-8` (empty state) |
| Hover state | `group-hover:text-accent transition-colors` (interactive item link), `hover:text-accent-dark transition-colors` (empty state CTA) |
| Shadow | `shadow-xs` |
| Semantic usage | `ring-info-light bg-info-lightest` / `bg-info` (researched), `ring-success-light bg-success-lightest` / `bg-success-alt` (jobs found), `ring-accent-light bg-accent-muted` / `bg-accent` (tailored) |

**Pattern notes:**
- Connected vertical timeline with continuous line (`absolute left-[7px] top-4 -bottom-6 w-[1.5px] bg-border-light`) and dual-ring semantic status nodes (`w-3.5 h-3.5 rounded-full flex items-center justify-center ring-4`).
- Interactive titles: links to `/find-jobs/[id]` for researched companies and `/find-jobs` for job search runs with subtle `group-hover:text-accent` feedback.
- Clean onboarding zero-state with `Clock` icon and direct "Find jobs →" link when zero activity events exist.

---

### CompanyResearchChart

File: `components/dashboard/CompanyResearchChart.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-info-lightest` (badge pill & empty icon container), `bg-info` (bars), `bg-info-medium` (hovered bars) |
| Border | `border-border` (card), `border-info-light` (badge pill) |
| Border radius | `rounded-2xl` (card), `rounded-full` (badge pill & empty icon container), `rx={4} ry={4}` (SVG bars) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-sm font-medium` empty state title) |
| Text — secondary | `text-text-muted` (`text-xs` empty state prompt), `fill-text-muted` (Y-axis & X-axis labels), `text-info` (`text-xs font-medium` tooltip badge) |
| Spacing | `p-6` (card), `mb-4` (header), `h-[240px]` (chart area) |
| Hover state | `fill-text-primary font-semibold` (hovered X label), `var(--color-info-medium)` (hovered bar) |
| Shadow | `shadow-xs` |
| Semantic usage | `text-info bg-info-lightest border-info-light` (pill badge), `fill="var(--color-info)"` (bars) |

**Pattern notes:**
- Custom responsive SVG bar chart for 7-day company research activity.
- Dynamic Y-axis scale (`Math.max(..., 4)`) with dashed gridlines (`strokeDasharray="4 4" stroke="var(--color-border)"`).
- Clean in-card zero state with `Building2` icon when total research count is 0.

---

### JobsOverTimeChart

File: `components/dashboard/JobsOverTimeChart.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-accent-muted` (badge pill & empty icon container) |
| Border | `border-border` (card), `border-accent/20` (badge pill) |
| Border radius | `rounded-2xl` (card), `rounded-full` (badge pill, empty icon container, SVG hover points) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-sm font-medium` empty state title) |
| Text — secondary | `text-text-muted` (`text-xs` empty state prompt), `fill-text-muted` (Y-axis & X-axis labels), `text-accent` (`text-xs font-medium` tooltip badge) |
| Spacing | `p-6` (card), `mb-4` (header), `h-[260px]` (chart area) |
| Hover state | `fill-text-primary font-semibold` (hovered X label), `r={5}` active SVG node marker |
| Shadow | `shadow-xs` |
| Semantic usage | `stroke="var(--color-accent)"` (bezier curve line), `fill="url(#jobsCurveGradient)"` (subtle gradient area fill) |

**Pattern notes:**
- Custom responsive SVG area curve chart implementing cubic bezier smoothing (Catmull-Rom tension factor 0.2).
- Dynamic Y-axis scaling with dashed gridlines and gradient area fill under the curve.
- Clean in-card zero state with `TrendingUp` icon when discovered jobs count is 0.

---

### ScoreDistributionChart

File: `components/dashboard/ScoreDistributionChart.tsx`
Last updated: 2026-10-27

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-success-lightest` (badge pill & empty icon container), `bg-success` (bars), `bg-success-alt` (hovered bars) |
| Border | `border-border` (card), `border-success-light` (badge pill) |
| Border radius | `rounded-2xl` (card), `rounded-full` (badge pill & empty icon container), `rx={4} ry={4}` (SVG bars) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-sm font-medium` empty state title) |
| Text — secondary | `text-text-muted` (`text-xs` empty state prompt), `fill-text-muted` (Y-axis & X-axis labels), `text-success` (`text-xs font-medium` tooltip badge) |
| Spacing | `p-6` (card), `mb-4` (header), `h-[260px]` (chart area) |
| Hover state | `fill-text-primary font-semibold` (hovered X label), `var(--color-success-alt)` (hovered bar) |
| Shadow | `shadow-xs` |
| Semantic usage | `text-success bg-success-lightest border-success-light` (pill badge), `fill="var(--color-success)"` (bars) |

**Pattern notes:**
- Custom responsive SVG distribution histogram for 5 match score tiers (`50–60%`, `60–70%`, `70–80%`, `80–90%`, `90–100%`).
- Dynamic Y-axis scale with dashed gridlines and rounded bar tops (`rx={4} ry={4}`).
- Clean in-card zero state with `BarChart3` icon when scored jobs count is 0.







