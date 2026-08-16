# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation
**Last completed:** Better Auth Express Setup (instance + schemas + global types)
**Next:** 01 Homepage — Navbar & Mobile Menu

---

## Progress

### Phase 1 — Foundation

**01 Homepage**
- [ ] Navbar & Mobile Menu
- [ ] Hero Section
- [ ] Featured Products
- [ ] Best Sellers
- [ ] Offers / Discounts
- [ ] Category Grid
- [ ] Trust Badges
- [ ] Newsletter
- [ ] Footer

**02 Authentication**
- [ ] Login & Register Page UIs
- [x] Better Auth Express Setup
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

---

## Notes

_Add notes here as the build progresses — workarounds, patterns, anything that differs from the context files._
