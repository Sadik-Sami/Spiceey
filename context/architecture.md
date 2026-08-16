# Spiceey — Full Stack Architecture

> Single-brand DTC ecommerce platform for homemade spices and pickles in Bangladesh. Mobile-first, SEO-optimized, admin-powered. **Client:** Next.js 16 (frontend). **Server:** Express v5 (backend).

---

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Next.js (App Router) | 16.2.6 | React framework, SSR, SEO |
| **Frontend Language** | TypeScript | 5.6+ | Type safety |
| **Styling** | Tailwind CSS | v4.1 | Utility-first CSS |
| **Animation** | Motion (Framer Motion) | 12.x | Scroll-reveal, spring interactions, layout animations |
| **Components** | shadcn/ui | CLI v4 | Accessible UI primitives |
| **Frontend State** | Zustand | 5.0.11 | Lightweight global state |
| **Query Cache** | TanStack Query | 5.x | Server state synchronization |
| **Route Protection** | Next.js proxy.ts | 16.x | Auth + RBAC route guards |
| **Backend Framework** | Express | 5.x | API server |
| **Backend Language** | TypeScript | 5.6+ | Type safety |
| **API Style** | REST | — | HTTP JSON endpoints |
| **ORM** | Drizzle ORM | 0.45.2 | Type-safe database queries |
| **Database** | PostgreSQL | 17 | Primary data store |
| **Auth** | Better Auth | 1.6.29 | Multi-method authentication (runs on Express) |
| **Validation** | Zod | 4.4.3 | Schema validation |
| **Rich Text** | Tiptap | 3.x | Blog and story editor |
| **Media Uploads** | Cloudinary (signed) | 2.x | Product and content images |
| **Payments (V1)** | Cash On Delivery | — | Bangladesh COD |
| **Payments (Future)** | bKash / Nagad / SSLCommerz | REST APIs | MFS and card payments |
| **Hosting** | Docker + DigitalOcean | — | Multi-service deployment |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Next.js 16)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  App Router   │  │  Server Comps │  │     proxy.ts Guards      │  │
│  │   (pages)     │  │  (SSR/SEO)    │  │  Auth + RBAC checks      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Client Comps │  │  Zustand     │  │   TanStack Query         │  │
│  │  (interact)   │  │  (cart, UI)  │  │   (cache + fetch)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
│  Data: fetch() / axios → http://localhost:4000/api/*  ─────────────┼──►
│  Auth: cookie-based session (httpOnly, sameSite)                    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP REST (JSON)
                              │
┌─────────────────────────────────────────────────────────────────────┐
│                          SERVER (Express v5)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  REST Routes  │  │  Zod Valid.  │  │  Drizzle ORM → Postgres  │  │
│  │  /api/*       │  │  (input)      │  │  (queries, transactions) │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  Better Auth  │  │  RBAC Mid.   │  │  Cloudinary Signed       │  │
│  │  (sessions)   │  │  (role guard)│  │  Upload Handler          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
│  No courier APIs. No webhooks. Admin handles all shipping manually. │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
/
├── client/                           # Next.js 16 Frontend
│   ├── app/                          # App Router pages, layouts, proxy.ts
│   ├── components/                   # UI components (shadcn/ui + custom)
│   ├── lib/                          # Utilities, API client, auth client
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # Client-side TypeScript types
│   ├── stores/                       # Zustand state stores
│   ├── public/images/
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile                    # Next.js standalone multi-stage build
│
├── server/                           # Express v5 Backend
│   ├── src/
│   │   ├── index.ts                  # Express app entry point
│   │   ├── routes/                   # REST API route definitions
│   │   ├── controllers/              # Route handler logic
│   │   ├── services/                 # Business logic layer
│   │   ├── middleware/               # Express middleware
│   │   ├── validators/               # Zod schemas (API contract)
│   │   ├── db/
│   │   │   ├── index.ts              # Drizzle client configuration
│   │   │   └── schema/               # Modular Drizzle schemas
│   │   │       ├── index.ts          # Barrel export for schemas
│   │   │       ├── relations.ts      # Relations definitions
│   │   │       └── *.ts              # Domain schemas (users, products, etc)
│   │   ├── env.ts                    # Environment validation (@t3-oss/env-core)
│   │   ├── drizzle.config.ts         # Drizzle configuration
│   │   ├── auth/                     # Better Auth instance setup
│   │   └── types/                    # Server-side TypeScript types
│   ├── package.json
│   ├── tsconfig.json
│   ├── docker-compose.yml            # Local dev DB only (postgres)
│   └── Dockerfile                    # pnpm fetch multi-stage build
│
├── context/                          # AI / Agent context and documentation
│   ├── architecture.md               # Agent architecture documentation
│   └── ...                           # Additional context files
│
├── AGENTS.md                         # Installed skills index
├── docker-compose.yml                # Central Docker services (db, server, client)
└── .env.example                      # All environment variables
```

---

## Latest Version Notes

**Next.js 16.2.6** ships with Turbopack as the default bundler (2-5x faster builds), stable React Compiler support for automatic memoization, Build Adapters API for non-Vercel deployments, and **`proxy.ts` replacing `middleware.ts`**. The App Router provides Server Components by default with streaming SSR.

`proxy.ts` is the new standard for route interception in Next.js 16. Unlike `middleware.ts` which ran on the Edge runtime, `proxy.ts` runs in the Node.js runtime alongside your application, giving full access to Node.js APIs. It is the recommended mechanism for **authenticated route protection** and **page-level authorization checking**.

**Express v5** introduces native async error handling (no more `asyncWrapper` boilerplate), improved router strictness, and better path matching. All route handlers can be async — errors in promises are automatically caught and forwarded to error middleware.

**Zod 4.4.3** represents a major performance leap — 14x faster string parsing, 7x faster arrays, 6.5x faster objects. The new `@zod/mini` package is only ~1.9 KB gzipped and fully tree-shakeable. Format helpers (`z.email()`, `z.uuid()`, `z.url()`) are now top-level functions.

**Drizzle ORM 0.45.2** (stable line) provides SQL-like query syntax with instant TypeScript inference. No code generation step needed unlike Prisma. Bundle size is ~12.2 KB vs Prisma's ~1.6 MB. First-class edge runtime support with native PostgreSQL driver.

**Better Auth 1.6.29** runs entirely on the Express server. The frontend never handles auth logic directly — it redirects to/auth endpoints and receives httpOnly session cookies. Role-based access control is enforced server-side on every protected route.

---

## Folder Structure (Detailed)

### Client — Next.js 16 Frontend

```
client/
├── app/
│   ├── layout.tsx                    # Root layout, fonts, providers
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles + Tailwind
│   ├── robots.ts                     # SEO robots.txt
│   ├── sitemap.ts                    # SEO sitemap.xml
│   ├── proxy.ts                      # Auth + RBAC route protection
│   ├── (auth)/
│   │   ├── login/page.tsx            # Login page
│   │   └── register/page.tsx         # Registration page
│   ├── (shop)/
│   │   ├── shop/page.tsx             # Product listing with filters
│   │   ├── shop/[slug]/page.tsx      # Product detail page
│   │   ├── cart/page.tsx             # Shopping cart
│   │   ├── wishlist/page.tsx         # Wishlist (authenticated)
│   │   └── checkout/page.tsx         # Checkout flow
│   ├── (customer)/
│   │   ├── profile/page.tsx          # Customer profile
│   │   ├── profile/orders/page.tsx       # Order history
│   │   └── profile/reviews/page.tsx      # My reviews
│   ├── (content)/
│   │   ├── blog/page.tsx             # Blog listing
│   │   ├── blog/[slug]/page.tsx      # Blog post detail
│   │   ├── stories/page.tsx          # Stories listing
│   │   └── stories/[slug]/page.tsx   # Story detail
│   └── (admin)/
│       ├── layout.tsx                # Admin shell with sidebar
│       ├── page.tsx                  # Admin dashboard (analytics)
│       ├── products/page.tsx         # Product CRUD
│       ├── products/[id]/page.tsx    # Product edit
│       ├── variants/page.tsx         # Variant management
│       ├── orders/page.tsx           # Order management
│       ├── orders/[id]/page.tsx      # Order detail
│       ├── customers/page.tsx        # Customer list
│       ├── reviews/page.tsx          # Review moderation
│       ├── inventory/page.tsx        # Inventory dashboard
│       ├── blogs/page.tsx            # Blog CRUD
│       ├── stories/page.tsx          # Story CRUD
│       ├── coupons/page.tsx          # Coupon management
│       └── settings/page.tsx         # Announcements, shipping config
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── layout/
│   │   ├── navbar.tsx                # Main navigation
│   │   ├── footer.tsx                # Site footer
│   │   ├── mobile-nav.tsx            # Mobile bottom nav
│   │   └── admin-sidebar.tsx         # Admin navigation
│   ├── homepage/
│   │   ├── hero.tsx                  # Hero section
│   │   ├── featured-products.tsx     # Featured products grid
│   │   ├── best-sellers.tsx          # Best sellers section
│   │   ├── offers-section.tsx        # Active discounts
│   │   ├── category-grid.tsx         # Category navigation
│   │   ├── trust-badges.tsx          # Trust indicators
│   │   └── newsletter.tsx            # Email signup
│   ├── shop/
│   │   ├── product-card.tsx          # Product card
│   │   ├── product-grid.tsx          # Product grid + pagination
│   │   ├── product-filters.tsx       # Desktop sidebar filters
│   │   ├── mobile-filters.tsx        # Bottom sheet mobile filters
│   │   ├── search-bar.tsx            # Product search
│   │   └── sort-dropdown.tsx         # Sort options
│   ├── product/
│   │   ├── product-gallery.tsx       # Image gallery
│   │   ├── variant-selector.tsx      # Weight variant picker
│   │   ├── quantity-selector.tsx     # Quantity stepper
│   │   ├── add-to-cart.tsx           # Add to cart button
│   │   ├── product-info.tsx          # Title, price, description
│   │   ├── product-tabs.tsx          # Description, ingredients, reviews
│   │   └── related-products.tsx      # Related items
│   ├── cart/
│   │   ├── cart-item.tsx             # Cart line item
│   │   ├── cart-summary.tsx          # Order summary + checkout
│   │   └── empty-cart.tsx            # Empty state
│   ├── checkout/
│   │   ├── checkout-form.tsx         # Main checkout form
│   │   ├── shipping-form.tsx         # Address fields
│   │   ├── payment-selector.tsx      # Payment method picker
│   │   ├── order-review.tsx          # Final review step
│   │   └── checkout-progress.tsx     # Step indicator
│   ├── admin/
│   │   ├── stats-cards.tsx           # Dashboard KPI cards
│   │   ├── revenue-chart.tsx         # Sales chart
│   │   ├── recent-orders.tsx         # Orders table preview
│   │   ├── low-stock-alert.tsx       # Inventory warnings
│   │   ├── data-table.tsx            # Reusable admin table
│   │   ├── product-form.tsx          # Product CRUD form
│   │   ├── variant-manager.tsx       # Variant management
│   │   ├── inventory-logger.tsx      # Stock movement log
│   │   ├── order-status-timeline.tsx # Order lifecycle visual
│   │   ├── courier-update.tsx        # Manual courier status update
│   │   ├── image-uploader.tsx        # Cloudinary signed upload component
│   │   └── rich-text-editor.tsx      # Tiptap editor wrapper
│   ├── review/
│   │   ├── review-list.tsx           # Product reviews
│   │   ├── review-form.tsx           # Write review form
│   │   └── star-rating.tsx           # Star rating display
│   └── content/
│       ├── blog-card.tsx             # Blog preview card
│       └── story-card.tsx            # Story preview card
├── lib/
│   ├── utils.ts                      # General helpers (cn, etc.)
│   ├── motion.ts                     # Shared animation constants (easing, duration, stagger)
│   ├── constants.ts                  # App constants
│   ├── api-client.ts                 # Axios/fetch wrapper for Express API
│   ├── auth-client.ts                # Better Auth client config
│   ├── cloudinary-client.ts          # Cloudinary upload helpers (browser)
│   ├── seo.ts                        # SEO helpers (JSON-LD, meta)
│   └── valid-urls.ts                 # URL validation
├── hooks/
│   ├── use-cart.ts                   # Cart state management
│   ├── use-auth.ts                   # Auth state helpers
│   └── use-media-query.ts            # Responsive breakpoint hook
├── types/
│   └── index.ts                      # Client-side TypeScript types
│                                      # (manually mirrors server types —
│                                      # no shared package)
├── stores/
│   ├── cart-store.ts                 # Cart state + actions
│   └── wishlist-store.ts             # Wishlist state
├── public/images/
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Server — Express v5 Backend

```
server/
├── src/
│   ├── index.ts                      # Express app entry point
│   ├── routes/
│   │   ├── index.ts                  # Route aggregator (/api)
│   │   ├── auth.routes.ts            # Better Auth proxy endpoints
│   │   ├── product.routes.ts         # Product CRUD
│   │   ├── category.routes.ts        # Category listing
│   │   ├── variant.routes.ts         # Variant management
│   │   ├── cart.routes.ts            # Cart operations
│   │   ├── order.routes.ts           # Order lifecycle
│   │   ├── review.routes.ts          # Review submission/moderation
│   │   ├── customer.routes.ts        # Customer management
│   │   ├── inventory.routes.ts       # Inventory tracking
│   │   ├── blog.routes.ts            # Blog content
│   │   ├── story.routes.ts           # Story content
│   │   ├── coupon.routes.ts          # Coupon management
│   │   ├── analytics.routes.ts       # Dashboard analytics
│   │   ├── shipping.routes.ts        # Shipping config
│   │   ├── payment.routes.ts         # Payment processing (COD)
│   │   ├── cloudinary.routes.ts      # Signed upload params + media delete
│   │   └── admin.routes.ts           # Admin-only aggregate endpoints
│   ├── controllers/
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── blog.controller.ts
│   │   ├── story.controller.ts
│   │   ├── coupon.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── shipping.controller.ts
│   │   ├── payment.controller.ts
│   │   └── cloudinary.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts        # Session validation
│   │   ├── rbac.middleware.ts        # Role-based access control
│   │   ├── validate.middleware.ts    # Zod request validation
│   │   └── error.middleware.ts       # Global error handler
│   ├── services/
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── cart.service.ts
│   │   ├── inventory.service.ts
│   │   ├── cloudinary.service.ts     # Signature generation + destroy
│   │   └── payment.service.ts
│   ├── validators/
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   ├── cart.schema.ts
│   │   ├── auth.schema.ts
│   │   └── common.schema.ts
│   ├── db/
│   │   ├── index.ts                  # Drizzle client configuration
│   │   ├── migrations/               # Drizzle migration files
│   │   └── schema/                   # Modular Drizzle schema
│   │       ├── index.ts              # Barrel export for schemas
│   │       ├── relations.ts          # All relations definitions
│   │       └── *.ts                  # Domain specific schemas
│   ├── env.ts                        # @t3-oss/env-core validation
│   ├── drizzle.config.ts             # Drizzle Kit configuration
│   ├── auth/
│   │   └── index.ts                  # Better Auth instance setup
│   └── types/
│       └── index.ts                  # Server-side TypeScript types
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## System Boundaries

| Boundary | Rule |
|----------|------|
| `client/app/` | Pages, layouts, loading states, error boundaries. **No direct DB calls. No business logic.** Only `fetch()` to Express server. |
| `client/components/` | UI only. No direct data fetching. Receive data via props. Call hooks that wrap `fetch()`. |
| `client/lib/api-client.ts` | Centralized HTTP client (axios/fetch) pointing to Express server. Handles auth cookies automatically. |
| `client/proxy.ts` | Auth guards and RBAC checks. Redirects unauthenticated users. Blocks non-admin from `/admin`. |
| `client/types/` | Client-side TypeScript types. **Manually kept in sync with server types.** No automated sharing. |
| `server/routes/` | Express route definitions. Mount controllers. Apply middleware. |
| `server/controllers/` | HTTP request/response handling. Parse params. Call services. Return JSON. |
| `server/services/` | Business logic. Database transactions. Inventory rules. Cart calculations. Cloudinary operations. |
| `server/middleware/` | Cross-cutting concerns: auth validation, RBAC enforcement, Zod validation, error handling. |
| `server/db/` | Schema definitions, relations, migrations. Drizzle client setup only. |
| `server/validators/` | Zod schemas. API contract between client and server. |
| `server/types/` | Server-side TypeScript types. Independent from client types. |

---

## Data Flow

### Public Page (Server-Side Rendering)

```
User visits page
        ↓
Next.js Server Component
        ↓
proxy.ts — auth check (passes through for public pages)
        ↓
fetch() to Express API (SSR-safe, cookies forwarded)
        ↓
Express controller → Service → Drizzle ORM → PostgreSQL
        ↓
JSON response → Server Component renders HTML
        ↓
HTML streamed to browser
        ↓
Hydration → React takes over
```

### Client Interaction (Client-Side Fetching)

```
User action (add to cart, filter products)
        ↓
TanStack Query mutation / query hook
        ↓
client/lib/api-client.ts (axios/fetch wrapper)
        ↓
HTTP request → Express REST endpoint
        ↓
Express validate middleware (Zod)
        ↓
Controller → Service → Drizzle ORM → PostgreSQL
        ↓
JSON response returned
        ↓
TanStack Query cache update
        ↓
UI re-renders with new data
```

### Admin Mutation (Authenticated)

```
Admin form submission (e.g., update order status)
        ↓
TanStack mutation with auth cookie (httpOnly session)
        ↓
Express auth.middleware.ts — validate session
        ↓
Express rbac.middleware.ts — verify admin role
        ↓
validate.middleware.ts — Zod input validation
        ↓
Service layer → Drizzle transaction
        ↓
Inventory movement log written (if applicable)
        ↓
Success JSON response → UI toast
```

---

## Authentication & Route Protection

### Better Auth (Server-Side on Express)

Better Auth runs entirely on the Express server at `/api/auth/*`. The frontend never handles auth logic directly — it redirects to auth endpoints and receives httpOnly session cookies.

**Auth Endpoints (Express):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Email + password registration |
| POST | `/api/auth/sign-in/email` | Email + password login |
| POST | `/api/auth/sign-in/social` | Google OAuth initiation |
| POST | `/api/auth/sign-out` | Clear session |
| GET | `/api/auth/session` | Get current session (used by proxy.ts) |

**Session Management:**
- httpOnly, secure, sameSite=lax cookies
- Session stored in PostgreSQL via Better Auth
- Frontend reads auth state via `/api/auth/session` on page load

### proxy.ts — Route Protection (Next.js 16)

`proxy.ts` replaces `middleware.ts` in Next.js 16. It runs in the Node.js runtime and has full access to async operations, making it ideal for auth verification against the Express backend.

```typescript
// client/app/proxy.ts
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1. Always allow public assets and auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return NextResponse.next();
  }

  // 2. Protected routes. NOTE: /checkout is NOT protected — guest checkout
  //    is a supported flow (see project-overview.md). Only /profile, /wishlist,
  //    and /admin require auth.
  const isProtected =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/admin");

  if (!isProtected) {
    return NextResponse.next();
  }

  // 3. Optimistic auth check — read the session cookie only. Never fetch the
  //    session from Express here: Proxy runs on every route including
  //    prefetches, so a per-request DB/network lookup is a performance
  //    anti-pattern (see Next.js 16 auth guide). Express auth.middleware.ts
  //    remains the authoritative check.
  const sessionCookie = req.cookies.get("better-auth.session_token")?.value;
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 4. RBAC for /admin. Better Auth's session cookie is an opaque token, so
  //    the role cannot be read from it without a DB lookup. Set a separate
  //    signed "spiceey.role" cookie at login as an optimistic hint; Express
  //    rbac.middleware.ts still enforces authoritatively on every admin API
  //    call. (Decision to implement in task 02 — see open items.)
  if (pathname.startsWith("/admin")) {
    const role = req.cookies.get("spiceey.role")?.value;
    if (role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
}

// Run on all routes except static assets and images
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
```

**Protected Routes:**

| Route Pattern | Required Auth | Required Role |
|---------------|--------------|---------------|
| `/profile/*` | Authenticated | any |
| `/wishlist` | Authenticated | any |
| `/checkout` | Authenticated (or guest) | any |
| `/admin/*` | Authenticated | `admin` or `super_admin` |

**Guest Access (no auth required):**
- Browse products, search, filter
- View product details and reviews
- Add to cart (stored in localStorage + server session)
- Checkout as guest (order linked by phone number)

---

## API Design (REST)

### Base URL

```
Development: http://localhost:4000/api
Production:  https://api.spiceey.com/api
```

### Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 150 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [ ... ]
  }
}
```

### Endpoint Summary

| Resource | Endpoints | Auth |
|----------|-----------|------|
| Auth | `POST /api/auth/*` | varies |
| Products | `GET /api/products`, `GET /api/products/:slug`, `GET /api/products/featured`, `GET /api/products/best-sellers`, `POST /api/admin/products`, `PUT /api/admin/products/:id`, `PATCH /api/admin/products/:id/status` | public / admin |
| Categories | `GET /api/categories` | public |
| Variants | `GET /api/variants?productId=`, `PATCH /api/variants/:id` | admin for write |
| Cart | `GET /api/cart`, `POST /api/cart/items`, `DELETE /api/cart/items/:id`, `PUT /api/cart/items/:id` | session |
| Wishlist | `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:id` | auth |
| Orders | `POST /api/orders`, `GET /api/orders/my`, `GET /api/orders/:id`, `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status`, `PATCH /api/admin/orders/:id/tracking`, `POST /api/admin/orders/bulk-status` | auth / admin |
| Reviews | `GET /api/reviews?productId=`, `POST /api/reviews`, `PATCH /api/admin/reviews/:id/approve`, `PATCH /api/admin/reviews/:id/reject` | auth / admin |
| Customers | `GET /api/customers/me`, `PUT /api/customers/me`, `POST /api/customers/me/addresses`, `PUT /api/customers/me/addresses/:id`, `DELETE /api/customers/me/addresses/:id`, `PUT /api/customers/me/addresses/:id/default`, `PUT /api/customers/me/avatar` | auth |
| Blogs | `GET /api/blogs`, `GET /api/blogs/:slug`, `POST /api/admin/blogs`, `PUT /api/admin/blogs/:id` | public / admin |
| Stories | `GET /api/stories`, `GET /api/stories/:slug`, `POST /api/admin/stories`, `PUT /api/admin/stories/:id` | public / admin |
| Coupons | `GET /api/coupons/validate?code=`, `GET /api/admin/coupons`, `POST /api/admin/coupons`, `PUT /api/admin/coupons/:id`, `PATCH /api/admin/coupons/:id/toggle` | public / admin |
| Inventory | `GET /api/admin/inventory`, `GET /api/admin/inventory/low-stock`, `POST /api/admin/inventory/adjust`, `GET /api/admin/inventory/movements` | admin |
| Analytics | `GET /api/admin/analytics/dashboard`, `GET /api/admin/analytics/sales` | admin |
| Announcements | `GET /api/announcements/active`, `GET /api/admin/settings/announcements`, `POST /api/admin/settings/announcements`, `PATCH /api/admin/settings/announcements/:id/toggle` | public / admin |
| Shipping | `GET /api/shipping/config`, `GET /api/admin/settings/shipping`, `PUT /api/admin/settings/shipping/:zone` | public / admin |
| Cloudinary | `GET /api/cloudinary/signature`, `DELETE /api/cloudinary/destroy` | auth / admin |

---

## Database Schema

### Schema Conventions (Locked — apply verbatim in task 04)

These rules override the table sketches below. The Drizzle implementation in `server/src/db/schema/` (modular files, barrel-exported from `index.ts`) must follow them exactly.

- **Timestamps:** every `createdAt` / `updatedAt` / `publishedAt` / `expiresAt` uses `timestamp({ withTimezone: true })` (timestamptz). Plain `timestamp` is banned.
- **Primary keys:** `uuid("id").defaultRandom().primaryKey()` everywhere.
- **Money:** `integer` in whole BDT taka. No floats, no paise, never multiply by 100.
- **Referential integrity:** every FK declares an explicit `onDelete`:
  - `cascade` — productImages.productId, carts.userId, wishlists.userId/productId, orderItems.orderId, orderStatusHistory.orderId, userAvatars.userId
  - `set null` — orders.customerId (guests + deleted users), inventoryMovements.createdBy, orderStatusHistory.createdBy
  - `restrict` — reviews.productId/customerId, productVariants.productId (never silently delete reviewed/ordered data)
- **Unique constraints:** `products.slug`, `productVariants.sku`, `orders.orderNumber`, `coupons.code`, `blogs.slug`, `stories.slug`, `reviews(customerId, productId)` (partial: where `status != 'rejected'`), `wishlists(userId, productId)`, `carts(userId)` (partial: `user_id IS NOT NULL`), `carts(sessionId)` (partial: `session_id IS NOT NULL`), `shippingConfig.zone`.
- **Indexes:** every FK column (`productId`, `variantId`, `orderId`, `customerId`, `userId`, `createdBy`) gets an index, plus hot filters: `products(status)`, `products(category)`, `orders(status, createdAt)`, `reviews(productId, status)`, `blogs(status, publishedAt)`, `announcements(isActive, startAt, endAt)`.
- **Check constraints:** `price >= 0`, `discountPrice >= 0 AND discountPrice < price` (when set), `quantity >= 0`, `reservedQuantity >= 0`, `lowStockThreshold >= 0`, `reviews.rating BETWEEN 1 AND 5`, `orderItems.quantity > 0`.
- **Search:** `products.name` and `products.tags` get a `pg_trgm` GIN index (`gin_trgm_ops`) for shop search. No tsvector — no stemming needed at this scope.
- **Concurrency (service layer):** stock reservation and coupon usage use `SELECT ... FOR UPDATE` + a guarded atomic `UPDATE ... WHERE available >= qty` that aborts on 0 rows. A bare `+` increment is a race condition (see Order Lifecycle).
- **Soft-delete convention:** `archived` status on products/blogs = soft-deleted: hidden from customers, retained for order history and admin. `draft` = admin-visible only.
- **Users table is owned by Better Auth** (see Users section below). Never declare `users` columns manually.

### Products

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | Product display name |
| slug | text | URL-friendly identifier, unique |
| description | text | Full product description |
| shortDescription | text | Card preview text |
| category | enum | 'ground' / 'whole' / 'mix' / 'pickles' |
| tags | text[] | Array of searchable tags |
| seoTitle | text | Meta title |
| seoDescription | text | Meta description |
| ogImage | text | Open Graph image URL |
| isFeatured | boolean | Homepage featured section |
| isBestSeller | boolean | Homepage best sellers section |
| status | enum | 'published' / 'draft' / 'archived' |
| ingredients | text | List of ingredients |
| nutritionInfo | text | Nutritional information |
| howToUse | text | Usage instructions |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

### Product Images

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| productId | uuid | FK → products.id |
| url | text | Cloudinary secure_url |
| publicId | text | Cloudinary public_id (for deletion) |
| sortOrder | integer | Display order |
| createdAt | timestamp | Auto-generated |

### Product Variants

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| productId | uuid | FK → products.id |
| sku | text | Stock keeping unit, unique |
| weight | enum | '100g' / '250g' / '500g' |
| price | integer | Price in whole BDT taka (never floats, never paise) |
| discountPrice | integer | Discounted price in BDT (nullable) |
| quantity | integer | Current stock level |
| reservedQuantity | integer | Reserved in pending orders |
| lowStockThreshold | integer | Alert threshold (default: 10) |
| isAvailable | boolean | Customer-facing availability |
| status | enum | 'active' / 'out_of_stock' / 'discontinued' |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

### Inventory Movements

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| variantId | uuid | FK → productVariants.id |
| type | enum | 'addition' / 'deduction' / 'adjustment' / 'reservation' / 'release' |
| quantity | integer | Amount changed |
| reason | text | Human-readable reason |
| reference | text | Order ID or admin note |
| createdBy | uuid | FK → users.id (nullable for system) |
| createdAt | timestamp | Auto-generated |

### Categories (Enum-Derived)

Categories are implemented as PostgreSQL enums with metadata:

| Category | Description | Example Products |
|----------|-------------|-----------------|
| `ground` | Hand-ground spice powders | Ginger Powder, Cumin Powder, Chilli Powder |
| `whole` | Whole spices | Coriander Seeds, Cinnamon, Cardamom |
| `mix` | Spice blends and masalas | Biriyani Masala, Beef Masala, Chicken Masala |
| `pickles` | Homemade pickles | Mango Pickle, Tamarind Pickle, Jujube Pickle |

### Users (Owned by Better Auth)

Better Auth's `drizzleAdapter` creates and owns the schema for `user`, `session`, `account`, and `verification`. The full set lives in `server/src/db/schema/users.ts` (single auth file, barrel-exported from `index.ts`) and is regenerated via `@better-auth/cli generate` (see `context/library-docs.md` for the reconcile steps). All four tables are explicitly passed to the adapter via `drizzleAdapter(db, { schema: { user, session, account, verification } })`.

Custom fields are declared as `additionalFields` in the Better Auth config:

- `phone: { type: "string", required: false }` — Bangladesh phone, **no DB-level unique constraint** (handled in application-level Zod validation).
- `role: { type: "string", defaultValue: "customer", input: false }` — values: `'customer' / 'admin' / 'super_admin'`. `input: false` blocks users from setting their own role at signup; only the server can promote.

`name`, `email`, `emailVerified`, `createdAt`, `updatedAt` are Better Auth core — never redeclared. `additionalFields` only adds; it does not remove.

### Locked Better Auth configuration (`server/src/auth/index.ts`)

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { env } from "../env";
import * as schema from "../db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  // Google OAuth only registered if both env vars are set
  ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && {
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
  }),
  user: {
    additionalFields: {
      phone: { type: "string", required: false },
      role: { type: "string", defaultValue: "customer", input: false },
    },
  },
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  advanced: {
    database: { generateId: "uuid" },        // matches architecture's UUID convention
    useSecureCookies: env.NODE_ENV === "production",
  },
  trustedOrigins: [env.CLIENT_URL],          // explicit allowlist (more secure than disableOriginCheck)
  rateLimit: { enabled: true },
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
```

### Express type augmentation (`server/src/types/express.d.ts`)

`req.user` and `req.session` are typed globally so auth/RBAC middleware can populate them without `any` and controllers can read them without casts:

```ts
import type { User, Session } from "../auth/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      session?: Session;
    }
  }
}

export {};
```

Both fields are optional — set by `auth.middleware.ts` (task 04) only when a valid session exists. RBAC middleware asserts presence before checking `req.user.role`. Controllers null-check before reading (no `requireUser()` helper in V1 — keep it explicit).

### User Avatars

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| userId | uuid | FK → users.id |
| url | text | Cloudinary secure_url |
| publicId | text | Cloudinary public_id (for deletion on change) |
| updatedAt | timestamp | Auto-generated |

### Customers

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, FK → users.id |
| defaultAddress | jsonb | Canonical delivery address `{ district, upazila, area, addressLine, phone? }` — single source of truth |
| createdAt | timestamp with time zone | Auto-generated |
| updatedAt | timestamp with time zone | Auto-generated |

- No flat address columns (district/upazila/area/addressLine were dropped — they duplicated `defaultAddress`).
- No `totalOrders` / `totalSpent` counters — computed on demand from `orders` (`COUNT` / `SUM`). Correct at low volume, cannot drift.
- Admin customer-list filters read `defaultAddress->>'district'`; add an expression index only if that query becomes hot.

### Carts

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| userId | uuid | FK → users.id (nullable for guests) |
| sessionId | text | Anonymous session identifier |
| items | jsonb | Array of { variantId, quantity, addedAt } |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

- One cart per owner: `unique(userId)` (partial where `user_id IS NOT NULL`) and `unique(sessionId)` (partial where `session_id IS NOT NULL`).
- `items` has no FK integrity at the DB layer by design — validate on write in the service with Zod (`variantId: uuid, quantity: int().min(1).max(99)`), and on read join to variants to filter deleted/discontinued rows before display.

### Wishlists

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| userId | uuid | FK → users.id |
| productId | uuid | FK → products.id |
| createdAt | timestamp | Auto-generated |

- `unique(userId, productId)` — duplicate heart-taps insert nothing.

### Orders

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| orderNumber | text | Human-readable order ID (e.g., SPY-20260115-001), unique |
| customerId | uuid | FK → users.id (nullable for guests) |
| guestPhone | text | Phone number for guest checkout |
| guestName | text | Name for guest checkout |
| status | enum | See Order Lifecycle below |
| paymentMethod | enum | 'cod' (future: 'bkash' / 'nagad' / 'sslcommerz') |
| paymentStatus | enum | 'pending' / 'completed' / 'failed' / 'refunded' |
| subtotal | integer | Product total in BDT |
| discountAmount | integer | Applied discount in BDT |
| shippingCost | integer | Shipping in BDT |
| total | integer | Final amount in BDT |
| shippingAddress | jsonb | Full address snapshot |
| deliveryNote | text | Customer delivery instructions |
| trackingNumber | text | Courier tracking ID (nullable, manually entered) |
| trackingUrl | text | Tracking link (nullable, manually entered) |
| courierName | text | Courier company name (nullable, manually entered) |
| couponCode | text | Applied coupon (nullable) |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

- Indexes: `orderNumber` (unique), `customerId`, `status`, `createdAt`.
- `customerId` FK → `onDelete: set null` (guest orders keep `guestPhone` / `guestName` snapshots).
- Discount accounting: `orderItems.price` is the EFFECTIVE unit price (after product-level discount); `orders.discountAmount` is coupon-only. Never mix the two.

### Order Items

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| orderId | uuid | FK → orders.id |
| variantId | uuid | FK → productVariants.id |
| productName | text | Snapshot of product name |
| variantWeight | text | Snapshot of variant weight |
| sku | text | Snapshot of SKU |
| price | integer | Effective unit price at purchase (after product-level discount) |
| quantity | integer | Units ordered (check constraint: > 0) |
| total | integer | Line total |

- `orderId` FK → `onDelete: cascade`; `variantId` FK → `onDelete: restrict` (never delete a variant with order history).
- The name/weight/sku/price snapshots are the immutable contract for order history — product edits never rewrite past orders.

### Order Status History

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| orderId | uuid | FK → orders.id |
| status | enum | New status value |
| previousStatus | enum | Previous status value |
| note | text | Human-readable note |
| createdBy | uuid | FK → users.id (system for auto), onDelete set null |
| createdAt | timestamp | Auto-generated |

- `orderId` FK → `onDelete: cascade`; index on `orderId`.

### Reviews

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| productId | uuid | FK → products.id |
| customerId | uuid | FK → users.id |
| rating | integer | 1-5 stars (check constraint: BETWEEN 1 AND 5) |
| title | text | Review headline |
| comment | text | Review body |
| status | enum | 'pending' / 'approved' / 'rejected' |
| helpfulCount | integer | Useful votes |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

- `unique(customerId, productId)` — one review per customer per product (partial: only where `status != 'rejected'`, so a rejected review can be resubmitted).
- `helpfulCount` has no backing votes table — either add `helpfulVotes(reviewId, customerId)` with `unique(reviewId, customerId)`, or drop helpful votes from V1 (YAGNI; not in project-overview scope).

### Blogs

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| title | text | Blog post title |
| slug | text | URL-friendly identifier |
| excerpt | text | Preview text |
| content | text | Rich text content (HTML) |
| coverImageUrl | text | Featured image URL |
| coverImagePublicId | text | Cloudinary public_id (for deletion) |
| author | text | Author name |
| seoTitle | text | Meta title |
| seoDescription | text | Meta description |
| tags | text[] | Searchable tags |
| status | enum | 'published' / 'draft' / 'archived' |
| publishedAt | timestamp | Publication date |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

### Stories

Same schema as blogs with `type: 'story'` and additional fields:

| Column | Type | Notes |
|--------|------|-------|
| type | enum | 'story' (distinguishes from blog) |
| storyType | enum | 'sourcing' / 'preparation' / 'grinding' / 'packaging' / 'delivery' |
| gallery | jsonb[] | Array of `{ url, publicId }` objects |

### Coupons

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| code | text | Unique coupon code |
| type | enum | 'percentage' / 'fixed_amount' / 'free_shipping' |
| value | integer | Discount value |
| minOrderAmount | integer | Minimum order to apply |
| maxDiscount | integer | Cap on discount amount |
| usageLimit | integer | Total allowed uses |
| usageCount | integer | Current usage count |
| expiresAt | timestamp | Expiration date |
| isActive | boolean | Enable/disable |
| createdAt | timestamp | Auto-generated |

- `code` unique. `usageCount` increments atomically: `UPDATE coupons SET usage_count = usage_count + 1 WHERE code = :code AND usage_count < usage_limit` — abort when 0 rows affected.
- Per-customer limits (e.g., one per customer) require a `couponUsages(couponId, customerId, orderId, usedAt)` join table with `unique(couponId, customerId)` — deferred until a per-customer coupon ships (YAGNI for V1).

### Announcements

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| message | text | Announcement text |
| type | enum | 'info' / 'warning' / 'success' |
| isActive | boolean | Display status |
| startAt | timestamp | Show from |
| endAt | timestamp | Hide after |
| createdAt | timestamp | Auto-generated |
| updatedAt | timestamp | Auto-generated |

- Index: `isActive` + `startAt` / `endAt` for the "what's live right now" query.

### Shipping Config

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| zone | enum | 'inside_dhaka' / 'outside_dhaka' / 'remote_area' (unique — one config per zone) |
| baseCost | integer | Base shipping fee |
| freeShippingThreshold | integer | Free shipping above this amount |
| isActive | boolean | Enable/disable |
| updatedAt | timestamp | Auto-generated |

---

## Order Lifecycle

Orders flow through the following statuses. Each transition is recorded in `orderStatusHistory`. **All status updates are performed manually by the admin.** There are no courier API integrations or automatic webhook updates.

```
Pending → Confirmed → Packing → Ready For Courier → Shipped → Delivered
   ↓          ↓           ↓              ↓               ↓
Cancelled  Cancelled   Cancelled    Cancelled     Returned
```

| Status | Description | Actor | Inventory Effect |
|--------|-------------|-------|-----------------|
| `pending` | Order placed, awaiting confirmation | System | Reserve stock |
| `confirmed` | Order verified by admin | Admin | Keep reserved |
| `packing` | Items being picked and packed | Admin | Keep reserved |
| `ready_for_courier` | Package ready for pickup | Admin | Keep reserved |
| `shipped` | Handed to courier, in transit | Admin (manual update) | Deduct stock |
| `delivered` | Customer received the order | Admin (manual confirmation) | Stock already deducted |
| `cancelled` | Order cancelled | Admin/Customer | Release reservation |
| `returned` | Customer returned items | Admin | Add stock back |

### Manual Courier Process (Admin)

> **Courier operations are entirely manual and handled by the admin at the courier office.** The platform does NOT integrate with any courier API (Pathao, Steadfast, Sundarban, etc.). Webhooks are NOT in scope.

1. Admin receives order notification
2. Admin confirms order in dashboard (`pending` → `confirmed`)
3. Admin packs items and prints shipping label from dashboard
4. Admin takes package to courier office, arranges delivery manually
5. Admin receives tracking number from courier office
6. Admin enters tracking number manually in order detail page
7. Admin updates order status to `shipped`
8. Admin confirms delivery when customer receives (`shipped` → `delivered`)

**Reservation Pattern:** When an order reaches `pending`, the system reserves inventory by incrementing `reservedQuantity` on the variant. Stock is only deducted (and reservation released) when the admin marks the order as `shipped`. If cancelled at any point before shipping, the reservation is released.

**Concurrency (mandatory):** reservation and deduction must be race-safe. Inside the order transaction: `SELECT ... FOR UPDATE` the variant row, then `UPDATE product_variants SET reserved_quantity = reserved_quantity + :qty WHERE id = :id AND (quantity - reserved_quantity) >= :qty`. If the update returns 0 rows, abort with "out of stock". Same guard on ship (deduct) and cancel (release). A bare `reservedQuantity + quantity` increment without the availability guard lets two concurrent checkouts oversell the last unit. Locked pattern in `code-standards.md` / `library-docs.md` — task 04 ships it.

---

## Cart & Wishlist Architecture

### Guest Cart

Guest carts use a dual-storage strategy for persistence across sessions:

```
Browser (localStorage)
    ↓ sync ↓
Server (PostgreSQL via sessionId cookie)
```

1. On first visit, the server sets an `anonymousSessionId` HTTP-only cookie
2. Cart mutations write to both localStorage (immediate feedback) and server (persistence)
3. On page load, client hydrates from localStorage while server state loads in background
4. On login/registration, server merges guest cart with user cart (quantity summed, duplicates handled)

### Wishlist

Wishlist requires authentication. Stored server-side only. Accessible from:
- Product card (heart icon toggle)
- Product detail page
- Account profile section

---

## Payment Architecture

### V1: Cash On Delivery (COD)

COD is the sole payment method in Version 1. Implementation:
- Order status remains `pending` until admin confirms
- No online payment integration needed
- Shipping label printed with COD amount
- Admin marks payment as `completed` upon delivery confirmation

### Future: Digital Payments

The Express server architecture supports adding payment gateways without redesign. Each gateway is implemented as an Express route handler with a standardized interface:

```typescript
// Payment provider interface (server-side)
interface PaymentProvider {
  name: string;
  initialize: (config: ProviderConfig) => Promise<void>;
  createPayment: (order: Order) => Promise<PaymentIntent>;
  verifyPayment: (payload: unknown) => Promise<PaymentResult>;
  refundPayment?: (transactionId: string, amount: number) => Promise<RefundResult>;
}
```

**Planned gateways (future):** bKash Tokenized Checkout, Nagad Merchant API, SSLCommerz Aggregator. Each will be a separate Express route file under `server/src/routes/payments/`.

---

## Media Management (Cloudinary)

### Signed Upload Architecture

All media uploads use **Cloudinary signed uploads** for security. The API secret never leaves the server.

```
Client requests upload
        ↓
GET /api/cloudinary/signature → Server generates signature
        ↓
Client receives: signature, timestamp, apiKey, cloudName, folder
        ↓
Client POSTs file + signature params to Cloudinary (direct from browser)
        ↓
Cloudinary validates signature, stores file, returns secure_url + public_id
        ↓
Client sends secure_url + public_id to Express to save in database
```

### Deleting Media

When media is replaced or deleted, the server uses the stored `public_id` to delete from Cloudinary:

```
User replaces profile photo
        ↓
Server uploads new photo via signed upload flow
        ↓
Server calls cloudinary.uploader.destroy(oldPublicId) to delete old
        ↓
Server updates DB with new url + public_id
```

### Image Storage Rules

| Entity | Stored Fields | Folder |
|--------|--------------|--------|
| Product images | `url`, `publicId` | `spiceey/products/` |
| Blog cover image | `coverImageUrl`, `coverImagePublicId` | `spiceey/blogs/` |
| Story gallery | `{ url, publicId }[]` | `spiceey/stories/` |
| User avatar | `url`, `publicId` | `spiceey/avatars/` |

---

## Shipping Architecture

### Shipping Zones

| Zone | Coverage | Base Cost | Free Shipping Threshold |
|------|----------|-----------|------------------------|
| Inside Dhaka | Dhaka city metro | ৳60 | ৳500 |
| Outside Dhaka | Major cities (Chittagong, Sylhet, Rajshahi, etc.) | ৳120 | ৳800 |
| Remote Area | Islands, hill tracts, border regions | ৳200 | ৳1,200 |

### Out of Scope: Courier API Integrations

> **Courier API integrations, webhook endpoints, and automated shipping status updates are explicitly out of scope.** The admin handles all courier interactions manually at the courier office.

The following are **NOT included** in this architecture:
- Pathao API integration (create order, track shipment, webhooks)
- Steadfast API integration (place order, bulk create, status check, webhooks)
- Sundarban API integration
- Any webhook endpoints for courier status callbacks
- Automatic tracking updates
- Real-time delivery notifications from couriers

What the admin dashboard **does** provide:
- Manual tracking number entry field
- Manual courier name entry
- Manual tracking URL entry
- Manual status updates via dropdown
- Printable shipping labels
- Order status history log

---

## Review Moderation Architecture

### Review Submission Flow

```
Customer writes a review
        ↓
POST /api/reviews → creates review with status: 'pending'
        ↓
Customer sees their own review on product page (muted/gray styling)
        ↓
Other users do NOT see this review
        ↓
Admin sees pending review in /admin/reviews dashboard
        ↓
Admin approves → status: 'approved' → visible to all users
Admin rejects → status: 'rejected' → hidden from customer too
```

### Review Visibility Rules

| Viewer | Pending Reviews | Approved Reviews | Rejected Reviews |
|--------|----------------|-----------------|------------------|
| Review author (owner) | Visible (muted styling) | Visible (normal) | Hidden |
| Other customers | Hidden | Visible (normal) | Hidden |
| Admin | Visible (all tabs) | Visible | Visible |

### Review Status Transition

```
Customer submits
        ↓
    [PENDING] ──admin approves──► [APPROVED]
          │
          └────admin rejects────► [REJECTED]
```

---

## SEO Architecture

### Metadata Management

Every public page exports a `generateMetadata` function:

```typescript
// Dynamic metadata for product pages
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetch(`${API_URL}/products/${params.slug}`)
    .then(r => r.json());

  return {
    title: product.data.seoTitle || product.data.name,
    description: product.data.seoDescription || product.data.shortDescription,
    openGraph: {
      images: [product.data.ogImage || product.data.images[0]],
      title: product.data.name,
      description: product.data.shortDescription,
    },
    alternates: {
      canonical: `/shop/${product.data.slug}`,
    },
  };
}
```

### Automatic Sitemap

```typescript
// client/app/sitemap.ts — Next.js convention
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs, stories] = await Promise.all([
    fetch(`${API_URL}/products`).then(r => r.json()),
    fetch(`${API_URL}/blogs`).then(r => r.json()),
    fetch(`${API_URL}/stories`).then(r => r.json()),
  ]);

  return [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/shop`, priority: 0.9 },
    ...products.data.map(p => ({ url: `${baseUrl}/shop/${p.slug}`, priority: 0.8 })),
    ...blogs.data.map(b => ({ url: `${baseUrl}/blog/${b.slug}`, priority: 0.7 })),
    ...stories.data.map(s => ({ url: `${baseUrl}/stories/${s.slug}`, priority: 0.7 })),
  ];
}
```

### Structured Data (JSON-LD)

**Product Schema:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Cumin Powder",
  "image": ["https://spiceey.com/products/cumin-500g.jpg"],
  "description": "Hand-ground fresh cumin powder",
  "brand": { "@type": "Brand", "name": "Spiceey" },
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "120.00",
    "highPrice": "450.00",
    "priceCurrency": "BDT",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  }
}
```

---

## Inventory Management

### Stock Tracking Model

Each variant maintains two quantity fields:
- `quantity` — physical stock on hand
- `reservedQuantity` — stock reserved for pending orders

**Available to sell** = `quantity` - `reservedQuantity`

### Low Stock Monitoring

```sql
-- Low stock alert query
SELECT 
  v.sku,
  p.name,
  v.weight,
  v.quantity,
  v.reservedQuantity,
  (v.quantity - v.reservedQuantity) as available
FROM productVariants v
JOIN products p ON v.productId = p.id
WHERE v.isAvailable = true
  AND (v.quantity - v.reservedQuantity) <= v.lowStockThreshold
ORDER BY available ASC;
```

### Inventory Adjustment Flow

```
Admin initiates adjustment
        ↓
Specify variant, quantity change, reason
        ↓
Drizzle transaction:
  1. Update variant.quantity
  2. Insert inventoryMovements record
        ↓
Audit trail complete
```

### Inventory Movement Types

| Type | Effect on Stock | When Used |
|------|----------------|-----------|
| `addition` | +quantity | Stock received, returned items |
| `deduction` | -quantity | Damaged goods, shrinkage |
| `adjustment` | Set to exact quantity | Count corrections |
| `reservation` | Reserve (reservedQuantity +) | Order placed |
| `release` | Release reservation | Order cancelled |

---

## Type Strategy (Client / Server Independence)

**No shared package.** Each codebase maintains its own types. Changes to server types require manual sync to client types.

### Server Types (`server/src/types/`)

- Database entity types (inferred from Drizzle schema via `$inferSelect`)
- Service return types
- Internal DTOs not exposed to the client

### Client Types (`client/types/`)

- API response types (mirror the server's JSON responses)
- Form data types
- Component prop types
- Zustand state shapes

### Manual Sync Points

When the server schema changes, update these client types:
- `client/types/index.ts` — API response shapes
- Component props that receive API data
- Form validation schemas (Zod) used client-side

---

## Deployment

### Docker Architecture

We use a modular Docker setup to separate local development concerns from production deployment:

**Local Development (`server/docker-compose.yml`)**
- Provides only the `db` (PostgreSQL 17) service.
- Developers run `docker compose up -d` in `/server` to spin up the database, then run the client and server locally via `pnpm run dev`.

**Central / Production (`/docker-compose.yml`)**
- Orchestrates the full stack: `db` → `server` → `client`.
- **Client (`client/Dockerfile`)**: Multi-stage build pulling the optimized `.next/standalone` output.
- **Server (`server/Dockerfile`)**: Multi-stage build using `ghcr.io/pnpm/pnpm:11` as the base image. Leverages `pnpm fetch` for optimal layer caching of dependencies. The final stage executes `node dist/index.js` directly (avoiding the `pnpm` wrapper) to ensure proper `SIGTERM` handling and minimal footprint.

### Environment Variables

All configuration is environment-driven. See `.env.example` for the complete list. Key variables include:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Auth encryption key |
| `BETTER_AUTH_URL` | Auth base URL |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_UPLOAD_FOLDER` | Default upload folder prefix |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `CLIENT_URL` | Next.js app URL (CORS) |
| `SERVER_URL` | Express server URL |
