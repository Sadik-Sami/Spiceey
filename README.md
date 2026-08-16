# Spiceey

Spiceey is a single-brand, direct-to-consumer (DTC) ecommerce platform in Bangladesh selling homemade spices and pickles. It is **not** a multi-vendor marketplace — one brand, one catalog. Orders are manually fulfilled through local couriers, and payments are Cash On Delivery (COD) in V1.

## Repository Layout

```
├── docker-compose.yml   # Full-stack deployment: db → server → client
├── .env.example         # Template for all environment variables
├── server/              # Express 5 + Drizzle ORM + PostgreSQL 17 + Better Auth
│   └── docker-compose.yml  # Local compose: PostgreSQL only (dev)
└── client/              # Next.js 16 (App Router) + Tailwind CSS v4
```

## Technology Stack

| Layer    | Stack |
|----------|-------|
| Client   | Next.js 16 (App Router, `standalone` output), Tailwind CSS v4, Zustand, TanStack Query, Motion, Better Auth client |
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
