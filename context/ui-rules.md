# UI Rules

Rules for building the Spiceey UI. Covers layout, motion, components, performance, SEO/AEO, and constraints. Read ui-tokens.md for exact color/typography values. These two files together are the complete design system.

---

## Font

Two families, both imported via `next/font/google` in the root layout as variable fonts:

```typescript
import { Bricolage_Grotesque, Schibsted_Grotesk } from "next/font/google";
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});
```

- Display headlines (hero, page titles, big section headings) use `font-display` (Bricolage Grotesque).
- Body, UI, and labels use `font-sans` (Schibsted Grotesk), applied on the `<html>` tag by default.
- Never use system fonts as the primary font. Never use Inter, Roboto, Arial, Helvetica, Space Grotesk, Plus Jakarta Sans, Fraunces, or Instrument Serif.

---

## Layout

- Page max-width: 1400px, centered (`max-w-[1400px] mx-auto`)
- Page padding: `px-4 md:px-6 lg:px-8`
- Section vertical padding: `py-16 md:py-24`
- Gap between page sections: `gap-8` (32px) minimum
- Header height: 64px desktop, 56px mobile. Sticky with backdrop-blur
- Mobile-first: all layouts start as single-column, scale up at breakpoints
- Every page must be fully usable at 320px viewport width

### Committed Color Strategy (locked)

- The brand sienna (primary/accent) is COMMITTED: every page must carry it as large regions (hero fields, full-bleed sections, footer, nav accents) covering roughly 30-40% of the surface. Tiny-button-only usage is a failure of the strategy.
- One accent per page — the sienna. Status and category colors are functional semantics, never brand accents.
- Body text never sits directly on sienna fields. Sienna fields carry white display text (3:1+ contrast) and white CTAs only.
- Dark mode: brand fields use the brighter sienna (`#D96C3C`); interactive buttons stay the AA-safe `#BE5428` in both modes.

---

## Navbar

Public nav items: Shop, Blog, Stories. Action items: Search, Cart (with count badge), Account dropdown.

- Desktop: Logo (left) + nav links (center) + actions (right)
- Mobile: Logo (left) + cart icon + hamburger (right) → slide-up sheet with nav links
- Sticky: `sticky top-0 z-40`
- Background: `bg-surface/80 backdrop-blur-xl border-b border-border`
- Active nav item: `text-primary font-semibold`
- Inactive nav item: `text-text-secondary font-medium`
- Cart badge: `bg-accent text-accent-foreground` pill with item count
- Logo: `text-xl font-extrabold text-primary tracking-tight`
- Mobile nav sheet: slide-up with `AnimatePresence`, semi-transparent backdrop

---

## Cards

Every content section lives in a card on admin pages. Product cards, blog cards, and story cards have their own specific structures (see Component Tokens in ui-tokens.md).

```
background: bg-surface
border: 1px solid var(--color-border)
border-radius: 12px (rounded-xl)
padding: p-4 md:p-6
box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)
```

Card hover (where interactive): shadow expands via spring physics (200 stiffness, 24 damping), lift -2px translateY. Always white/surface background — never colored card backgrounds. Color goes inside cards via badges, text, and images.

---

## Typography Hierarchy

Four levels used consistently:

**Hero / Display** — homepage hero, page titles on marketing pages

```
font-display text-4xl md:text-5xl lg:text-6xl
font-weight: 800
tracking: -0.03em
line-height: 1.1
color: text-text-primary
```

**Section headings** — card group titles, page section titles

```
text-2xl md:text-3xl
font-weight: 700
tracking: -0.02em
line-height: 1.2
color: text-text-primary
```

**Body / primary content text**

```
text-base (16px)
font-weight: 400
line-height: 1.6
max-width: 65ch for paragraphs
color: text-text-primary
```

**Small / labels / muted text** — timestamps, captions, helper text

```
text-xs (12px) or text-sm (14px)
font-weight: 400-500
line-height: 1.4-1.5
color: text-text-muted or text-text-secondary
```

---

## Motion Rules

This project uses **Motion** (the library formerly known as Framer Motion). Import from `motion/react`.

### General

- All motion components must be Client Components with `"use client"`
- Only animate `transform` and `opacity` — never `width`, `height`, `top`, `left`
- All motion gated behind `useReducedMotion()` — reduced motion = instant/static
- Spring physics for interactions (hover, tap, drag): `{ type: "spring", stiffness: 200, damping: 24 }`
- Tween with smooth easing for scroll-reveals: `[0.16, 1, 0.3, 1]`
- Never use `useState` for continuous values — use `useMotionValue` + `useTransform`
- Lazy-load motion components below the fold where possible

### Scroll-Reveal Pattern

Every section below the fold uses scroll-reveal entrance:

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
```

- `viewport={{ once: true }}` — fire once, never re-trigger
- Stagger children with 60ms delay between items
- Maximum 24px y-offset for entrance — never more

### Hover Interactions

Product cards, blog cards, and interactive elements use spring hover:

```tsx
<motion.div
  whileHover={{ y: -2, scale: 1.01 }}
  transition={{ type: "spring", stiffness: 200, damping: 24 }}
>
```

- Subtle: -2px lift + 1.01 scale maximum for cards
- Image zoom: scale(1.03) inside overflow-hidden container
- Never use translateY more than -4px on hover

### Press/Tap Feedback

All buttons and clickable elements:

```tsx
<motion.button whileTap={{ scale: 0.97 }}>
```

### Page Transitions

Subtle fade between route changes:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
```

### Layout Animations

Use `layoutId` for shared element transitions:

- Active tab/filter indicator sliding between options
- Variant selector pill moving to selected option
- Product card → product detail shared image transition (if feasible)

### Exit Animations

Use `AnimatePresence` for:

- Cart item removal (collapse height + fade)
- Modal/dialog entrance and exit
- Filter results changing
- Mobile nav sheet open/close
- Announcement banner dismiss

### Forbidden Motion Patterns

- `window.addEventListener("scroll")` — banned. Use `useScroll()` from Motion
- `requestAnimationFrame` loops touching React state — banned. Use `useMotionValue`
- More than 1 marquee per page — banned
- Infinite animation loops (except loading indicators) — banned
- Animations that delay user action — banned
- Animations on `width`, `height`, `top`, `left` — banned
- Parallax that causes CLS — banned

---

## Badges

All badges use `rounded-full` (pill shape).

```
padding: px-2.5 py-0.5
font-size: text-xs
font-weight: font-medium
```

Specific badge types:

- Discount: `bg-accent text-accent-foreground`
- Category: use category color tokens (see ui-tokens.md)
- Order status: use status color tokens (see ui-tokens.md)
- Review pending: `bg-review-pending-bg text-review-pending`
- Out of stock: `bg-surface-muted text-text-muted`

Admin trend badges use `rounded-sm` (4px) not pill.

---

## Buttons

**Primary (CTA):** `bg-accent text-accent-foreground` — used for Add to Cart, Shop Now, Place Order, Submit
**Secondary (Brand):** `bg-primary text-primary-foreground` — used for secondary actions, newsletter signup
**Outline:** `bg-surface border-border text-text-primary` — used for Cancel, Back, secondary options
**Ghost:** `transparent text-text-secondary` — used for tertiary actions, icon buttons

All buttons: `rounded-lg` (8px), `px-5 py-2.5`, `text-sm font-semibold`.

Button states:

- Hover: darken background
- Active: `scale(0.97)` via spring
- Disabled: `opacity-50 cursor-not-allowed`
- Loading: spinner replaces text, button disabled

---

## Form Inputs

```
background: bg-surface
border: border border-border
border-radius: rounded-lg (8px)
padding: px-3 py-2.5
font-size: text-base (16px minimum — prevents iOS auto-zoom)
text: text-text-primary
placeholder: text-text-muted
focus: ring-2 ring-primary/20 border-primary
error: border-error ring-2 ring-error/20
```

- Label ABOVE input, never placeholder-as-label
- Error text BELOW input in `text-error text-sm`
- Helper text in `text-text-muted text-sm`

---

## Table (Admin)

- Header row: `bg-surface-secondary`
- Header text: `text-xs font-medium text-text-muted uppercase tracking-wide`
- Row border: `border-b border-border`
- Row hover: `bg-surface-secondary`
- Cell text: `text-sm text-text-primary`
- No alternating row colors — clean rows with borders only

---

## Product Grid

Responsive columns:

- Mobile (< 640px): 2 columns
- Tablet (640-1023px): 3 columns
- Desktop (1024px+): 4 columns
- Gap: `gap-4 md:gap-6`

---

## Star Rating

- Filled stars: `text-warning` (amber)
- Empty stars: `text-border`
- Always show numeric rating next to stars: "4.8 (124 reviews)"
- Click-to-rate uses hover preview with half-star precision

---

## Empty States

Every section that can be empty must have an empty state:

- Descriptive text in `text-text-muted`
- Relevant icon above text (from lucide-react)
- CTA button if there's a logical next action
- Never show a blank white area

---

## Loading States

- Use skeleton loaders matching the final layout shape
- Skeletons use `bg-surface-muted` with subtle pulse animation
- Never use generic circular spinners for page content
- Button loading: replace text with spinner, keep button width stable
- Image loading: blur placeholder via `next/image`

---

## Dark Mode

- Dual-mode from day one. System preference by default, manual toggle available
- Use `dark:` Tailwind variant for all color changes
- Dark mode uses warm charcoal darks (stone family, green tint removed) — never pure gray-black
- Brand fields use the brighter dark-mode sienna (`#D96C3C`); buttons stay `#BE5428` in both modes
- Verify WCAG AA contrast in both modes before shipping any component
- Never use pure `#000000` or pure `#FFFFFF` — always off-black and off-white
- Theme toggle in navbar (icon: sun/moon)

---

## Web Vitals Rules

### LCP (< 2.5s)

- Hero image: `next/image` with `priority` prop and `sizes` attribute
- Font: loaded via `next/font/google` with `display: "swap"`
- Above-fold content must not depend on client-side JS to render

### CLS (< 0.1)

- All images must have explicit `width` and `height` OR use `aspect-ratio` CSS
- Font: variable font with proper fallback metrics
- Announcement banner reserves height before mount (fixed height container)
- No layout-shifting animations — all motion uses transform only
- Skeleton loaders match exact dimensions of loaded content

### INP (< 200ms)

- All animations on GPU (transform + opacity only)
- Debounce search input: 300ms
- Heavy computation off main thread
- No blocking JavaScript in critical render path

---

## SEO Rules

- Every public page exports `generateMetadata()` for title, description, Open Graph, Twitter Card
- JSON-LD structured data on all public pages (Product, Article, Organization, BreadcrumbList, FAQPage)
- Canonical URLs on every page via `alternates.canonical`
- Semantic HTML: proper heading hierarchy (one `h1` per page), landmark roles
- All images have descriptive `alt` text
- Internal links use `<Link>` from Next.js (prefetching)
- Automatic `sitemap.ts` and `robots.ts`

---

## AEO Rules (Answer Engine Optimization)

- FAQPage JSON-LD on homepage, product pages, and blog posts
- Product descriptions written as self-contained factual sentences (18-token extraction rule)
- "Last updated" dates on all content pages
- Expert attribution on blog posts (author name + credentials)
- Evidence panels on product pages: sourcing info, process, freshness guarantee

---

## Tailwind v4 & Canonical Classes

This project uses Tailwind v4. Tokens are defined with `@theme` in globals.css — no `tailwind.config.ts` needed for colors. Never define colors in a config file. Always use `@theme` for new tokens. Use `@tailwindcss/postcss` plugin, not the legacy `tailwindcss` PostCSS plugin.

**Tailwind Canonical Classes Rule:**

- Always use standard Tailwind scale classes (e.g., `min-h-11` for 44px, `min-h-10` for 40px, `min-w-4` for 16px, `min-w-24` for 96px, `w-30` for 120px) instead of arbitrary bracket values (`min-h-[44px]`).
- Arbitrary brackets (`[...]`) are strictly prohibited unless the size cannot be represented on the standard Tailwind scale (e.g., `min-h-[100dvh]`, `max-w-[1400px]`, `aspect-[4/5]`).

---

## Responsive Design

Mobile-first approach. All styling starts with mobile defaults, scales up:

- `sm:` (640px) — large phones, small tablets
- `md:` (768px) — tablets
- `lg:` (1024px) — small desktops
- `xl:` (1280px) — standard desktops
- `2xl:` (1536px) — large screens

Minimum touch target: `min-h-11 min-w-11` (44px minimum) on all interactive elements.

---

## Do Nots

- Never use Tailwind's built-in color classes (`bg-green-500`, `text-red-600`) — use project tokens only
- Never define colors in `tailwind.config.ts` — use `@theme` in globals.css
- Never add gradients to card backgrounds — cards are always solid surface color
- Never use more than the two approved font families (Bricolage Grotesque display + Schibsted Grotesk sans) — never add a third
- Never show raw error messages to users — always show human-readable text
- Never stack more than 2 levels of border radius inside each other
- Never use `position: fixed` for UI elements except the navbar and modals
- Never use Inter, Roboto, Arial, Helvetica, Space Grotesk, Plus Jakarta Sans, Fraunces, Instrument Serif, or system fonts as the primary font
- Never introduce a second accent color — the sienna is the one accent, ever
- Never use `h-screen` for full-height sections — use `min-h-[100dvh]`
- Never use `window.addEventListener("scroll")` — use Motion's `useScroll` hook
- Never animate `width`, `height`, `top`, or `left` — only `transform` and `opacity`
- Never use `useState` for continuous animation values — use `useMotionValue`
- Never let images render without dimensions or aspect-ratio (CLS violation)
- Never skip `prefers-reduced-motion` checks on any animation
- Never use hex values directly in components — always use token classes
- Never have more than one `h1` heading per page
- Never use placeholder text as the input label
- Never use arbitrary bracket classes (`min-h-[44px]`, `w-[40px]`) when a canonical Tailwind scale class (`min-h-11`, `w-10`) exists
