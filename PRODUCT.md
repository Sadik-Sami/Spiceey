# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), Tailwind CSS v4, Motion (Framer Motion), Express v5 backend with Drizzle ORM (PostgreSQL), and Better Auth for authentication.

## Users

**Primary Users:** Consumers in Bangladesh looking for authentic, homemade spices, spice blends, and pickles. They shop primarily on mobile devices and prefer cash on delivery (COD).
**Admin Users:** The Spiceey business owner and team who manage the product catalog, fulfill orders manually via local couriers, moderate reviews, and publish brand content.

## Product Purpose

A single-brand direct-to-consumer ecommerce platform to sell Spiceey's homemade, hand-ground products. It exists to solve the problem of unreliable online food sellers in Bangladesh by providing a modern, premium, and deeply trustworthy shopping experience with guaranteed authenticity.

## Positioning

Spiceey is NOT a marketplace or a multi-vendor platform. It is a single-brand boutique where every single product is homemade and hand-ground by the Spiceey team itself, ensuring quality control that aggregators cannot match.

## Operating Context

- Mobile-heavy traffic on varying connection speeds (3G/4G).
- Order fulfillment is completely manual via local courier offices; no automated shipping API integrations.
- Customer reviews are moderated before going public to maintain quality.
- Payments are currently Cash on Delivery (COD) only.

## Capabilities and Constraints

- **Capabilities:** Full e-commerce flow (shop, cart, multi-step checkout), customer profiles, order history tracking, authenticated wishlist, comprehensive admin dashboard (CRUD products, inventory movements, manual order status progression).
- **Constraints:** No live courier API tracking, no online payment gateways in V1, no multi-vendor logic. 
- **Tech Constraints:** Strict separation of client (Next.js) and server (Express). `proxy.ts` handles Next.js route protection.

## Brand Commitments

- **Name:** Spiceey
- **Identity:** Warm organic premium language built on a **Burnt Sienna Committed** color strategy. One committed brand color, Burnt Sienna (#BE5428), owns 30-40% of the surface (sections, fields, navigation) rather than appearing only as accents; clean warm white (#FEFDFB) and neutral charcoal (#292524) carry the rest; warm stone (#78716C) for muted neutrals. The color of chili powder and clay pots signals warmth, craft, and appetite without the predictable food-brand greens and reds. Dark mode uses warm charcoal darks with a brighter sienna (#D96C3C) for brand fields.
- **Typography:** Bricolage Grotesque for display headlines, Schibsted Grotesk for body/UI. Both imported via `next/font/google` as variable fonts. AI-default faces (Inter, Plus Jakarta Sans, Fraunces, Space Grotesk, etc.) are banned.

## Evidence on Hand

Currently a greenfield build. Mock product data, blogs, and configuration will be seeded to drive the initial UI development.

## Product Principles

1. **Mobile-First Clarity:** The experience must be effortless and fast on a 320px screen.
2. **Built-in Trust:** Transparency in sourcing, processing, and reviews to overcome local ecommerce skepticism.
3. **Impeccable Polish:** High-end motion design, micro-interactions, and visual execution to signal premium quality.
4. **Focused Scope:** Do a few things perfectly rather than bolting on complex unneeded features (e.g. manual courier flow over buggy integrations).

## Accessibility & Inclusion

WCAG AA minimum for contrast and interactive elements. Strict adherence to `prefers-reduced-motion` for all UI animations.
