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
Last updated: 2026-10-24

| Property | Class |
|---|---|
| Background | `bg-surface` (bar & dropdown pills), `bg-surface-secondary` (hover pill), `bg-accent-muted/40` (active dropdown item) |
| Border | `border-border` (bar, pill buttons, dropdown menu) |
| Border radius | `rounded-2xl` (bar), `rounded-xl` (popover menu), `rounded-lg` (pill buttons) |
| Text — primary | `text-text-primary` (`text-sm font-medium` pill buttons, items, input) |
| Text — secondary | `text-text-secondary` (chevrons), `text-text-muted` (search icon & placeholder) |
| Spacing | `p-4` (bar), `px-3.5 py-2` (pills & menu items), `gap-3` (dropdowns row) |
| Hover state | `hover:bg-surface-secondary` (pills, items), `hover:border-border` (input) |
| Shadow | `shadow-xs` (bar), `shadow-2xs` (pills), `shadow-lg` (dropdown popover) |
| Accent usage | `text-accent font-semibold bg-accent-muted/40` (active selected dropdown item) |

**Pattern notes:**
- Search and filter toolbar with left text query and right-aligned dropdown triggers.
- Outside-click dismissal for dropdown menus.

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
Last updated: 2026-10-25

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


