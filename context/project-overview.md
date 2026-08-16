# Project Overview

## About the Project

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

## The Problem It Solves

Bangladesh has a rich tradition of homemade spices and pickles, but purchasing them online is often unreliable. Customers face issues with product authenticity, inconsistent quality, and lack of trust in online food sellers.

Spiceey solves this by creating a single-brand, trustworthy platform where every product is guaranteed homemade and hand-ground by the Spiceey team. Customers get authentic products with a modern, reliable shopping experience — clear product information, easy ordering, cash on delivery, and transparent order tracking.

---

## Pages

```
/                          → Homepage (featured products, categories, offers)
/shop                      → Product listing with filters, search, sort
/shop/[slug]               → Product detail (gallery, variants, reviews)
/cart                      → Shopping cart with quantity management
/checkout                  → Multi-step checkout (shipping, payment, review)
/login                     → Login (email/password + Google OAuth)
/register                  → Registration (name, email, phone, password)
/profile                   → Customer profile and address management
/profile/orders            → Order history and tracking
/profile/reviews           → My reviews (pending + approved)
/wishlist                  → Saved products
/blog                      → Blog post listing
/blog/[slug]               → Individual blog post
/stories                   → Story (behind-the-scenes) listing
/stories/[slug]            → Individual story with gallery
/admin                     → Admin dashboard (analytics, KPIs)
/admin/products            → Product CRUD management
/admin/orders              → Order management and status updates
/admin/customers           → Customer list and detail
/admin/inventory           → Stock tracking and adjustments
/admin/reviews             → Review moderation (pending/approved/rejected)
/admin/blogs               → Blog CRUD management
/admin/stories             → Story CRUD management
/admin/coupons             → Coupon creation and management
/admin/settings            → Announcements and shipping config
```

---

## Navigation

### Public Navigation

Main navbar — logo, Shop, Blog, Stories links, Cart icon with count, Account dropdown.

Mobile: hamburger menu for links, bottom tab bar for quick access.

### Customer Account Sidebar

Visible on `/profile/*` pages:

```
Profile
My Orders
My Reviews
Logout
```

### Admin Sidebar

Collapsible left sidebar (desktop) / bottom nav (mobile) on `/admin/*` pages:

```
Dashboard
Products
Orders
Customers
Inventory
Reviews
Blogs
Stories
Coupons
Settings
```

---

## Core User Flow

### Homepage

- Hero section with headline and Shop Now CTA
- Featured products horizontal scroll
- Best sellers grid
- Active offers and promotions
- Category navigation grid
- Trust badges (homemade quality, fresh ingredients, fast delivery)
- Newsletter email signup

### Browsing Products

- User navigates to `/shop`
- Searches products by keyword, filters by category, sorts by price/best-selling
- Clicks product card → navigates to `/shop/[slug]`
- Views product images, selects weight variant, reads reviews
- Adds to cart or saves to wishlist (authenticated)

### Cart & Checkout

- User navigates to `/cart`
- Reviews items, adjusts quantities, applies coupon code
- Proceeds to `/checkout`
- **Guest checkout:** fills shipping address, selects COD, places order
- **Authenticated checkout:** shipping address pre-filled, selects COD, places order
- Order confirmation page with order number

### Order Tracking

- Authenticated user goes to `/profile/orders`
- Sees order list with status badges
- Expands order for details — items, shipping address, tracking info (manually entered by admin)
- Status flow: Pending → Confirmed → Packing → Ready for Courier → Shipped → Delivered

### Writing a Review

- User receives delivered order
- Goes to `/profile/orders`, clicks "Write a Review" on delivered item
- Selects star rating, enters title and comment
- Submits review
- Review appears to the user with muted/gray styling (status: pending)
- Admin approves review → becomes visible to all users with normal styling

### Admin Order Fulfillment

- Admin receives new order notification
- Opens `/admin/orders`, views order detail
- Updates status: pending → confirmed → packing → ready_for_courier
- Takes package to courier office manually
- Enters tracking number, updates status to shipped
- Confirms delivery, marks as delivered

---

## Data Architecture

### Product Data

- Products and variants live in the database, managed entirely by admins
- Product images stored in Cloudinary with `public_id` tracked for deletion
- No external product feeds or imports

### Order Data

- Orders created during checkout, linked to customer or guest phone
- Order status history tracks every manual status change by admin
- Inventory reservations tied to order lifecycle

### Review Data

- Reviews have three statuses: `pending`, `approved`, `rejected`
- Pending reviews visible only to the author (muted styling)
- Approved reviews visible to everyone on the product page
- Admin manually approves or rejects each review

### Content Data

- Blogs and stories managed by admins via Tiptap rich text editor
- Cover images and gallery images stored in Cloudinary
- SEO metadata (title, description, Open Graph) on all content

---

## Features In Scope

- Homepage with hero, featured products, best sellers, categories, trust badges, offers, newsletter, footer
- Main navbar + mobile navigation + account dropdown
- Better Auth authentication (email/password + Google OAuth)
- proxy.ts route protection with RBAC
- Express v5 backend with Drizzle ORM and PostgreSQL
- Product catalog with search, category filter, sort, pagination
- Product detail page with image gallery, variant selector, reviews
- Cart with quantity management, coupon application, shipping calculation
- Multi-step checkout (shipping, payment COD, order review)
- Guest checkout support
- Order confirmation page
- Customer profile with address management and avatar upload
- My orders page with status tracking and expandable details
- Write a review with pending approval flow
- Admin dashboard with KPI cards, revenue chart, orders chart, recent orders, low stock alerts
- Admin product CRUD with Cloudinary image upload/delete
- Admin order management with manual status updates and tracking entry
- Admin inventory tracking with stock adjustment and movement log
- Admin customer list and detail view
- Admin review moderation (approve/reject pending reviews)
- Admin blog CRUD with Tiptap editor and Cloudinary cover image
- Admin story CRUD with gallery upload
- Admin coupon creation and validation
- Admin announcements and shipping zone configuration
- Public announcement banner
- SEO: automatic sitemap, generateMetadata, JSON-LD structured data
- Mobile-first responsive design throughout

---

## Features Out of Scope

- Multi-vendor marketplace functionality
- Product import from external sources
- Online payment integration (bKash/Nagad/SSLCommerz — planned for future)
- Courier API integration (Pathao, Steadfast, etc.)
- Automatic shipping status updates or webhooks
- Real-time order notifications
- Product ratings without review text
- Social sharing features
- Product comparison tool
- Live chat or customer support chat
- Email or SMS notifications
- Mobile native app
- Multi-language support
- Advanced analytics (Google Analytics, Meta Pixel)
- Affiliate or referral system
- Subscription or recurring orders
- Product import/export CSV
- Bulk product operations
- Automated review solicitation emails
- Inventory alerts via email/SMS
- Advanced search (fuzzy, autocomplete dropdown)
- Product recommendations engine
- Abandoned cart recovery
- Wishlist for guest users
- Product review photos
- Admin activity log
- Customer loyalty points program
- Multi-currency support
- Invoice PDF generation

---

## Target User

A customer in Bangladesh who:

- Wants authentic homemade spices and pickles delivered to their door
- Prefers cash on delivery payment
- Shops primarily from mobile devices
- Values product quality and trustworthiness
- Expects a modern, easy-to-use shopping experience

### Admin User

The Spiceey business owner/team who:

- Manages product catalog and inventory
- Processes orders manually through local couriers
- Moderates customer reviews
- Publishes blog posts and stories about the brand
- Configures promotions and announcements

---

## Success Criteria

- Customer can browse products, add to cart, and complete checkout in under 3 minutes
- Platform loads fast on mobile 3G/4G connections
- Product pages rank well for relevant spice keywords in Bangladesh
- Admin can process an order from pending to shipped in under 2 minutes
- Inventory stays accurate through the reservation pattern
- Review moderation filters out irrelevant or spam reviews
- Cloudinary image uploads and deletions work without orphaned assets
- All product images, blog covers, and avatars use signed uploads (no unsigned upload vulnerabilities)
- UI is fully responsive and usable on 320px wide screens
- Order status history provides complete audit trail
