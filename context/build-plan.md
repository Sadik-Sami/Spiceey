# Build Plan — Spiceey

## Project Overview

Spiceey is a Bangladesh-focused direct-to-consumer ecommerce platform that sells homemade and hand-ground spices, spice blends, and pickles.

The primary goal of the platform is to provide customers with a modern online shopping experience while maintaining the authenticity and trust associated with homemade products.

This is not a marketplace.

This is not a multi-vendor platform.

This is a single-brand ecommerce business where all products belong to the Spiceey brand.

The business operates exclusively within Bangladesh.

Orders are fulfilled manually using local courier services.

The platform must be mobile-first because most customers are expected to visit from mobile devices.

The platform should feel modern, premium, trustworthy, and easy to use.

---

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

Every UI component is built with Motion animations from the start — scroll-reveals, hover interactions, press feedback, and layout transitions are part of the initial UI phase, not bolted on later. Performance (LCP < 2.5s, CLS < 0.1, INP < 200ms) and SEO (generateMetadata, JSON-LD, sitemap) are built into every page from the first commit.

---

## Phase 1 — Foundation

### 01 Homepage — Full UI

Build the complete homepage UI with mock product data.

**UI:**

- Navbar — Spiceey logo, Shop link, Blog link, Stories link, Cart icon with badge, Account dropdown (Login / Profile / Orders / Logout), hamburger menu on mobile
- Hero section — full-width banner with headline ("Authentic Homemade Spices & Pickles"), subheadline, Shop Now CTA button, hero image of spice products
- Featured Products section — horizontal scroll row of 4 product cards with image, name, weight variant, price, discount badge, Add to Cart button
- Best Sellers section — 4-column grid of top-selling products with star ratings
- Offers / Discounts section — banner cards showing active promotions (e.g., "Free Shipping Over ৳500")
- Category Grid — 4 clickable category cards (Ground Spices, Whole Spices, Spice Mixes, Pickles) with representative images
- Trust Badges section — 3-column row: "Homemade Quality", "Fresh Ingredients", "Fast Delivery" with icons
- Newsletter section — email input with "Subscribe for Offers" button
- Footer — 4 columns: About Spiceey, Customer Service (Contact, Shipping Info, Returns), Quick Links (Shop, Blog, Stories), Social Media icons

**Animation:**

- Hero section — staggered entrance: headline (0ms) → subheadline (60ms) → CTA button (120ms) → hero image (180ms), using `motion.div` with `variants` and `staggerChildren: 0.06`
- Every section below the fold — scroll-reveal: `initial={{ opacity: 0, y: 24 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.3 }}`, duration 0.6s, ease `[0.16, 1, 0.3, 1]`
- Product cards — stagger entrance within each section (60ms per card), hover: image `scale(1.03)` via spring + card lift `-2px`, `whileTap={{ scale: 0.97 }}` on Add to Cart
- Category cards — hover: subtle scale(1.02) + shadow expand via spring
- Trust badges — stagger entrance on scroll (3 items, 80ms stagger)
- Newsletter section — input focus: border color transition, submit button spring press
- Announcement banner (if active) — slide-down entrance via `AnimatePresence`, slide-up on dismiss

**Loading States:**

- Hero: renders server-side, no skeleton needed (SSR)
- Product sections: skeleton cards matching product card dimensions (aspect-[4/5] image + 3 text lines)
- Category grid: skeleton cards with aspect-square placeholder

**SEO/AEO:**

- `generateMetadata()` — title: "Spiceey — Authentic Homemade Spices & Pickles | Bangladesh", description: brand value prop
- JSON-LD: `Organization` schema (name, logo, url, sameAs), `WebSite` schema with `SearchAction`, `FAQPage` schema with 5 brand FAQs (shipping, quality, sourcing, returns, payment methods)
- Open Graph image: branded hero image
- Canonical: `/`

**Logic:**

- Product cards link to `/shop/[slug]`
- Category cards link to `/shop?category=[slug]`
- Cart icon reads from Zustand cart store, shows item count badge
- Add to Cart button updates Zustand store + syncs to server cart
- Newsletter subscription — client-side email validation, mock submit
- Mobile: horizontal scroll sections snap to card width

---

### 02 Authentication

Email/password and Google OAuth authentication via Better Auth on Express. proxy.ts route protection.

**UI:**

- Login page — email input, password input, Show/Hide password toggle, Login button, "Don't have an account? Register" link, "Or continue with" divider, Google OAuth button
- Register page — name input, email input, phone number input, password input, confirm password input, Register button, "Already have an account? Login" link, Google OAuth button
- Both pages — clean centered card layout, Spiceey branding at top, mobile-responsive full-width card

**Logic:**

- Express server running with Better Auth mounted at `/api/auth/*`
- `POST /api/auth/sign-in/email` — validates credentials, sets httpOnly session cookie
- `POST /api/auth/sign-up/email` — creates user + customer record, sets session cookie
- `POST /api/auth/sign-in/social` — initiates Google OAuth flow
- `GET /api/auth/session` — returns current session (used by proxy.ts and client auth hook)
- `POST /api/auth/sign-out` — clears session cookie
- Zustand auth store hydrates from `/api/auth/session` on app mount
- After login/register — redirect to `/profile`

---

### 03 proxy.ts — Route Protection

Next.js 16 proxy.ts for authenticated route protection and page-level authorization.

**Logic:**

- Create `client/app/proxy.ts`
- Public routes pass through: `/`, `/shop`, `/shop/[slug]`, `/blog`, `/blog/[slug]`, `/stories`, `/stories/[slug]`, `/login`, `/register`, `/_next/*`, `/images/*`
- Authenticated routes redirect to `/login` if no session: `/profile/*`, `/wishlist`, `/checkout`
- Admin routes (`/admin/*`) — check session + verify role is `admin` or `super_admin`, redirect to `/` if not authorized
- Session check: `fetch()` to Express `/api/auth/session` forwarding the `cookie` header
- proxy.ts runs in Node.js runtime (not Edge), has full access to fetch API

---

### 04 Express Server — Foundation

Express v5 backend scaffold with all middleware, database connection, and route structure.

**Logic:**

- `server/src/index.ts` — Express app, CORS config (credentials: true, origin: client URL), JSON parser, cookie parser
- `server/src/db/index.ts` — Drizzle ORM client with PostgreSQL driver
- `server/src/db/schema.ts` — all table definitions (users, customers, products, productImages, productVariants, carts, orders, orderItems, orderStatusHistory, reviews, blogs, stories, coupons, announcements, shippingConfig, inventoryMovements, userAvatars)
- `server/src/middleware/auth.middleware.ts` — reads session cookie, validates with Better Auth, attaches `req.user`
- `server/src/middleware/rbac.middleware.ts` — checks `req.user.role` against required roles, returns 403 if unauthorized
- `server/src/middleware/validate.middleware.ts` — Zod schema validation for request body/query/params
- `server/src/middleware/error.middleware.ts` — global error handler, consistent error response format
- `server/src/auth/index.ts` — Better Auth instance with Drizzle adapter, session config
- Route index mounts all sub-routers at `/api/*`
- Docker Setup: Local dev `server/docker-compose.yml` for PostgreSQL 17; central `/docker-compose.yml` for full stack deployment.
- Run first migration to create all tables

---

### 05 Database Seed — Mock Products

Seed the database with mock products so every UI feature has data to display.

**Logic:**

- Seed 12+ products across 4 categories (ground spices, whole spices, spice mixes, pickles)
- Each product has 2-3 variants (100g, 250g, 500g)
- Product images use placeholder images (Cloudinary setup comes later — use placeholder URLs in seed)
- Seed 2 blog posts and 2 stories
- Seed shipping config for 3 zones (Inside Dhaka, Outside Dhaka, Remote Area)
- Seed 1 admin user (email: admin@spiceey.com, password from env)

---

## Phase 2 — Shop

### 06 Shop Page — Product Listing

Build the complete shop page with product grid, filters, search, and sorting.

**UI:**

- Page header — "All Products" title with product count
- Search bar — full-width input with search icon, placeholder "Search spices, pickles..."
- Category filter tabs — horizontal scrollable tabs: All, Ground Spices, Whole Spices, Spice Mixes, Pickles. Active tab highlighted.
- Sort dropdown — "Sort by: Featured / Price: Low to High / Price: High to Low / Best Selling / Newest"
- Product grid — responsive: 2 columns mobile, 3 columns tablet, 4 columns desktop
- Product card — image (aspect-square), product name, weight options as text chips, price (with strikethrough discount price if applicable), discount percentage badge, Add to Cart button, heart icon for wishlist
- Pagination — "Showing X of Y products", Previous/Next buttons, page numbers
- Empty state — "No products found" with reset filters link

**Animation:**

- Product grid — `AnimatePresence mode="wait"` on filter/search/page changes. Cards stagger in with 40ms delay
- Filter tabs — `layoutId="filter-indicator"` sliding active indicator
- Sort dropdown — smooth open/close via `AnimatePresence`
- Pagination — page change triggers grid crossfade
- Search — debounced 300ms, results animate in with stagger
- Empty state — fade-in entrance

**Loading States:**

- Initial load: skeleton grid matching responsive column count (2/3/4 columns)
- Filter change: skeleton overlay on grid, cards fade back in
- Pagination: skeleton grid while loading

**SEO/AEO:**

- `generateMetadata()` — dynamic title based on active filters: "Ground Spices — Spiceey" or "All Products — Spiceey"
- JSON-LD: `ItemList` schema with product entries, `BreadcrumbList` (Home > Shop > [Category])
- Canonical: `/shop` or `/shop?category=ground` (with filter params)
- Filter state in URL query params for shareable/indexable URLs

**Logic:**

- `GET /api/products` — Express endpoint with query params: `search`, `category`, `sort`, `page`, `limit`
- `GET /api/products/featured` — returns featured products for homepage (already used in Feature 01)
- Zod validation for query params on server
- TanStack Query for fetching with `staleTime: 5 * 60 * 1000`
- Filter state in URL query params (shareable URLs)
- Add to Cart calls `POST /api/cart/items` with variantId and quantity
- Wishlist toggle calls `POST /api/wishlist` (authenticated only, show login prompt if guest)

---

### 07 Product Detail Page

Individual product page with image gallery, variant selector, reviews, and related products.

**UI:**

- Breadcrumb — Home > Shop > Category > Product Name
- Product gallery — main large image with thumbnail strip below (4-5 images), click to enlarge
- Product info — product name, star rating with review count, price display (৳ discounted price with original strikethrough if applicable), "You save ৳X" badge
- Variant selector — weight chips (100g / 250g / 500g), selected state highlighted, out-of-stock variants disabled
- Quantity selector — minus button, number input, plus button (min 1, max available stock)
- Add to Cart button — full width, primary color, loading state on click
- Wishlist heart button — beside Add to Cart
- Product tabs — Description (rich text), Ingredients, How to Use, Nutrition Info
- Reviews section — average rating bar, individual review cards (avatar, name, rating, date, comment), "Write a Review" button (authenticated only)
- Related Products — "You May Also Like" horizontal scroll with 4 related items from same category

**Animation:**

- Product gallery — main image crossfade via `AnimatePresence mode="wait"` on thumbnail click
- Thumbnail strip — active thumbnail border slides via `layoutId`
- Variant selector — active pill indicator slides via `layoutId="active-variant"`
- Quantity selector — number crossfade via `AnimatePresence` on increment/decrement
- Add to Cart button — `whileTap={{ scale: 0.97 }}` spring press, success state: brief checkmark animation
- Cart icon pulse — after adding to cart, cart badge in navbar pulses once (scale 1.2 → 1.0 spring)
- Product tabs — content crossfade on tab switch via `AnimatePresence mode="wait"`
- Reviews section — stagger entrance on scroll
- Related products — horizontal scroll with scroll-snap, cards stagger on scroll-into-view
- Breadcrumb — subtle fade-in on mount

**Loading States:**

- Gallery: aspect-[4/5] skeleton for main image, row of small square skeletons for thumbnails
- Product info: text skeletons matching layout (title + rating + price + variants)
- Reviews: skeleton review cards (avatar circle + text lines)

**SEO/AEO:**

- `generateMetadata()` — product.seoTitle or product.name, product.seoDescription or shortDescription, ogImage
- JSON-LD: `Product` schema with name, image, description, brand, `AggregateOffer` (lowPrice, highPrice, priceCurrency: BDT, availability), `AggregateRating`, `BreadcrumbList`
- FAQPage JSON-LD: 3-5 product-specific FAQs (ingredients, storage, how to use, shelf life)
- Canonical: `/shop/[slug]`

**Logic:**

- `GET /api/products/:slug` — returns product with variants, approved reviews
- Variant selection updates displayed price and available quantity
- Add to Cart — validates stock, adds selected variant + quantity
- `GET /api/reviews?productId=` — fetches approved reviews with pagination (public)
- Related products — `GET /api/products?category=same&exclude=current&limit=4`
- `generateMetadata()` for SEO — uses product seoTitle, seoDescription, ogImage
- Product schema JSON-LD in page head

---

## Phase 3 — Cart & Checkout

### 08 Cart Page

Shopping cart with item list, quantity management, and order summary.

**UI:**

- Page title — "Shopping Cart" with item count
- Cart items list — each item: product image thumbnail, product name, variant weight, unit price, quantity stepper (minus/number/plus), line total, remove (trash icon) button
- Stock warning — if quantity exceeds available stock, show "Only X left" warning in red
- Order summary card — right sidebar on desktop, bottom section on mobile:
  - Subtotal (sum of line totals)
  - Shipping cost (calculated based on zone)
  - Discount (if coupon applied)
  - Total
  - Coupon code input with Apply button
  - Proceed to Checkout button
- Empty cart state — illustration, "Your cart is empty" text, "Start Shopping" button linking to /shop
- Save for later / Move to Wishlist actions per item

**Animation:**

- Cart items — `AnimatePresence` with `layout` prop for smooth reorder/removal. Remove: height collapse + fade out
- Quantity stepper — number crossfade via `AnimatePresence` on change
- Order summary — values animate on change (subtotal, total) via `useMotionValue` count transition
- Coupon apply — success: green checkmark slide-in, error: input shake animation
- Empty cart transition — `AnimatePresence` crossfade from cart items to empty state
- Proceed to Checkout button — spring press feedback

**Loading States:**

- Cart load: skeleton rows matching cart item layout
- Coupon validation: spinner inside Apply button
- Quantity update: brief loading indicator on line total

**Logic:**

- Cart state in Zustand (`client/stores/cart-store.ts`) synced with server
- `GET /api/cart` — fetches current cart (authenticated: user cart, guest: session cart)
- `PUT /api/cart/items/:id` — update quantity (validate against available stock)
- `DELETE /api/cart/items/:id` — remove item
- Shipping cost calculation: reads shipping address district → maps to zone → applies base cost or free shipping if over threshold
- `POST /api/coupons/validate` — validates coupon code, returns discount amount
- Coupon state stored in Zustand, applied to total calculation client-side
- Proceed to Checkout → navigate to `/checkout`

---

### 09 Checkout Flow

Multi-step checkout: shipping info, payment method, order review, order confirmation.

**UI:**

- Step indicator — 3 steps: Shipping > Payment > Review, with progress bar
- **Step 1: Shipping**
  - Full Name input
  - Phone Number input (required for guest checkout)
  - District dropdown (Dhaka, Chittagong, Sylhet, etc.)
  - Upazila/Thana input
  - Area/Locality input
  - Detailed Address textarea
  - Delivery note textarea (optional — "Leave at gate", "Call before delivery")
  - Shipping cost preview — shows zone and cost based on district
  - Continue to Payment button
- **Step 2: Payment**
  - Payment method selection — COD radio button (only option in V1)
  - Order summary sidebar — items list, subtotal, shipping, discount, total
  - Place Order button
- **Step 3: Confirmation**
  - Success checkmark animation
  - "Order Placed Successfully!" heading
  - Order number display (e.g., SPY-20240621-001)
  - Order summary — items, total, payment method, delivery address
  - "Continue Shopping" button
  - "View My Orders" button (authenticated)

**Animation:**

- Step transitions — slide left (forward) / slide right (backward) via `AnimatePresence` with custom direction variant
- Step indicator — progress bar fills smoothly via `motion.div` width transition
- Form fields — stagger entrance on step mount (40ms per field)
- Shipping cost preview — number animate-in when district selected
- Place Order button — loading state: spinner replaces text
- Confirmation page — SVG checkmark path-draw animation (`motion.path pathLength`), then staggered text reveal: order number (0ms) → summary (100ms) → action buttons (200ms)

**Loading States:**

- Checkout page load: skeleton step indicator + skeleton form fields
- Order submission: full-page overlay with spinner and "Processing your order..." text

**Logic:**

- `POST /api/orders` — creates order with full validation:
  - Validate cart is not empty
  - Validate all items still in stock
  - Calculate subtotal, shipping, discount, total
  - Create order record + order items + order status history (status: `pending`)
  - Reserve inventory (increment `reservedQuantity`)
  - Clear cart
  - Return order details for confirmation page
- Guest checkout supported — `guestPhone` and `guestName` fields on order
- Authenticated users — order linked to `customerId`, shipping address auto-filled from profile
- Zod validation for all checkout fields on Express
- On success, redirect to confirmation page with order number in URL

---

## Phase 4 — Customer Account

### 10 Profile Page

Customer profile with personal info, address management, and profile image upload.

**UI:**

- Page layout — sidebar navigation (Profile, My Orders, My Reviews, Logout) + main content area
- **Profile Information tab:**
  - Profile photo — circular avatar with Cloudinary upload (click to change, preview before save)
  - Personal info form — Name (text), Email (display only), Phone (text)
  - Address section — default address card with edit button
  - Add New Address button — opens modal with district, upazila, area, address line inputs
  - Total orders count, total spent amount (display cards)
- Save Changes button at bottom
- Account info card — member since date, role badge

**Animation:**

- Profile card — fade-up entrance on mount
- Avatar upload — image crossfade on new upload via `AnimatePresence`
- Address cards — stagger entrance, new address card slides in from below via `AnimatePresence`
- Save button — spring press, success: brief green flash
- Form fields — subtle focus ring transition (CSS transition, not Motion)

**Loading States:**

- Profile load: skeleton avatar circle + text line skeletons
- Save action: spinner in Save button

**Logic:**

- `GET /api/customers/me` — returns customer profile with addresses
- `PUT /api/customers/me` — updates profile fields
- `POST /api/customers/me/addresses` — adds new address
- `PUT /api/customers/me/addresses/:id` — updates address
- `DELETE /api/customers/me/addresses/:id` — removes address
- `PUT /api/customers/me/addresses/:id/default` — sets default address
- **Profile photo upload:**
  - `GET /api/cloudinary/signature` — get signed upload params
  - Client uploads to Cloudinary directly
  - `PUT /api/customers/me/avatar` — save new url + public_id
  - Server deletes old avatar via `cloudinary.uploader.destroy(oldPublicId)`
- Form state managed with React Hook Form + Zod client-side validation
- TanStack Query for data fetching, cache invalidation on mutation

---

### 11 My Orders Page

Order history with status tracking and review action.

**UI:**

- Page title — "My Orders"
- Order list — each order card: order number, order date, total amount, status badge (Pending/Confirmed/Packing/Ready for Courier/Shipped/Delivered — color-coded), item count
- Expandable/collapsible order detail per card:
  - Items list with images, names, quantities, prices
  - Shipping address
  - Tracking info section (if manually entered by admin) — courier name, tracking number, tracking URL link
  - Payment method, payment status
- Filter tabs — All / Pending / Shipped / Delivered
- "Write a Review" button on delivered items (links to review form)
- Pagination for order list

**Animation:**

- Order cards — stagger entrance on page load (60ms per card)
- Order expand/collapse — `AnimatePresence` with height auto + content fade
- Filter tabs — `layoutId="order-filter"` sliding active indicator
- Status badge — color matches order status tokens from ui-tokens.md
- Write a Review button — spring press feedback

**Loading States:**

- Order list: skeleton cards matching order card layout
- Order detail expand: skeleton content inside expanding area

**Logic:**

- `GET /api/orders/my` — returns authenticated user's orders with items, sorted by createdAt desc
- Query param filters: `?status=pending` etc.
- Each order shows status from `orders.status` field
- Tracking info displays `courierName`, `trackingNumber`, `trackingUrl` (all manually entered by admin)
- Review button only shown for delivered orders without an existing review
- TanStack Query with `staleTime: 60 * 1000` (orders change frequently)

---

### 12 Write a Review

Review submission form with pending approval flow.

**UI:**

- Page/modal — "Write a Review for [Product Name]"
- Star rating selector — 5 clickable stars, hover to preview
- Review title input — placeholder "Summarize your experience"
- Review comment textarea — placeholder "Tell us what you liked or didn't like"
- Submit Review button
- Success toast — "Review submitted and is pending approval"

**Logic:**

- `POST /api/reviews` — creates review with `status: 'pending'`
- Body: `{ productId, rating (1-5), title, comment }`
- Zod validation on server
- After submit — redirect back to orders page with success message
- **Pending review visibility:**
  - The review author sees their own pending review on the product page with muted/gray styling
  - Other users do NOT see pending reviews
  - Once admin approves (`status: 'approved'`), the review becomes visible to everyone with normal styling

---

## Phase 5 — Admin Dashboard

### 13 Admin Layout & Dashboard

Admin shell with sidebar navigation and analytics dashboard.

**UI:**

- Admin layout — collapsible left sidebar (desktop), bottom nav (mobile) with links: Dashboard, Products, Orders, Customers, Inventory, Reviews, Blogs, Stories, Coupons, Settings
- Top bar — admin avatar, logout button, notification bell
- **Dashboard page:**
  - 4 stat cards — Total Revenue (৳), Total Orders, Registered Customers, Products in Stock. Each with trend indicator (up/down vs last period)
  - Revenue chart — line chart, last 30 days, daily revenue
  - Orders chart — bar chart, last 7 days, daily order count
  - Recent Orders table — last 10 orders, sortable by date, with status badges
  - Low Stock Alert section — items below threshold with current stock count

**Animation:**

- Stat cards — stagger entrance (4 cards, 80ms stagger). Count-up numbers on viewport entry via `useMotionValue` + `useTransform` + `whileInView`
- Revenue chart — line path draw-in via `motion.path pathLength` on mount
- Orders chart — bars grow upward on mount (staggered)
- Recent orders table — rows stagger in (40ms per row)
- Low stock alerts — red/warning badges pulse subtly once on entrance

**Loading States:**

- Dashboard: skeleton stat cards (number + label) + skeleton chart areas + skeleton table rows

**Logic:**

- All admin routes protected by `proxy.ts` (admin role) + `rbac.middleware.ts` on Express
- `GET /api/admin/analytics/dashboard` — returns: totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders, lowStockItems
- `GET /api/admin/analytics/sales` — returns daily revenue array for line chart
- Revenue = SUM(orders.total) WHERE status = 'delivered'
- Charts rendered with recharts
- Recent orders from `GET /api/admin/orders?limit=10`
- Low stock from productVariants WHERE (quantity - reservedQuantity) <= lowStockThreshold

---

### 14 Product Management (CRUD)

Admin product list, create, edit, and archive functionality with Cloudinary image uploads.

**UI:**

- **Product List page:**
  - Search bar — filter by product name
  - Category filter dropdown
  - Status filter (Published / Draft / Archived)
  - Add New Product button
  - Data table — columns: Image, Name, Category, Base Price, Status badge, Actions (Edit, Archive)
  - Pagination
- **Product Form (Create/Edit):**
  - Name input
  - Slug input (auto-generated from name, editable)
  - Category dropdown (ground/whole/mix/pickles)
  - Short description textarea
  - Full description — Tiptap rich text editor
  - Ingredients textarea
  - How to Use textarea
  - Nutrition Info textarea
  - Tags input — comma-separated, displayed as chips
  - SEO Title input, SEO Description textarea
  - Images — multi-image uploader (Cloudinary signed upload), drag & drop, reorder, delete old
  - Is Featured toggle, Is Best Seller toggle
  - Status dropdown (published/draft/archived)
  - **Variants section** — add/remove variants per row: weight (100g/250g/500g), SKU, price, discount price, stock quantity, low stock threshold, availability toggle. At least one variant required.
  - Save Product button

**Logic:**

- `GET /api/admin/products` — list with search, filter, pagination
- `GET /api/admin/products/:id` — single product with variants for edit
- `POST /api/admin/products` — create with variants (transaction)
- `PUT /api/admin/products/:id` — update product + sync variants
- `PATCH /api/admin/products/:id/status` — quick status change (archive/unarchive)
- All endpoints require admin role (RBAC)
- Slug uniqueness validated on server
- Product creation: insert product → insert variants in same Drizzle transaction
- **Cloudinary image flow:**
  - Admin selects images → client requests signature from `GET /api/cloudinary/signature`
  - Client uploads each image directly to Cloudinary
  - Client receives `secure_url` + `public_id` for each
  - On save, client sends `url` + `publicId` array to server → stored in `productImages` table
  - On image replacement: server calls `cloudinary.uploader.destroy(oldPublicId)` to delete old image
- Tiptap content sanitized on server before storage

---

### 15 Order Management

Admin order list, order detail view, and manual status updates.

**UI:**

- **Orders List page:**
  - Filter bar — status dropdown (All/Pending/Confirmed/Packing/Ready for Courier/Shipped/Delivered/Cancelled), date range picker, search by order number or customer phone
  - Data table — columns: Order Number, Customer (name/phone), Date, Total, Items Count, Status badge, Actions (View)
  - Bulk action — select multiple orders, bulk status update dropdown
  - Pagination
- **Order Detail page:**
  - Order header — order number, date, status badge, payment method, payment status
  - **Status Update section** — dropdown with available next statuses + note textarea + Update Status button
    - From `pending`: can → `confirmed`, `cancelled`
    - From `confirmed`: can → `packing`, `cancelled`
    - From `packing`: can → `ready_for_courier`, `cancelled`
    - From `ready_for_courier`: can → `shipped`, `cancelled`
    - From `shipped`: can → `delivered`, `returned`
  - **Manual Tracking Entry** — Courier Name input, Tracking Number input, Tracking URL input, Save button
  - Customer info — name, phone, shipping address
  - Items list — image, product name, variant, SKU, price, quantity, line total
  - Order totals — subtotal, shipping, discount, total
  - Order Status History timeline — chronological list of all status changes with timestamp, previous→new status, note, who performed the action

**Logic:**

- `GET /api/admin/orders` — list with filters, pagination
- `GET /api/admin/orders/:id` — single order with items, status history
- `PATCH /api/admin/orders/:id/status` — update status with validation:
  - Validate status transition is allowed (see state machine above)
  - On `shipped`: deduct stock, release reservation
  - On `cancelled` (before shipped): release reservation
  - On `delivered`: mark payment as completed (COD)
  - On `returned`: add stock back
  - Insert `orderStatusHistory` record with previous→new status, note, createdBy
- `PATCH /api/admin/orders/:id/tracking` — update courierName, trackingNumber, trackingUrl manually
- `POST /api/admin/orders/bulk-status` — bulk update selected orders
- All inventory side effects wrapped in Drizzle transactions

---

### 16 Inventory Management

Stock tracking, adjustments, and movement history.

**UI:**

- **Inventory Dashboard:**
  - Stat cards — Total SKUs, Low Stock Items, Out of Stock Items, Total Inventory Value
  - Low stock alert table — items below threshold with current stock, reserved, available, action: Adjust Stock button
  - Stock adjustment modal — select variant, current stock display, adjustment type (addition/deduction/adjustment), quantity input, reason textarea, submit
- **Inventory Log:**
  - Filterable table — all inventory movements with: SKU, Product Name, Type badge (addition/deduction/adjustment/reservation/release), Quantity, Reason, Reference, Date, Admin who performed
  - Pagination

**Logic:**

- `GET /api/admin/inventory` — current stock levels with filters
- `GET /api/admin/inventory/low-stock` — items below threshold
- `POST /api/admin/inventory/adjust` — create adjustment:
  - Drizzle transaction: update `variant.quantity` + insert `inventoryMovements` record
  - Adjustment types: addition (+quantity), deduction (-quantity), adjustment (set to exact quantity)
  - Reason and reference fields required for audit trail
- `GET /api/admin/inventory/movements` — paginated movement log with filters
- All inventory changes must be paired with a movement log entry (enforced in service layer)

---

### 17 Customer Management

Customer list with order history and contact info.

**UI:**

- **Customers List page:**
  - Search by name, email, or phone
  - Data table — columns: Name, Email, Phone, Total Orders, Total Spent (৳), Joined Date, Actions (View)
  - Pagination
- **Customer Detail page:**
  - Customer info card — name, email, phone, addresses, join date
  - Order history — table of all orders by this customer with status, total, date
  - Total stats — lifetime orders, lifetime spent

**Logic:**

- `GET /api/admin/customers` — list with search, pagination
- `GET /api/admin/customers/:id` — customer with order history
- Read-only for V1 (no customer editing by admin)

---

### 18 Review Moderation

Pending review approval and management.

**UI:**

- **Reviews List page:**
  - Filter tabs — Pending / Approved / Rejected / All
  - Data table — columns: Product, Customer, Rating (stars), Title, Comment snippet, Status badge, Date, Actions (Approve / Reject / View)
  - View modal — full review content with product link
  - Pending reviews highlighted for visibility

**Logic:**

- `GET /api/admin/reviews?status=pending` — list pending reviews
- `GET /api/admin/reviews?status=approved` — list approved reviews
- `GET /api/admin/reviews?status=rejected` — list rejected reviews
- `PATCH /api/admin/reviews/:id/approve` — set `status: 'approved'` → immediately visible on product pages
- `PATCH /api/admin/reviews/:id/reject` — set `status: 'rejected'` → hidden from the author too
- Reviews are created with `status: 'pending'` by default when a customer submits

---

## Phase 6 — Content & Settings

### 19 Blog Management (CRUD)

Admin blog creation and public blog pages with Cloudinary cover image upload.

**UI (Admin):**

- **Blog List page:**
  - Add New Post button
  - Table: Title, Author, Status (published/draft/archived), Date, Actions (Edit, View, Archive)
- **Blog Form:**
  - Title input, slug input (auto-generated)
  - Excerpt textarea
  - Content — Tiptap rich text editor
  - Cover image — single image uploader (Cloudinary signed upload with delete on change)
  - Tags input
  - SEO title, SEO description
  - Status dropdown, published date picker
  - Save button

**UI (Public):**

- `/blog` page — grid of blog cards (cover image, title, excerpt, date, read time)
- `/blog/[slug]` page — full article with cover image, title, author, date, tags, rich text content, related posts

**Animation:**

- Blog card grid — stagger entrance on scroll (60ms per card)
- Blog cards — hover: image scale(1.03) + shadow expand via spring
- Blog post page — hero image fade-in, content stagger on scroll
- Related posts — horizontal scroll with stagger

**SEO/AEO:**

- `/blog` listing: `generateMetadata()`, `ItemList` JSON-LD
- `/blog/[slug]`: `generateMetadata()` from blog.seoTitle/seoDescription, `Article` JSON-LD with author, datePublished, dateModified, `BreadcrumbList`, `FAQPage` JSON-LD if relevant FAQs exist
- Canonical URLs on all blog pages

**Logic:**

- `GET /api/blogs` — public, lists published blogs
- `GET /api/blogs/:slug` — public, single blog post
- `GET /api/admin/blogs` — admin list with all statuses
- `POST /api/admin/blogs` — create
- `PUT /api/admin/blogs/:id` — update
- Cloudinary cover image: store `coverImageUrl` + `coverImagePublicId`; delete old via `cloudinary.uploader.destroy()` on replacement
- Tiptap content sanitized server-side before storage
- `generateMetadata()` for blog SEO

---

### 20 Story Management (CRUD)

Admin story creation and public story pages (same pattern as blogs) with gallery upload.

**UI (Admin):**

- Same CRUD pattern as blogs with additional fields:
  - Story Type dropdown — sourcing / preparation / grinding / packaging / delivery
  - Gallery — multiple image uploader for story photos (Cloudinary signed upload)
- **Story List page:**
  - Filter by story type
  - Same table structure as blogs

**UI (Public):**

- `/stories` page — grid of story cards with story type badge, gallery preview
- `/stories/[slug]` page — immersive story with gallery carousel, rich text narrative

**Animation:**

- Story card grid — stagger entrance on scroll (60ms per card)
- Story cards — hover: subtle lift + shadow via spring
- Story detail page — gallery carousel with swipe gesture support, image crossfade
- Gallery images — `AnimatePresence mode="wait"` for smooth transitions

**SEO/AEO:**

- `/stories` listing: `generateMetadata()`, `ItemList` JSON-LD
- `/stories/[slug]`: `generateMetadata()`, `Article` JSON-LD with `ImageGallery`, `BreadcrumbList`

**Logic:**

- Same API pattern as blogs: `GET /api/stories`, `GET /api/stories/:slug`, `POST /api/admin/stories`, `PUT /api/admin/stories/:id`
- Gallery stored as `jsonb[]` of `{ url, publicId }` objects
- On gallery image removal: `cloudinary.uploader.destroy(publicId)` to clean up
- Additional fields: `storyType`, `gallery`

---

### 21 Coupon Management

Admin coupon creation and customer-facing coupon validation.

**UI (Admin):**

- **Coupons List page:**
  - Add New Coupon button
  - Table: Code, Type (percentage/fixed/free_shipping), Value, Min Order, Usage (count/limit), Expires, Is Active toggle, Actions (Edit, Deactivate)
- **Coupon Form:**
  - Code input (uppercase, auto-format)
  - Type dropdown — percentage / fixed amount / free shipping
  - Value input (৳ amount or %)
  - Minimum order amount input
  - Maximum discount cap input
  - Usage limit input
  - Expiry date + time picker
  - Is Active toggle
  - Save button

**Logic:**

- `GET /api/admin/coupons` — admin list
- `POST /api/admin/coupons` — create with validation (unique code)
- `PUT /api/admin/coupons/:id` — update
- `PATCH /api/admin/coupons/:id/toggle` — quick activate/deactivate
- `POST /api/coupons/validate` — public endpoint:
  - Validates code exists, is active, not expired, usage limit not reached
  - Checks minimum order amount
  - Returns discount amount based on type and cart subtotal

---

### 22 Announcements & Shipping Settings

Admin-configurable site announcements and shipping rates.

**UI (Admin):**

- **Announcements section:**
  - Active announcements list — message text, type badge (info/warning/success), date range, is active toggle
  - Add announcement — message textarea, type dropdown, start date, end date
- **Shipping Config section:**
  - 3 zone cards — Inside Dhaka, Outside Dhaka, Remote Area
  - Each card: base cost input, free shipping threshold input, is active toggle
  - Save button per zone

**UI (Public):**

- Announcement banner — appears at top of site if active announcement exists, color-coded by type, dismissible per session

**Logic:**

- `GET /api/admin/settings/announcements` — admin list
- `POST /api/admin/settings/announcements` — create
- `PATCH /api/admin/settings/announcements/:id/toggle` — activate/deactivate
- `GET /api/admin/settings/shipping` — admin list
- `PUT /api/admin/settings/shipping/:zone` — update zone config
- `GET /api/shipping/config` — public, returns active shipping zones and rates (used by checkout)
- `GET /api/announcements/active` — public, returns currently active announcement for banner
- Announcement banner client component fetches on mount, stores dismissed state in sessionStorage

---

## Feature Count

| Phase | Features |
|-------|----------|
| Phase 1 — Foundation | 5 |
| Phase 2 — Shop | 2 |
| Phase 3 — Cart & Checkout | 2 |
| Phase 4 — Customer Account | 3 |
| Phase 5 — Admin Dashboard | 6 |
| Phase 6 — Content & Settings | 4 |
| **Total** | **22** |
