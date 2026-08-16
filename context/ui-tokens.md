# UI Tokens

Design tokens for Spiceey. All colors, typography, spacing, and component values for the Spiceey ecommerce platform. Use these exact values throughout the codebase — never hardcode colors or use raw Tailwind color classes in components.

---

## Design Direction

**Design Read:** Premium consumer DTC ecommerce for artisan food (homemade spices & pickles, Bangladesh), mobile-first, with a warm organic premium language. Dual purpose: working store + portfolio showcase.

**Dials:**
- `DESIGN_VARIANCE: 7` — Offset asymmetric layouts, interesting but usable for ecommerce
- `MOTION_INTENSITY: 7` — Portfolio demands visible motion. Scroll-reveals, spring hovers, page transitions
- `VISUAL_DENSITY: 4` — Comfortable daily-app spacing. Not art-gallery sparse, not packed

**Palette Family:** Burnt Sienna Committed — one committed brand color (Burnt Sienna #BE5428) owns 30-40% of the surface as full regions (sections, fields, navigation), not scattered accents. Clean warm white + neutral charcoal carry the rest. No second accent color, ever. Dark mode is warm charcoal with a brighter sienna (#D96C3C) for brand fields.

**Color strategy rules (locked):**
- The sienna is COMMITTED: it appears as large color fields (hero regions, footer, full-bleed sections, nav accents), never only as tiny buttons.
- One accent per page — the sienna. Status/category colors are functional semantics, not brand accents.
- Body text never sits directly on sienna fields (contrast). Sienna fields carry white large display text or white CTAs only.
- Interactive sienna (#BE5428) passes WCAG AA with white text (4.66:1). Dark-mode field sienna (#D96C3C) is for large display text (3:1+), buttons stay #BE5428 in both modes.

---

## How to Use

This project uses **Tailwind CSS v4**. All design tokens are defined using the `@theme` directive in `app/globals.css`. No `tailwind.config.ts` needed for colors or tokens.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-primary` → `bg-primary`, `text-primary`, `border-primary`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text-primary border-border"

// Also correct — references CSS variable directly
style={{ color: 'var(--color-text-primary)' }}

// Never — hardcoded hex values
className="bg-[#FEFDFB] text-[#292524]"

// Never — raw Tailwind color classes
className="bg-green-800 text-red-500"
```

---

## globals.css — Complete Token Definition

```css
@import "tailwindcss";

/* Fonts are loaded via next/font/google in app/layout.tsx.
   @theme inline maps the next/font CSS variables to Tailwind utilities. */
@theme inline {
  --font-sans: var(--font-schibsted);
  --font-display: var(--font-bricolage);
}

@theme {
  /* ─── Primary Brand (Burnt Sienna — committed color) ─── */
  /* Interactive-safe sienna: white text on it passes WCAG AA (4.66:1). */
  --color-primary: #BE5428;
  --color-primary-hover: #A1441E;
  --color-primary-active: #873817;
  --color-primary-wash: #F7E8DE;
  --color-primary-foreground: #FFFFFF;

  /* ─── Accent (one committed accent — the same sienna) ─── */
  --color-accent: #BE5428;
  --color-accent-hover: #A1441E;
  --color-accent-light: #F7E8DE;
  --color-accent-foreground: #FFFFFF;

  /* ─── Page and Surface Backgrounds ─── */
  --color-background: #FEFDFB;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F7F5F2;
  --color-surface-muted: #F0EDE8;

  /* ─── Borders ─── */
  --color-border: #E7E1D9;
  --color-border-light: #F0ECE6;

  /* ─── Text ─── */
  --color-text-primary: #292524;
  --color-text-secondary: #57534E;
  --color-text-muted: #78716C;

  /* ─── Status: Success ─── */
  --color-success: #16A34A;
  --color-success-light: #DCFCE7;
  --color-success-foreground: #15803D;

  /* ─── Status: Warning ─── */
  --color-warning: #F59E0B;
  --color-warning-light: #FEF9C3;
  --color-warning-foreground: #A16207;

  /* ─── Status: Error ─── */
  --color-error: #DC2626;
  --color-error-light: #FEE2E2;
  --color-error-foreground: #991B1B;

  /* ─── Status: Info ─── */
  --color-info: #2563EB;
  --color-info-light: #DBEAFE;
  --color-info-foreground: #1E40AF;

  /* ─── Order Status ─── */
  --color-status-pending: #F59E0B;
  --color-status-pending-bg: #FEF9C3;
  --color-status-confirmed: #2563EB;
  --color-status-confirmed-bg: #DBEAFE;
  --color-status-packing: #8B5CF6;
  --color-status-packing-bg: #EDE9FE;
  --color-status-ready: #0891B2;
  --color-status-ready-bg: #CFFAFE;
  --color-status-shipped: #7C3AED;
  --color-status-shipped-bg: #EDE9FE;
  --color-status-delivered: #16A34A;
  --color-status-delivered-bg: #DCFCE7;
  --color-status-cancelled: #DC2626;
  --color-status-cancelled-bg: #FEE2E2;
  --color-status-returned: #6B7280;
  --color-status-returned-bg: #F3F4F6;

  /* ─── Review Status ─── */
  --color-review-pending: #78716C;
  --color-review-pending-bg: #F7F5F2;
  --color-review-approved: #16A34A;
  --color-review-approved-bg: #DCFCE7;

  /* ─── Category Colors ─── */
  --color-category-ground: #BE5428;
  --color-category-ground-bg: #F7E8DE;
  --color-category-whole: #57534E;
  --color-category-whole-bg: #EDEBE6;
  --color-category-mix: #B45309;
  --color-category-mix-bg: #FEF3C7;
  --color-category-pickles: #4D7C0F;
  --color-category-pickles-bg: #ECFCCB;

  /* ─── Dark Overlay ─── */
  --color-overlay: rgba(0, 0, 0, 0.5);
  --color-overlay-heavy: rgba(0, 0, 0, 0.7);

  /* ─── Border Radius ─── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}

/* ─── Dark Mode Tokens (warm charcoal, green tint removed) ─── */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-background: #1C1917;
    --color-surface: #292524;
    --color-surface-secondary: #322E29;
    --color-surface-muted: #3B3630;

    --color-border: #403A33;
    --color-border-light: #4C453D;

    --color-text-primary: #FAF9F7;
    --color-text-secondary: #D6D2CB;
    --color-text-muted: #A8A29E;

    /* Brighter sienna for dark-mode brand fields; buttons keep the AA-safe #BE5428 */
    --color-primary: #D96C3C;
    --color-primary-hover: #E58354;
    --color-primary-wash: #3B2417;

    --color-accent-light: #3B2417;
  }
}

[data-theme="dark"] {
  --color-background: #1C1917;
  --color-surface: #292524;
  --color-surface-secondary: #322E29;
  --color-surface-muted: #3B3630;

  --color-border: #403A33;
  --color-border-light: #4C453D;

  --color-text-primary: #FAF9F7;
  --color-text-secondary: #D6D2CB;
  --color-text-muted: #A8A29E;

  --color-primary: #D96C3C;
  --color-primary-hover: #E58354;
  --color-primary-wash: #3B2417;

  --color-accent-light: #3B2417;
}
```

Tailwind v4 generates utility classes automatically from every `--color-*` token above:

- `bg-primary`, `text-primary`, `border-primary`
- `bg-surface`, `text-surface-secondary`
- `bg-success-light`, `text-text-muted`
- `bg-accent`, `text-accent-foreground`
- etc.

---

## Color Usage Guide

### Page Layout

| Element           | Token                  |
| ----------------- | ---------------------- |
| Page background   | `bg-background`        |
| Card / surface    | `bg-surface`           |
| Secondary surface | `bg-surface-secondary` |
| Muted surface     | `bg-surface-muted`     |
| Default border    | `border-border`        |
| Light border      | `border-border-light`  |

### Typography

| Element                | Token                           |
| ---------------------- | ------------------------------- |
| Headings, primary text | `text-text-primary` (#292524)   |
| Secondary text, labels | `text-text-secondary` (#57534E) |
| Placeholder, muted     | `text-text-muted` (#78716C)     |

### Primary Brand (Burnt Sienna — committed)

Used for: full-region brand fields (hero regions, footer, full-bleed sections), navbar brand accent, trust badges, section highlights, category highlights

| Element                | Token                    |
| ---------------------- | ------------------------ |
| Brand field background | `bg-primary`             |
| Text on primary bg     | `text-primary-foreground`|
| Hover states           | `bg-primary-hover`       |
| Links, icons           | `text-primary`           |
| Light badge background | `bg-primary-wash`        |

Committed strategy: the sienna appears as LARGE REGIONS (30-40% of a page's surface), not just tiny accents. Never reduce it to occasional button color.

### Accent Action (Committed Sienna — one accent only)

Used for: primary CTA buttons, Add to Cart, sale/discount badges, price highlights, destructive actions

| Element                | Token                    |
| ---------------------- | ------------------------ |
| CTA button background  | `bg-accent`              |
| CTA button hover       | `bg-accent-hover`        |
| CTA button text        | `text-accent-foreground`  |
| Light badge background | `bg-accent-light`        |
| Sale/discount text     | `text-accent`            |

### Order Status Colors

Each order status has a dedicated text color and badge background:

| Status | Text Token | Background Token |
| ------ | ---------- | ---------------- |
| Pending | `text-status-pending` | `bg-status-pending-bg` |
| Confirmed | `text-status-confirmed` | `bg-status-confirmed-bg` |
| Packing | `text-status-packing` | `bg-status-packing-bg` |
| Ready for Courier | `text-status-ready` | `bg-status-ready-bg` |
| Shipped | `text-status-shipped` | `bg-status-shipped-bg` |
| Delivered | `text-status-delivered` | `bg-status-delivered-bg` |
| Cancelled | `text-status-cancelled` | `bg-status-cancelled-bg` |
| Returned | `text-status-returned` | `bg-status-returned-bg` |

### Category Colors

Each product category has a dedicated color pair:

| Category | Text Token | Background Token |
| -------- | ---------- | ---------------- |
| Ground Spices | `text-category-ground` | `bg-category-ground-bg` |
| Whole Spices | `text-category-whole` | `bg-category-whole-bg` |
| Spice Mixes | `text-category-mix` | `bg-category-mix-bg` |
| Pickles | `text-category-pickles` | `bg-category-pickles-bg` |

### Review Status

| Status | Text Token | Background Token |
| ------ | ---------- | ---------------- |
| Pending (author only) | `text-review-pending` | `bg-review-pending-bg` |
| Approved | `text-review-approved` | `bg-review-approved-bg` |

---

## Typography

Two families, imported via `next/font/google` as variable fonts in the root layout:

| Role | Font | CSS variable | Utility |
| ---- | ---- | ------------ | ------- |
| Display / headlines | **Bricolage Grotesque** | `--font-bricolage` | `font-display` |
| Body / UI / labels | **Schibsted Grotesk** | `--font-schibsted` | `font-sans` |

Rules:
- Display headlines (hero, page titles, big section headings) use `font-display`.
- Everything else uses `font-sans` (applied on `<html>` by default).
- Banned faces (never use): Inter, Roboto, Arial, Helvetica, Space Grotesk, Plus Jakarta Sans, Fraunces, Instrument Serif, system-font-as-primary.

| Element | Size | Weight | Line Height | Tracking | Color Token |
| ------- | ---- | ------ | ----------- | -------- | ----------- |
| Hero headline | 36/48/60px (`text-4xl md:text-5xl lg:text-6xl`) | 800 | 1.1 | -0.03em | `text-text-primary` |
| Section heading | 24/30px (`text-2xl md:text-3xl`) | 700 | 1.2 | -0.02em | `text-text-primary` |
| Card title | 18px (`text-lg`) | 600 | 1.4 | normal | `text-text-primary` |
| Body text | 16px (`text-base`) | 400 | 1.6 | normal | `text-text-primary` |
| Small / labels | 14px (`text-sm`) | 500 | 1.5 | normal | `text-text-secondary` |
| Micro / captions | 12px (`text-xs`) | 400 | 1.4 | +0.01em | `text-text-muted` |
| Price display | 20/24px (`text-xl md:text-2xl`) | 700 | 1.3 | normal | `text-text-primary` |
| Price currency | 16px (`text-base`) | 600 | 1.3 | normal | `text-text-secondary` |
| Discount price | 14px (`text-sm`) | 400 | 1.5 | normal | `text-text-muted` (strikethrough) |
| Stat number (admin) | 30px (`text-3xl`) | 700 | 1.2 | -0.02em | `text-text-primary` |
| Nav item (active) | 14px (`text-sm`) | 600 | 1.5 | normal | `text-primary` |
| Nav item (inactive) | 14px (`text-sm`) | 500 | 1.5 | normal | `text-text-secondary` |
| Logo text | 20px (`text-xl`) | 800 | 1.2 | -0.02em | `text-primary` |

---

## Spacing

| Token       | Value      | Usage                 |
| ----------- | ---------- | --------------------- |
| `gap-1`     | 4px        | Tight inline gaps     |
| `gap-2`     | 8px        | Badge and tag gaps    |
| `gap-3`     | 12px       | Form field gaps       |
| `gap-4`     | 16px       | Card internal gaps    |
| `gap-6`     | 24px       | Section internal gaps |
| `gap-8`     | 32px       | Between card groups   |
| `py-16`     | 64px       | Section padding (mobile) |
| `md:py-24`  | 96px       | Section padding (desktop) |
| `p-4`       | 16px       | Card padding (mobile) |
| `md:p-6`    | 24px       | Card padding (desktop) |
| `px-4`      | 16px       | Page padding (mobile) |
| `md:px-6`   | 24px       | Page padding (tablet) |
| `lg:px-8`   | 32px       | Page padding (desktop) |

---

## Component Tokens

### Cards

```
background: bg-surface
border: 1px solid var(--color-border)
border-radius: 12px (rounded-xl)
padding: p-4 md:p-6
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)
hover shadow: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)
```

### Product Card

```
container: bg-surface rounded-xl border-border overflow-hidden
image: aspect-[4/5] overflow-hidden
  hover: scale(1.03) via spring (200 stiffness, 24 damping)
discount badge: absolute top-3 right-3, bg-accent text-accent-foreground, rounded-full, px-2.5 py-0.5, text-xs font-semibold
category label: text-xs text-text-muted font-medium uppercase tracking-wide
title: text-base font-semibold text-text-primary, line-clamp-1
price: text-lg font-bold text-text-primary, tabular-nums
  original (if discount): text-sm text-text-muted line-through
  savings badge: text-xs text-accent font-medium
variant chips: text-xs text-text-secondary bg-surface-secondary rounded-full px-2 py-0.5
add to cart: w-full bg-accent text-accent-foreground rounded-lg py-2.5 font-semibold text-sm
  hover: bg-accent-hover
  active: scale(0.97) via spring
wishlist heart: absolute top-3 left-3, text-text-muted hover:text-accent
  filled (wishlisted): text-accent fill-accent
```

### Buttons

**Primary (CTA — Accent):**

```
background: bg-accent
text: text-accent-foreground
border-radius: rounded-lg (8px)
padding: px-5 py-2.5
font-size: text-sm
font-weight: font-semibold
hover: bg-accent-hover
active: scale(0.97) via spring
disabled: opacity-50 cursor-not-allowed
```

**Secondary (Brand):**

```
background: bg-primary
text: text-primary-foreground
border-radius: rounded-lg (8px)
padding: px-5 py-2.5
hover: bg-primary-hover
```

**Outline:**

```
background: bg-surface
border: border border-border
text: text-text-primary
border-radius: rounded-lg (8px)
padding: px-5 py-2.5
hover: bg-surface-secondary
```

**Ghost:**

```
background: transparent
text: text-text-secondary
hover: bg-surface-secondary
border-radius: rounded-lg (8px)
```

### Input Fields

```
background: bg-surface
border: border border-border
border-radius: rounded-lg (8px)
padding: px-3 py-2.5
text: text-text-primary text-base (16px minimum — prevents iOS zoom)
placeholder: text-text-muted
focus: ring-2 ring-primary/20 border-primary
error: border-error ring-2 ring-error/20
disabled: bg-surface-muted text-text-muted cursor-not-allowed
```

### Badges

```
border-radius: rounded-full (pill)
padding: px-2.5 py-0.5
font-size: text-xs
font-weight: font-medium
```

### Navbar

```
height: h-16 (64px desktop), h-14 (56px mobile)
background: bg-surface/80 backdrop-blur-xl
border-bottom: border-b border-border
position: sticky top-0 z-40
logo: text-xl font-extrabold text-primary tracking-tight
```

### Footer

```
background: bg-primary
text: text-primary-foreground
padding: py-16 md:py-20
link hover: text-primary-wash
border-top: none (full-color section)
```

### Admin Dashboard Stat Card

```
container: bg-surface rounded-xl border-border p-6
stat number: text-3xl font-bold text-text-primary tabular-nums
label: text-sm text-text-secondary font-medium
trend badge positive: bg-success-light text-success-foreground rounded-sm px-2 py-0.5 text-xs font-medium
trend badge negative: bg-error-light text-error-foreground rounded-sm px-2 py-0.5 text-xs font-medium
```

### Star Rating

```
filled: text-warning (amber)
empty: text-border
size: w-4 h-4 (product card), w-5 h-5 (product detail)
```

### Toast / Notification

```
Uses sonner defaults with brand tokens
success: border-l-4 border-success
error: border-l-4 border-error
info: border-l-4 border-info
```

### Table (Admin)

```
header row: bg-surface-secondary
header text: text-xs font-medium text-text-muted uppercase tracking-wide
row border: border-b border-border
row hover: bg-surface-secondary
cell text: text-sm text-text-primary
```

### Announcement Banner

```
info: bg-info-light text-info-foreground border-b border-info/20
warning: bg-warning-light text-warning-foreground border-b border-warning/20
success: bg-success-light text-success-foreground border-b border-success/20
dismiss: text-current opacity-60 hover:opacity-100
animation: slide-down entrance via AnimatePresence
```

---

## Motion Tokens

Shared animation constants used across all components. Defined in `client/lib/motion.ts`.

```typescript
export const MOTION = {
  ease: {
    smooth: [0.16, 1, 0.3, 1],
    spring: { type: "spring", stiffness: 200, damping: 24 },
    bounce: { type: "spring", stiffness: 300, damping: 18 },
    gentle: { type: "spring", stiffness: 120, damping: 20 },
  },
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    reveal: 0.8,
  },
  stagger: {
    fast: 0.04,
    normal: 0.06,
    slow: 0.08,
  },
} as const;
```

---

## Invariants

- Never use hex values directly in components — always use CSS variables via Tailwind tokens
- Fonts: Bricolage Grotesque (`font-display`) for display headlines, Schibsted Grotesk (`font-sans`) for body/UI — both via `next/font/google`, never a fallback system font as primary
- Never use raw Tailwind color classes like `bg-green-800` or `text-red-500` — use project tokens only
- `--color-primary` (#BE5428) is the committed brand sienna — never use Tailwind's built-in red/orange scales
- `--color-accent` (#BE5428) is the action sienna — one accent only, never introduce a second accent color
- The sienna is committed: it must appear as large color regions (30-40% of surface), not just tiny button accents
- All borders default to `--color-border` (#E7E1D9) — never use `border-gray-*`
- Prices always use `tabular-nums` for proper alignment
- Input text must be 16px minimum to prevent iOS auto-zoom on focus
- Dark mode uses warm charcoal darks — never pure gray-black backgrounds, never green tints
- All motion uses spring physics for interactions, tween for scroll-reveals
- Order status colors are semantic — always use the dedicated status tokens, never generic colors
- Category colors are fixed — each category always uses its assigned color pair
