# Library Docs

Project-specific usage patterns for every third-party library in this project. This file only covers how we use each library in this specific project — rules, patterns, and constraints specific to Spiceey.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third-party library:

1. **Check AGENTS.md** at the project root — it lists every skill installed for this project and how to use them. Skills contain up-to-date API documentation, usage patterns, and best practices specific to this codebase.

2. **Check if an MCP server is configured** for that library. Some tools have MCP servers that give the AI agent direct access to documentation, logs, and debugging tools. If an MCP server is available — use it before falling back to general knowledge.

3. **Read this file** for project-specific patterns that override general library knowledge.

The order of authority is:

```
MCP server (real-time docs) → Skills via AGENTS.md → This file (project rules) → General training knowledge
```

Never rely on general training knowledge alone for library APIs — they change frequently and training data may be outdated.

---

## Cloudinary (Signed Uploads)

**Check first:** Check AGENTS.md for an installed Cloudinary skill. If a Cloudinary MCP server is configured — use it.

### Server-Side Signature Generation

```typescript
// server/src/services/cloudinary.service.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function generateUploadSignature(folder: string) {
  const timestamp = Math.floor(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp,
    folder: `${process.env.CLOUDINARY_UPLOAD_FOLDER}/${folder}`,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    timestamp,
    folder: paramsToSign.folder,
  };
}

export async function destroyAsset(publicId: string) {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
}
```

### Client-Side Upload Flow

```typescript
// client/lib/cloudinary-client.ts
export async function uploadToCloudinary(
  file: File,
  signatureData: {
    signature: string;
    apiKey: string;
    cloudName: string;
    timestamp: number;
    folder: string;
  }
): Promise<{ url: string; publicId: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signatureData.apiKey);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Upload failed");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}
```

### Using in a Component

```typescript
// Example: profile photo upload
async function handleImageUpload(file: File) {
  // 1. Get signature from server
  const sigRes = await fetch("/api/cloudinary/signature?folder=avatars");
  const signatureData = await sigRes.json();

  // 2. Upload directly to Cloudinary
  const { url, publicId } = await uploadToCloudinary(file, signatureData.data);

  // 3. Save to server
  await fetch("/api/customers/me/avatar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, publicId }),
  });
}
```

### Server Route for Signature

```typescript
// server/src/routes/cloudinary.routes.ts
import { Router } from "express";
import { generateUploadSignature } from "../services/cloudinary.service";

const router = Router();

router.get("/signature", (req, res) => {
  const folder = req.query.folder as string;
  const signature = generateUploadSignature(folder);
  res.json({ success: true, data: signature });
});

router.delete("/destroy/:publicId", async (req, res) => {
  const result = await destroyAsset(req.params.publicId);
  res.json({ success: true, data: result });
});
```

**Rules:**

- Always use signed uploads — never use unsigned (preset-based) uploads
- Store both `url` (secure_url) and `publicId` in the database for every image
- Always call `cloudinary.uploader.destroy(oldPublicId)` before replacing an image
- Folder structure: `spiceey/products/`, `spiceey/blogs/`, `spiceey/stories/`, `spiceey/avatars/`
- Signature is valid for 1 hour (Cloudinary default)
- The API secret never leaves the server
- On product delete: iterate all product images and destroy each via publicId
- On story gallery image removal: destroy the specific publicId

---

## Better Auth (Express)

**Check first:** Check AGENTS.md for an installed Better Auth skill. If a Better Auth MCP server is configured — use it.

### Server Setup

```typescript
// server/src/auth/index.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== "production",
  },
});
```

### Express Mount

```typescript
// server/src/index.ts
import { auth } from "./auth";

// Mount BEFORE express.json()
app.all("/api/auth/*", (req, res) => auth.handler(req, res));

// Then body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Critical:** Better Auth must be mounted before `express.json()`. Better Auth needs access to the raw request stream. If `express.json()` runs first, auth routes will hang forever.

### Client Setup

```typescript
// client/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

// Usage in components:
// const { data: session } = authClient.useSession();
// const { signIn, signUp, signOut } = authClient;
```

### Getting Session (Server-Side)

```typescript
// In any Express controller
const session = await auth.api.getSession({
  headers: req.headers,
});

if (!session) {
  return res.status(401).json({ success: false, error: "Unauthorized" });
}

// session.user has: id, email, name, role, etc.
```

### Auth Middleware

```typescript
// server/src/middleware/auth.middleware.ts
import { auth } from "../auth";

export async function authMiddleware(req, res, next) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session) {
      req.user = session.user;
    }
    next();
  } catch (error) {
    next(error);
  }
}
```

### RBAC Middleware

```typescript
// server/src/middleware/rbac.middleware.ts
export function requireRole(roles: string[]) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }
    next();
  };
}

// Usage:
// router.get("/admin/orders", authMiddleware, requireRole(["admin", "super_admin"]), getOrders);
```

**Rules:**

- Better Auth runs entirely on Express — the frontend never handles tokens directly
- Mount auth handler before `express.json()` — order is critical
- Use `disableOriginCheck` in development only (Postman/curl testing)
- Session cookie is httpOnly, secure, sameSite=lax
- Custom fields (`phone`, `role`: 'customer' / 'admin' / 'super_admin') are declared as `additionalFields` in the Better Auth config — the adapter owns the user table. Never declare a hand-rolled `users` table.
- Always use `auth.api.getSession({ headers: req.headers })` to validate sessions server-side
- The auth client on the frontend uses React hooks — only in Client Components

---

## Drizzle ORM

**Check first:** Check AGENTS.md for an installed Drizzle skill. If a Drizzle MCP server is configured — use it.

### Client Setup

```typescript
// server/src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

### Schema Definition

```typescript
// server/src/db/schema.ts
// The users table is OWNED by Better Auth's drizzleAdapter — never declare it here.
// Custom fields are declared as additionalFields in the Better Auth config:
//   additionalFields: {
//     phone: { type: "string", required: false },
//     role: { type: "string", defaultValue: "customer" }, // 'customer' | 'admin' | 'super_admin'
//   }
import { pgTable, uuid, text, integer, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// (products table defined above — omitted for brevity)

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  price: integer("price").notNull(), // whole BDT taka — never floats, never paise
  quantity: integer("quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex("variants_product_idx").on(t.productId),
  check("chk_quantity", sql`${t.quantity} >= 0`),
  check("chk_reserved", sql`${t.reservedQuantity} >= 0`),
]);
```

### Query Patterns

```typescript
// Select with relations
const products = await db.query.products.findMany({
  with: {
    variants: true,
    images: true,
  },
  where: eq(products.category, "ground"),
});

// Insert
const newProduct = await db.insert(products).values({
  name: "Cumin Powder",
  slug: "cumin-powder",
  category: "ground",
}).returning();

// Update
await db.update(products)
  .set({ status: "published" })
  .where(eq(products.id, productId));

// Transaction — race-safe stock reservation (mandatory pattern).
// Never reserve with a bare `+` increment: two concurrent checkouts could
// both pass, overselling the last unit. Lock the row, then guard the update.
// (imports: eq, and, sql from "drizzle-orm")
await db.transaction(async (tx) => {
  await tx.insert(orders).values({ ...orderData });
  await tx.insert(orderItems).values([...items]);

  for (const item of items) {
    const [variant] = await tx
      .select()
      .from(productVariants)
      .where(eq(productVariants.id, item.variantId))
      .for("update"); // SELECT ... FOR UPDATE — row lock against concurrent checkouts

    if (!variant || variant.quantity - variant.reservedQuantity < item.quantity) {
      throw new Error("OUT_OF_STOCK");
    }

    const updated = await tx.update(productVariants)
      .set({ reservedQuantity: sql`${productVariants.reservedQuantity} + ${item.quantity}` })
      .where(and(
        eq(productVariants.id, item.variantId),
        sql`${productVariants.quantity} - ${productVariants.reservedQuantity} >= ${item.quantity}`,
      ));

    if (!updated.rowCount) throw new Error("OUT_OF_STOCK");
  }
});
```

### Type Inference

```typescript
// server/src/types/index.ts
import { products, productVariants } from "../db/schema";

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
```

**Rules:**

- Always pass `{ schema }` to the drizzle client for relational queries
- Use `.returning()` after inserts to get the created record
- Wrap multi-table operations in transactions
- Use `$inferSelect` and `$inferInsert` for type inference — no manual type duplication
- Drizzle relations are defined separately from schema (in `relations.ts`) — they don't generate SQL
- Always use `uuid("id").defaultRandom().primaryKey()` for PostgreSQL UUID primary keys
- Use `timestamp("col", { withTimezone: true })` for every timestamp — plain `timestamp` is banned (timestamptz)
- Every `.references()` declares an explicit `onDelete` (`cascade` / `set null` / `restrict`) — never leave it implicit
- Enforce domain rules at the DB layer with `check(...)` (price >= 0, quantity >= 0, rating 1-5) and `uniqueIndex(...)` (slugs, order numbers, coupon codes, composite user+product keys)
- Stock reservation and coupon usage are race-sensitive: `SELECT ... FOR UPDATE` (`select().for("update")`) + guarded atomic UPDATE; abort on 0 affected rows (see Transaction pattern above)

---

## Zod 4

**Check first:** Check AGENTS.md for an installed Zod skill.

### Schema Definition

```typescript
// server/src/validators/product.schema.ts
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  category: z.enum(["ground", "whole", "mix", "pickles"]),
  description: z.string().optional(),
  price: z.number().int().positive(),
  status: z.enum(["published", "draft", "archived"]).default("draft"),
  tags: z.array(z.string()).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
```

### Validation Middleware

```typescript
// server/src/middleware/validate.middleware.ts
import { z } from "zod";

export function validate(schema: z.ZodSchema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details: error.errors,
          },
        });
      }
      next(error);
    }
  };
}

// Usage:
// router.post("/products", validate(createProductSchema), createProduct);
```

### Format Helpers (Zod 4)

```typescript
// Zod 4 built-in format helpers
const email = z.email();        // validates email format
const url = z.url();            // validates URL format
const uuid = z.uuid();          // validates UUID format

// In schemas:
const userSchema = z.object({
  email: z.email(),
  website: z.url().optional(),
});
```

**Rules:**

- Zod 4 is 14x faster than v3 — use format helpers (`z.email()`, `z.url()`, `z.uuid()`) instead of regex patterns
- Always export the inferred TypeScript type alongside the schema
- Validation middleware goes in `server/src/middleware/validate.middleware.ts`
- Return `{ success: false, error: { code, message, details } }` on validation failure
- Client-side forms also use Zod — duplicate the schema in client validation hooks

---

## TanStack Query (React Query)

**Check first:** Check AGENTS.md for an installed TanStack Query skill.

### Provider Setup

```typescript
// client/app/layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      retry: 1,
    },
  },
});
```

### Query Hook Pattern

```typescript
// client/hooks/use-products.ts
import { useQuery } from "@tanstack/react-query";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`${API_URL}/products?${params}`);
      return res.json();
    },
  });
}
```

### Mutation Pattern

```typescript
// client/hooks/use-cart.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, quantity }: AddToCartInput) => {
      const res = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ variantId, quantity }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
```

**Rules:**

- Always include `credentials: "include"` in fetch calls for cookie-based auth
- `staleTime` varies by feature: products (5 min), cart (30 sec), orders (1 min), admin data (30 sec)
- Invalidate queries after mutations that change data
- Use `queryKey` arrays with all filter params for proper cache segmentation
- Server Components fetch directly — only use TanStack Query in Client Components

---

## Zustand

**Check first:** Check AGENTS.md for an installed Zustand skill.

### Store Pattern

```typescript
// client/stores/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  variantId: string;
  productName: string;
  weight: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      updateQuantity: (variantId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.variantId !== variantId)
            : state.items.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
              ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "spiceey-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
```

**Rules:**

- Use Zustand for client-only state (cart UI state, wishlist, auth state cache)
- Use TanStack Query for server state — never put server data in Zustand directly
- Use `persist` middleware for cart (localStorage) to survive page refreshes
- `partialize` to only persist the data, not the actions
- Keep stores focused — one store per domain (cart, wishlist, UI state)

---

## Tiptap (Rich Text Editor)

**Check first:** Check AGENTS.md for an installed Tiptap skill.

### Editor Setup

```typescript
// client/components/admin/rich-text-editor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "font-bold" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "italic" : ""}
        >
          Italic
        </button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
    </div>
  );
}
```

**Rules:**

- Always sanitize HTML output on the server before storing in the database
- Use `StarterKit` for basic formatting (bold, italic, headings, lists)
- Store content as HTML string in the database
- Editor is client-only — use `"use client"` and mount check (`if (!editor) return null`)

---

## recharts (Charts)

**Check first:** Check AGENTS.md for an installed recharts skill.

### Revenue Chart Example

```typescript
// client/components/admin/revenue-chart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value: number) => `৳${value}`} />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

**Rules:**

- Always wrap charts in `<ResponsiveContainer>` for proper sizing
- Use `formatter` on Tooltip for currency display (৳ prefix)
- Charts are client-only — use `"use client"`
- Keep chart data flat and simple — transform server data before passing to chart

---

## Motion (Framer Motion)

**Package:** `motion` (npm). Import from `motion/react` in new code. The `framer-motion` package is a legacy alias — prefer `motion/react`.

### Import Convention

```typescript
// Always import from motion/react
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useReducedMotion } from "motion/react";
```

### Motion Constants

All shared animation values are defined in `client/lib/motion.ts`:

```typescript
// client/lib/motion.ts
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

Always import motion constants from this file — never hardcode easing or duration values in components.

### Scroll-Reveal Pattern

Standard entrance animation for sections below the fold:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { MOTION } from "@/lib/motion";

export function RevealSection({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: MOTION.duration.slow, ease: MOTION.ease.smooth }}
    >
      {children}
    </motion.div>
  );
}
```

### Stagger Children Pattern

For grids and lists that reveal items sequentially:

```tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { MOTION } from "@/lib/motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: MOTION.stagger.normal,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION.duration.slow, ease: MOTION.ease.smooth },
  },
};

export function StaggerGrid({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={reduce ? undefined : containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-6"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  );
}
```

### Spring Hover Pattern

For interactive cards with lift + shadow:

```tsx
<motion.div
  whileHover={{ y: -2, scale: 1.01 }}
  whileTap={{ scale: 0.97 }}
  transition={MOTION.ease.spring}
  className="rounded-xl bg-surface border border-border"
>
  {/* Card content */}
</motion.div>
```

### AnimatePresence Pattern

For enter/exit animations (cart items, modals, filters):

```tsx
"use client";
import { motion, AnimatePresence } from "motion/react";

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="unique-key"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {content}
    </motion.div>
  )}
</AnimatePresence>
```

### Layout Animation Pattern

For shared element transitions (tab indicators, variant selectors):

```tsx
// Active indicator slides between options
{options.map((option) => (
  <button key={option.id} onClick={() => setActive(option.id)}>
    {option.label}
    {active === option.id && (
      <motion.div
        layoutId="active-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
        transition={MOTION.ease.spring}
      />
    )}
  </button>
))}
```

### Scroll Progress Pattern

For scroll-linked animations (progress bars, parallax):

```tsx
"use client";
import { motion, useScroll, useTransform } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-50"
    />
  );
}
```

### Count-Up Animation Pattern

For dashboard stat numbers that count up on viewport entry:

```tsx
"use client";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

export function CountUp({ target }: { target: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [target, count]);

  return <motion.span>{rounded}</motion.span>;
}
```

**Rules:**

- Always import from `motion/react`, not `framer-motion`
- All motion components require `"use client"` directive
- Always check `useReducedMotion()` — degrade to static for reduced-motion users
- Only animate `transform` and `opacity` — never `width`, `height`, `top`, `left`
- Never use `useState` for continuous values — use `useMotionValue` + `useTransform`
- Always use `viewport={{ once: true }}` on scroll-reveals — fire once only
- Import easing/duration from `@/lib/motion` — never hardcode values
- Spring physics for interactions (hover, tap): `{ type: "spring", stiffness: 200, damping: 24 }`
- Tween with smooth easing for scroll-reveals: `[0.16, 1, 0.3, 1]`
- Keep motion components small and isolated — don't wrap entire pages in motion
- `AnimatePresence` must wrap content that enters/exits the DOM
- Use `layout` prop on siblings of items that exit (prevents layout jump)

---

## shadcn/ui

**Check first:** Check AGENTS.md for an installed shadcn/ui skill. Use the shadcn CLI to add components.

### Adding Components

```bash
cd client
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add toast
n```

### Usage

```typescript
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
```

**Rules:**

- Always add components via the shadcn CLI — never copy-paste from documentation
- Components live in `client/components/ui/` — never modify them directly
- Wrap shadcn primitives in custom components for project-specific styling
- Use the built-in Tailwind CSS variables for theming

---

## Next.js 16 proxy.ts

**Check first:** Check AGENTS.md for an installed Next.js skill.

### Route Protection

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

**Rules:**

- `proxy.ts` replaces `middleware.ts` in Next.js 16 — always use `proxy.ts`
- Runs in Node.js runtime (not Edge) — has full access to `fetch` and async operations
- Return `NextResponse.next()` to pass through, `NextResponse.redirect()` to redirect — import both from `next/server`
- Optimistic checks only: read the session cookie, never fetch the session from Express in proxy.ts (Proxy runs on every route incl. prefetches). Express middleware is the authoritative auth check.
- `/checkout` is NOT protected — guest checkout is supported. Only `/profile`, `/wishlist`, `/admin` require auth.
- Keep proxy.ts lightweight — do heavy logic in Express middleware

---

## API Client (Axios / Fetch)

```typescript
// client/lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api${endpoint}`, {
    ...options,
    credentials: "include", // critical for cookie-based auth
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

**Rules:**

- Always include `credentials: "include"` — auth cookies won't be sent without this
- All API calls go through this client — no raw `fetch()` calls in components
- The client handles the `{ success, data, error }` response shape from Express
- Server Components can fetch directly using `fetch()` with cookie forwarding

---

## Client Type Patterns

Since there is no shared package, client types mirror server responses manually.

```typescript
// client/types/index.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "ground" | "whole" | "mix" | "pickles";
  description: string | null;
  shortDescription: string | null;
  images: { id: string; url: string; publicId: string; sortOrder: number }[];
  variants: ProductVariant[];
  isFeatured: boolean;
  isBestSeller: boolean;
  status: "published" | "draft" | "archived";
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface ProductVariant {
  id: string;
  sku: string;
  weight: "100g" | "250g" | "500g";
  price: number;
  discountPrice: number | null;
  quantity: number;
  isAvailable: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  status: "pending" | "approved" | "rejected";
  helpfulCount: number;
  createdAt: string;
  isOwner: boolean; // true if the current user wrote this review
}

// ... more types as needed
```

**Rules:**

- Keep types in `client/types/index.ts` — single file for all client types
- Manually mirror server response shapes — no automated sync
- Use string unions for enums (not string) to match Zod enum schemas
- Always type API responses in hooks and data fetching functions
- When server types change, update the corresponding client types

---

## Environment Variables

All configuration is environment-driven. Never hardcode any key, URL, or secret.

| Variable | Used In | Notes |
|----------|---------|-------|
| `DATABASE_URL` | server/db/index.ts | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | server/auth/index.ts | Auth encryption key |
| `BETTER_AUTH_URL` | server/auth/index.ts | Auth base URL |
| `CLOUDINARY_CLOUD_NAME` | server/services/cloudinary.service.ts | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | server/services/cloudinary.service.ts | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | server/services/cloudinary.service.ts | Cloudinary API secret |
| `CLOUDINARY_UPLOAD_FOLDER` | server/services/cloudinary.service.ts | Default folder prefix |
| `GOOGLE_CLIENT_ID` | server/auth/index.ts | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | server/auth/index.ts | Google OAuth client secret |
| `NEXT_PUBLIC_SERVER_URL` | client/lib/api-client.ts | Express server URL (browser) |
| `SERVER_URL` | server/index.ts | Express server own URL |
| `CLIENT_URL` | server/index.ts | Next.js app URL (CORS origin) |

`NEXT_PUBLIC_` prefix means the variable is exposed to the browser. Never add `NEXT_PUBLIC_` to secret keys.
