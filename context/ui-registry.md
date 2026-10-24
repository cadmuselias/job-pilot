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
Last updated: 2026-10-20

| Property | Class |
|---|---|
| Background | `bg-surface` (card), `bg-surface-secondary/20` (drop zone), `bg-accent-muted/40` (drag-over), `bg-accent-muted` (cloud icon badge), `bg-accent` (generate button) |
| Border | `border-border` (card/select button), `border-2 border-dashed border-border-muted` (drop zone) |
| Border radius | `rounded-2xl` (card), `rounded-xl` (drop zone), `rounded-full` (cloud badge), `rounded-lg` (buttons) |
| Text — primary | `text-text-primary` (`text-base font-semibold` heading, `text-sm font-semibold` drop title) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-text-muted` (`text-xs` file constraint) |
| Spacing | `p-6` (card), `py-10 px-6` (drop zone), `mt-5`, `mt-6 pt-5` (generation row) |
| Hover state | `hover:border-accent/40` (drop zone), `hover:bg-surface-secondary` (select button), `hover:bg-accent-dark` (generate button) |
| Shadow | `shadow-xs` (card & select button), `shadow-sm` (generate button) |
| Accent usage | `text-accent` (upload cloud icon), `bg-accent` / `hover:bg-accent-dark` (generate button), `bg-accent-muted` (icon badge) |

**Pattern notes:**
- Drag-and-drop state dynamically switches border to `border-accent` and background to `bg-accent-muted/40`.
- Secondary action button uses `bg-surface` with `border-border`; primary AI generation button uses solid `bg-accent` with `FileText` icon.

---

### ProfileForm

File: `components/profile/ProfileForm.tsx`
Last updated: 2026-10-20

| Property | Class |
|---|---|
| Background | `bg-surface` (card, inputs, skill tags), `bg-surface-secondary/20` (role card), `bg-surface-secondary` (add button), `bg-accent` (save button) |
| Border | `border-border` (card, inputs, dividers, tags), `border-border-light` (role card) |
| Border radius | `rounded-2xl` (card), `rounded-xl` (role card, save button), `rounded-lg` (inputs, select dropdowns), `rounded-full` (skill tags) |
| Text — primary | `text-text-primary` (`text-lg font-semibold` title, `text-sm font-semibold` section headings, `text-sm` input text) |
| Text — secondary | `text-text-secondary` (`text-sm`), `text-text-dark` (`text-[11px] font-semibold tracking-wider uppercase` labels), `text-text-muted` (placeholders) |
| Spacing | `p-6` (card interior), `p-4 sm:p-5` (role card), `px-3 py-2` (inputs), `my-6` (dividers), `space-y-4` (sections), `gap-4` (grids) |
| Hover state | `hover:bg-surface-tertiary` (tag add button), `hover:text-error` (tag remove), `hover:bg-accent-dark` (save button), `hover:text-accent-dark` (+ Add role) |
| Shadow | `shadow-xs` (card), `shadow-2xs` (skill chips), `shadow-sm` (save button) |
| Accent usage | `focus:ring-accent focus:border-accent` (inputs), `bg-accent hover:bg-accent-dark` (save button), `text-accent` (+ Add role) |

**Pattern notes:**
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



