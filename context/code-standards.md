# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against architecture.md and project-overview.md
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap operations in try/catch, log failures, never let one failure crash everything

---

## TypeScript

- Strict mode enabled in tsconfig.json on both client and server — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for extendable component props
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary
- Client types in `client/types/index.ts` manually mirror server types — no shared package

---

## Client — Next.js 16 Conventions

- App Router only — no Pages Router
- React 19 — use React 19 APIs throughout
- All components are Server Components by default
- Only add `"use client"` when the component requires:
  - useState or useReducer
  - useEffect
  - Browser APIs
  - Event listeners
  - Third-party client-only libraries (Zustand, Tiptap, recharts, TanStack Query)
- Never add `"use client"` to layout files unless absolutely required
- Data fetching happens in Server Components — never fetch in Client Components directly
- Client Components call hooks that wrap `fetch()` — never fetch directly in JSX
- Caching is uncached by default — all dynamic code runs at request time
- Always read Next.js documentation before implementing any Next.js specific feature
- All Motion (animation) components must be Client Components with `"use client"`
- Only animate `transform` and `opacity` — never `width`, `height`, `top`, `left`
- Never use `useState` for continuous animation values (scroll, drag, hover) — use `useMotionValue`
- Always check `useReducedMotion()` on any component with animations
- Import animation constants from `@/lib/motion` — never hardcode easing or duration values

---

## Server — Express v5 Conventions

- All route handlers can be async — Express v5 catches promise rejections automatically
- No `try/catch` wrapper boilerplate needed in route definitions — use it in controllers
- Controllers handle HTTP request/response logic only — delegate to services for business logic
- Services contain all business logic, database transactions, and external API calls
- Middleware is applied at the route level, not globally unless truly universal
- Always return `{ success: boolean, data?: T, error?: { code, message, details } }` from all endpoints
- Never expose internal error details to the client — log internals, return generics

---

## File and Folder Naming

- Folders: kebab-case — `product-detail`, `admin-dashboard`
- Component files: PascalCase — `ProductCard.tsx`, `OrderTimeline.tsx`
- Utility files: camelCase — `api-client.ts`, `cloudinary-client.ts`
- Type files: camelCase — `index.ts`
- Route files: kebab-case matching the URL — `auth.routes.ts`
- Controller files: kebab-case — `product.controller.ts`
- Service files: kebab-case — `product.service.ts`
- One component per file — never export multiple components from one file
- Index files only in `components/ui/` — never barrel export from other folders

---

## Component Structure

Every component follows this exact order:

```typescript
"use client"; // only if needed

// 1. External imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Internal imports
import { ProductCard } from "@/components/shop/ProductCard";

// 3. Type definitions
type Props = {
  productId: string;
  variantId: string;
};

// 4. Component
export function ComponentName({ productId, variantId }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via Tailwind classes

---

## Express Controller Pattern

```typescript
// server/src/controllers/product.controller.ts
import { Request, Response } from "express";
import { productService } from "../services/product.service";

export async function getProducts(req: Request, res: Response) {
  try {
    const { search, category, sort, page, limit } = req.query;
    const result = await productService.list({
      search: search as string,
      category: category as string,
      sort: sort as string,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });
    res.json({ success: true, data: result.products, meta: result.meta });
  } catch (error) {
    console.error("[products/list]", error);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch products" },
    });
  }
}
```

- Every controller has a try/catch
- Errors are logged with the route path as prefix: `[products/list]`
- Always return `{ success, data, meta? }` on success
- Always return `{ success: false, error: { code, message } }` on failure
- Parse and validate query params before passing to services

---

## Service Pattern

```typescript
// server/src/services/product.service.ts
import { db } from "../db";
import { products } from "../db/schema";
import { eq, ilike } from "drizzle-orm";

export const productService = {
  async list(filters: ProductFilters) {
    const where = [];
    if (filters.search) {
      where.push(ilike(products.name, `%${filters.search}%`));
    }
    if (filters.category) {
      where.push(eq(products.category, filters.category));
    }

    const result = await db.query.products.findMany({
      where: and(...where),
      with: { variants: true, images: true },
      limit: filters.limit,
      offset: (filters.page - 1) * filters.limit,
    });

    return { products: result, meta: { page: filters.page, limit: filters.limit } };
  },
};
```

- Services are plain objects with async methods
- Services handle all database queries and business logic
- Services return plain data — never `res.json()`
- Wrap multi-step operations in Drizzle transactions

---

## API Client (Browser)

```typescript
// client/lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Request failed");
  }

  return data;
}
```

- Always use `apiClient` — never raw `fetch()` in components or hooks
- Always include `credentials: "include"` — auth won't work without it
- Handle the `{ success, data, error }` shape from Express responses

---

## Cloudinary Upload Pattern (Client)

```typescript
// Always use signed uploads
async function uploadImage(file: File, folder: string) {
  // 1. Get signature from server
  const sigRes = await apiClient(`/cloudinary/signature?folder=${folder}`);
  const sig = sigRes.data;

  // 2. Upload to Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );
  const result = await uploadRes.json();

  // 3. Return both url and publicId
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
```

**Rules:**

- Never use unsigned Cloudinary uploads — always signed
- Store both `url` and `publicId` from the Cloudinary response
- Pass both `url` and `publicId` to the server for database storage
- Server deletes old images via `cloudinary.uploader.destroy(oldPublicId)` on replacement

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[component/function name]`
- User-facing errors must be human readable — never expose raw error messages
- API errors return `status: 500` with generic message — never expose internals
- Client: show toast/alert with user-friendly message, log detailed error to console
- Server: log full error with stack trace, return generic message to client

---

## Review Moderation Rules

All reviews are created with `status: 'pending'` by default.

| Status | Visible To | Styling |
|--------|-----------|---------|
| `pending` | Review author only (isOwner) | Muted/gray text, "Pending approval" badge |
| `approved` | Everyone | Normal styling |
| `rejected` | No one (hidden from author too) | — |

**Frontend rules:**

- Product page fetches all reviews the current user can see
- For authenticated users, include their own pending reviews in the response
- Each review has an `isOwner` flag — use this to determine visibility
- Pending reviews for the owner show a muted style (gray-400 text, lighter background)
- Approved reviews show normal styling for all viewers

**Backend rules:**

- `GET /api/reviews?productId=` returns approved reviews for everyone
- If the request is authenticated, also include the user's own pending reviews
- `POST /api/reviews` always creates with `status: 'pending'`
- Admin `PATCH /api/admin/reviews/:id/approve` sets `status: 'approved'`
- Admin `PATCH /api/admin/reviews/:id/reject` sets `status: 'rejected'`

---

## Environment Variables

All environment variables defined in `.env.example`. Never hardcode any key, URL, or secret anywhere in the codebase.

**Server Environment:** In the backend, environment variables are managed and strictly validated using `@t3-oss/env-core` in `server/src/env.ts`. **Never use `process.env` directly in server files.** Always import the validated `env` object from `src/env.ts`.

| Variable | Used In | Is Secret |
|----------|---------|-----------|
| `DATABASE_URL` | server/db/index.ts | Yes |
| `BETTER_AUTH_SECRET` | server/auth/index.ts | Yes |
| `BETTER_AUTH_URL` | server/auth/index.ts | No |
| `CLOUDINARY_CLOUD_NAME` | server/services/cloudinary.service.ts | No |
| `CLOUDINARY_API_KEY` | server/services/cloudinary.service.ts | No |
| `CLOUDINARY_API_SECRET` | server/services/cloudinary.service.ts | Yes |
| `CLOUDINARY_UPLOAD_FOLDER` | server/services/cloudinary.service.ts | No |
| `GOOGLE_CLIENT_ID` | server/auth/index.ts | No |
| `GOOGLE_CLIENT_SECRET` | server/auth/index.ts | Yes |
| `NEXT_PUBLIC_SERVER_URL` | client/lib/api-client.ts | No |
| `SERVER_URL` | server/index.ts | No |
| `CLIENT_URL` | server/index.ts (CORS) | No |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never add `NEXT_PUBLIC_` to secret keys.

---

## Import Aliases

Always use the `@/` alias for all internal imports — never use relative imports. The `@/` alias points directly to the `src/` directory.

```typescript
// Correct
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { useCartStore } from "@/stores/cart-store";
import { db } from "@/db";

// Never
import { Button } from "../../../components/ui/button";
import { db } from "../db/index.js";
```

The project uses `tsc-alias` during the build step to rewrite these aliases into Node.js-compatible relative imports with `.js` extensions. You do **not** need to include `.js` extensions when writing your code.

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Complex business logic may have a brief comment explaining the rule
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does shadcn/ui already have this component?
2. Does Next.js already provide this functionality?
3. Is there a simpler native solution?

**Approved dependencies for this project:**

| Package | Purpose |
|---------|---------|
| `next` | Next.js 16 framework |
| `react` / `react-dom` | React 19 |
| `typescript` | Type safety |
| `tailwindcss` | Styling |
| `shadcn/ui` | UI primitives (via CLI) |
| `zustand` | Client state management |
| `@tanstack/react-query` | Server state synchronization |
| `better-auth` | Authentication (runs directly on Express via `auth.handler` — no adapter package needed) |
| `drizzle-orm` / `pg` | Database ORM + PostgreSQL driver |
| `zod` | Schema validation |
| `cloudinary` | Media upload + management (signed uploads) |
| `@tiptap/react` / `@tiptap/starter-kit` | Rich text editor |
| `recharts` | Admin dashboard charts |
| `motion` | Animation library (Framer Motion) |
| `lucide-react` | Icons |
| `axios` (optional) | HTTP client alternative to fetch |

Do not install any other packages without updating this list first.

---

## Mobile-First CSS

All styling is mobile-first:

```typescript
// Mobile-first: base styles apply to mobile, then scale up
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
```

- Default (no prefix): mobile layout
- `sm:`: 640px+
- `md:`: 768px+
- `lg:`: 1024px+
- `xl:`: 1280px+

Every page must be fully usable at 320px width (smallest common mobile width in Bangladesh).
