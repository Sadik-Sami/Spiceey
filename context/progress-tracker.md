# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation
**Last completed:** 01 Homepage — Navbar & Mobile Menu (`navbar.tsx`, `mobile-nav.tsx`, Cart Badge counter, Session menu, Theme toggle)
**Next:** 01 Homepage — Hero Section

---

## Progress

### Phase 1 — Foundation

**01 Homepage**

- [x] Navbar & Mobile Menu
- [ ] Hero Section
- [ ] Featured Products
- [ ] Best Sellers
- [ ] Offers / Discounts
- [ ] Category Grid
- [ ] Trust Badges
- [ ] Newsletter
- [ ] Footer

**02 Authentication**

- [x] Login & Register Page UIs
- [x] Better Auth Express Setup
- [x] Client Auth Client Setup (`auth-client.ts` + Login & Register Form Integration)
- [ ] API Routes (sign-in, sign-up, session, sign-out)
- [ ] Zustand Auth Store

**03 Route Protection**

- [ ] Next.js proxy.ts setup
- [ ] Auth & RBAC validation logic

**04 Express Server Foundation**

- [ ] App & Middleware setup (CORS, Error, Zod)
- [ ] Drizzle Setup & Database Schema

**05 Database Seed**

- [ ] Mock Products, Blogs, & Config Seed Data

### Phase 2 — Shop

**06 Shop Page**

- [ ] Page Layout & Search Bar
- [ ] Category Filter Tabs & Sort Dropdown
- [ ] Product Card Component
- [ ] Product Grid & Pagination
- [ ] API: GET /api/products

**07 Product Detail Page**

- [ ] Image Gallery Component
- [ ] Product Info & Variant Selector
- [ ] Add to Cart & Wishlist Actions
- [ ] Product Tabs (Description, Ingredients, etc.)
- [ ] Reviews & Related Products Sections
- [ ] API: GET /api/products/:slug
- [ ] SEO / JSON-LD Setup

### Phase 3 — Cart & Checkout

**08 Cart Page**

- [ ] Zustand Cart Store Setup
- [ ] Cart Page Layout & Item Component
- [ ] Order Summary & Coupon Input
- [ ] API: Cart Sync & Coupon Validation

**09 Checkout Flow**

- [ ] Checkout Layout & Progress Indicator
- [ ] Step 1: Shipping Form
- [ ] Step 2: Payment & Review
- [ ] Step 3: Confirmation Page
- [ ] API: POST /api/orders (Validation & Transaction)

### Phase 4 — Customer Account

**10 Profile Page**

- [ ] Profile Layout & Sidebar
- [ ] Personal Info & Avatar Upload
- [ ] Address Management Modal
- [ ] API: Profile & Address CRUD

**11 My Orders Page**

- [ ] Order List Layout & Filters
- [ ] Expandable Order Card
- [ ] API: GET /api/orders/my

**12 Write a Review**

- [ ] Review Modal/Form Component
- [ ] API: POST /api/reviews

### Phase 5 — Admin Dashboard

**13 Admin Layout & Dashboard**

- [ ] Admin Sidebar & Shell
- [ ] Stat Cards & Trend Indicators
- [ ] Revenue & Orders Charts
- [ ] Recent Orders & Low Stock Tables
- [ ] API: Analytics Endpoints

**14 Product Management**

- [ ] Product List Table & Filters
- [ ] Product Form Layout & Variant Manager
- [ ] Tiptap Rich Text Editor
- [ ] Cloudinary Image Uploader
- [ ] API: Product CRUD & Status Toggle

**15 Order Management**

- [ ] Orders List & Filters
- [ ] Order Detail View
- [ ] Status Update & Tracking Entry
- [ ] API: Order Management Endpoints

**16 Inventory Management**

- [ ] Inventory Dashboard & Alerts
- [ ] Stock Adjustment Modal & Movement Log
- [ ] API: Inventory Endpoints

**17 Customer & 18 Review Moderation**

- [ ] Customers List & Detail View
- [ ] Reviews List, Tabs & Detail Modal
- [ ] API: Customer & Review Moderation Endpoints

### Phase 6 — Content & Settings

**19 Blog & 20 Story Management**

- [ ] Admin Blog & Story CRUD UIs
- [ ] Public Blog & Story List Pages
- [ ] Public Blog & Story Detail Pages
- [ ] API: Content CRUD

**21 Coupon & 22 Settings Management**

- [ ] Admin Coupon List & Form
- [ ] Admin Announcements & Shipping Config
- [ ] Public Announcement Banner
- [ ] API: Settings & Coupon Endpoints

---

## Decisions Made During Build

_Add decisions here as they are made during implementation._

- **Design System:** Burnt Sienna Committed palette (#BE5428 light / #D96C3C dark fields) — one committed accent, 30-40% surface coverage. Bricolage Grotesque (display) + Schibsted Grotesk (body) via next/font/google. Implemented in Tailwind v4 `@theme` in `app/globals.css`.
- **Motion:** Motion library (`motion/react`) for scroll-reveals, spring hover/tap physics, and layout animations from the start. All animations gated behind `useReducedMotion()`.
- **Auth:** Better Auth 1.6.29 runs on Express; httpOnly session cookies; `proxy.ts` does optimistic cookie-only checks (no per-route fetch).
- **Auth IDs:** `advanced.database.generateId: "uuid"` — Better Auth uses UUIDs to match the rest of the schema (otherwise default is short custom strings).
- **Auth origins:** `trustedOrigins: [env.CLIENT_URL]` instead of `disableOriginCheck` — explicit allowlist is just as easy in dev and stops "trust everything" footguns in staging.
- **Auth custom fields:** `phone` (optional, no DB-level unique — handled by app-level Zod) + `role` (`defaultValue: "customer"`, `input: false` so users can't self-promote).
- **Auth schema location:** All 4 Better Auth tables (user, session, account, verification) live in `server/src/db/schema/users.ts` and are regenerated via `@better-auth/cli generate`. Reconciled against architecture conventions (timestamptz, explicit named indexes, role NOT NULL default 'customer').
- **Auth mount (Express v5):** `app.all("/api/auth/*splat", toNodeHandler(auth))` — Express 5 ships with `path-to-regexp@8` which dropped the unnamed `*` wildcard. Bare `/api/auth/*` throws `PathError: Missing parameter name` at boot.
- **Express types:** `server/src/types/express.d.ts` augments `Express.Request` with optional `user`/`session` (typed via `auth.$Infer.Session`). Auth middleware sets, RBAC asserts, controllers null-check — no `requireUser()` helper in V1.
- **Path Aliases & Imports:** Switched to `moduleResolution: "bundler"` and added `tsc-alias -f` to the build step. We now use `@/` path aliases everywhere in `src/` without ugly `.js` extensions. The build step automatically resolves and appends the `.js` extensions needed for ESM production runtime.
- **Rate Limiting & IP Tracking:** Resolved Better Auth's shared-bucket fallback warning. Added `advanced.ipAddress` config (headers: `x-forwarded-for`, `x-real-ip`, etc.) and `trustedProxies` via env. Also added `NODE_ENV=development` to `.env` so local dev correctly falls back to `127.0.0.1` instead of triggering a rate-limit warning.
- **ORM:** Drizzle ORM 0.45.2 (stable line) on PostgreSQL 17; integer BDT money; `SELECT ... FOR UPDATE` + guarded atomic UPDATE for stock reservation.
- **Auth Route Layout & Heritage Showcase:** Implemented `app/(auth)/layout.tsx` with dedicated navigation (sticky header with `AuthBackButton` and centered brand logo, minimal footer). Asymmetric 2-column desktop grid pairs an immersive `AuthShowcasePanel` on `lg:col-span-5` (35–40% Burnt Sienna `#BE5428` commitment, high-contrast white text, and trust pillars) with full-feature client form cards on `lg:col-span-7`.
- **Client Auth Integration (`auth-client.ts`):** Initialized `createAuthClient` from `better-auth/react` pointing to `NEXT_PUBLIC_SERVER_URL` (default `http://localhost:4000`). Exported `signIn`, `signUp`, `signOut`, `useSession`, `getSession`, and enriched `User` / `Session` type inferences (`phone`, `role`).
- **Form Validation & Motion Physics:** Built `login-form.tsx` and `register-form.tsx` using `react-hook-form` + `@hookform/resolvers/zod`. Validation rules in `lib/validations/auth.ts` enforce Bangladesh phone formats (`/^(?:\+8801|01)[3-9]\d{8}$/`) and password confirmation matching. Standardized spring/easing curves and stagger durations in `lib/motion.ts` with `AnimatePresence` alerts for error feedback.
- **Theme & Dark Mode Foundation:** Configured `next-themes` via `ThemeProvider` (`client/components/providers/theme-provider.tsx`) with `attribute="class"`, `defaultTheme="light"`, `enableSystem`, and `disableTransitionOnChange`. Mounted at root in `client/app/layout.tsx` with `suppressHydrationWarning` on `<html>`. Declared `@custom-variant dark (&:where(.dark, .dark *));` in `client/app/globals.css` to enable class-based dark styling in Tailwind v4 alongside explicit `--color-popover`, `--color-muted`, `--color-input`, and `--color-ring` tokens for light, `.dark`, and `[data-theme='dark']` scopes. Added `ModeToggle` (`client/components/mode-toggle.tsx`) with animated Sun/Moon icon transforms and Base UI `DropdownMenu` primitive for Light/Dark/System selection.
- **Tailwind Canonical Classes Standard:** Standardized on canonical Tailwind v4 scale utility classes (e.g., `min-h-11` for 44px touch targets, `min-h-10` for 40px, `min-w-4` for 16px badge min-width, `w-30` for 120px, `max-w-350` for 1400px container max-width). Arbitrary bracket classes (`[...]`) are strictly prohibited unless a dimension is unrepresentable on the standard scale.
- **Navigation & Mobile Drawer (`navbar.tsx`, `mobile-nav.tsx`, `cart-store.ts`):** Implemented sticky navigation shell (`sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border`) with Bricolage Grotesque logo, desktop active spring pill indicator (`layoutId="nav-active-indicator"`), hydration-safe cart badge reading from Zustand (`useCartStore` with `useSyncExternalStore`), authenticated user dropdown via Base UI with role checking (`admin` / `super_admin`), and AnimatePresence mobile drawer with touch targets >=44px (`min-h-11`), category pills, Escape key dismissal, and body scroll locking. Mounted globally in `client/app/layout.tsx`.
- **Google OAuth Client-Origin & Redirect URI Fix:** Configured dynamic `callbackURL` resolution (`typeof window !== "undefined" ?`${window.location.origin}/profile` : "/profile"`) in `client/components/auth/login-form.tsx` and `client/components/auth/register-form.tsx`. On the server (`server/src/auth/index.ts`), added explicit `redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`` and `prompt: "select_account"` to ensure seamless multi-origin OAuth redirects.

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
