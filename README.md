# Spiceey

Spiceey is a single-brand, direct-to-consumer (DTC) ecommerce platform in Bangladesh selling homemade spices and pickles. It is **not** a multi-vendor marketplace — one brand, one catalog. Orders are manually fulfilled through local couriers, and payments are Cash On Delivery (COD) in V1.

## Repository Layout

```
├── docker-compose.yml   # Full-stack deployment: db → server → client
├── .env.example         # Template for all environment variables
├── server/              # Express 5 + Drizzle ORM + PostgreSQL 17 + Better Auth
│   └── docker-compose.yml  # Local compose: PostgreSQL only (dev)
└── client/              # Next.js 16 (App Router) + Tailwind CSS v4 + Better Auth React
    ├── app/(auth)/      # Isolated auth route group (/login, /register)
    ├── components/auth/ # Client forms, brand showcase, and OAuth buttons
    └── lib/             # Better Auth client, Zod schemas, and Motion tokens
```

## Technology Stack

| Layer    | Stack |
|----------|-------|
| Client   | Next.js 16 (App Router, `standalone` output), Tailwind CSS v4, Zustand 5, TanStack Query 5, Motion 13, Better Auth React client, React Hook Form, Zod, Base UI / shadcn/ui, next-themes |
| Server   | Express 5, Drizzle ORM (0.45.2), PostgreSQL 17, Better Auth (1.6.29), Cloudinary (signed uploads), Zod |
| Infra    | Docker Compose, multi-stage Dockerfiles, pnpm 11 |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. Secrets required to boot the full stack: `BETTER_AUTH_SECRET`, `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`, `GOOGLE_CLIENT_ID/CLIENT_SECRET`. Generate the auth secret with:

```bash
openssl rand -base64 32
```

## Two Docker Compose Setups

There are two compose files in this repo. They serve different purposes — don't confuse them.

### Root `docker-compose.yml` — full stack (prod-like, or whole-app preview)

Runs the entire stack in order: `db` (PostgreSQL 17), then `server`, then `client`. The server waits for the database health check before starting.

```bash
cp .env.example .env   # fill in secrets
docker compose up --build
```

- **Client**: http://localhost:3000
- **Server**: http://localhost:4000 (health at `/api/health`)
- **Database**: `postgres:17-alpine` on `localhost:5432` (user/pass/db all `spiceey`)

The compose file injects `DATABASE_URL` pointing at the `db` service by hostname (`spiceey:spiceey@db:5432/spiceey`), so the server container reaches the database over the compose network. Secrets (`BETTER_AUTH_SECRET`, Cloudinary, Google OAuth) are read from your `.env`.

### `server/docker-compose.yml` — database only (local development)

A minimal compose file that spins up **just the database**, so you can run the server and client as local processes while developing.

```bash
docker compose up -d          # from server/
# or: pnpm run db:start       # from server/
```

The database is the same `spiceey-db` container on `localhost:5432`. For local development, `DATABASE_URL` in `server/.env` should use `localhost`, not the compose-internal hostname.

## Ports

| Service | Port |
|---------|------|
| Client (Next.js) | 3000 |
| Server (Express) | 4000 |
| PostgreSQL | 5432 |

## Authentication Architecture

Authentication is powered by **Better Auth** (1.6.29) across server and client:

- **Server Authentication**: Express mounts Better Auth handlers at `/api/auth/*splat` before `express.json()`, backed by PostgreSQL and Drizzle ORM. Sessions are issued as secure `httpOnly` cookies with UUID primary keys and RBAC roles (`customer`, `admin`, `super_admin`).
- **Client Auth Client (`client/lib/auth-client.ts`)**: Built with `@better-auth/react` pointing to `NEXT_PUBLIC_SERVER_URL` (default `http://localhost:4000`). Exports `signIn`, `signUp`, `signOut`, `useSession`, `getSession`, and inferred TypeScript types (`User`, `Session`).
- **Isolated Auth Layout (`client/app/(auth)/layout.tsx`)**: Dedicated route group layout without storefront navigation, featuring a smart fallback back button (`AuthBackButton`), centered brand logo, and minimal footer.
- **Routes & Pages**:
  - `/login` (`client/app/(auth)/login/page.tsx`): Server component with metadata, housing `LoginForm` and `AuthShowcasePanel`. Supports email/password credentials, password visibility toggle, remember-me state, animated error alerts, and Google OAuth.
  - `/register` (`client/app/(auth)/register/page.tsx`): Server component with metadata, housing `RegisterForm` and `AuthShowcasePanel`. Supports full name, email, optional Bangladesh phone number format (`017XXXXXXXX`), password with confirmation match, and Google OAuth.
- **Form Validation & Motion**: Forms use `react-hook-form` paired with `@hookform/resolvers/zod` and Zod schemas (`client/lib/validations/auth.ts`). Micro-interactions utilize shared spring/easing tokens (`client/lib/motion.ts`) and `AnimatePresence` for error alerts.
- **Brand Showcase Panel (`AuthShowcasePanel`)**: Asymmetric 2-column desktop layout featuring a 35-40% Burnt Sienna (`#BE5428`) brand heritage surface with WCAG AA-compliant typography and authentic trust pillars (100% Hand-Ground, Preservative Free, Nationwide COD).

## Theme & Dark Mode Architecture

The platform supports light, dark, and system themes with full hydration safety:

- **Theme Provider (`client/components/providers/theme-provider.tsx`)**: Integrates `next-themes` with `attribute="class"`, `defaultTheme="light"`, `enableSystem`, and `disableTransitionOnChange`. Mounted at the root level in `client/app/layout.tsx` alongside `suppressHydrationWarning` on `<html>`.
- **Mode Toggle (`client/components/mode-toggle.tsx`)**: Interactive theme switcher utilizing `next-themes` `useTheme()` hook with CSS rotate/scale transforms between `Sun` and `Moon` Lucide icons.
- **Dropdown Primitive (`client/components/ui/dropdown-menu.tsx`)**: Accessible dropdown menu built with `@base-ui/react/menu` and styled with Tailwind CSS tokens for selecting Light, Dark, or System preferences.

## Development Workflow (without Docker for app code)

```bash
# 1. Start just the database
cd server && docker compose up -d

# 2. Run the API in watch mode (server/.env already configured)
cd server && pnpm dev          # http://localhost:4000

# 3. Run the client (client/.env already configured)
cd client && pnpm dev          # http://localhost:3000
```

See `server/README.md` and `client/README.md` for the full local setup for each side.
