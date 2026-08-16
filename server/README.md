# Spiceey Server

Express 5 API for Spiceey — the backend for the Spiceey DTC ecommerce platform (homemade spices and pickles, Bangladesh).

## Stack

- **Express 5** — HTTP framework, ESM (`"type": "module"`)
- **Drizzle ORM** 0.45.2 + **drizzle-kit** 0.31.10 — schema, migrations, and queries
- **PostgreSQL 17** — database (via `pg`)
- **Better Auth** 1.6.29 — authentication (email/password + Google OAuth, scaffolded)
- **Cloudinary** 2.x — signed image uploads for product photos
- **Zod** 4 — request validation
- **TypeScript** (strict) compiled with `tsc` to `dist/`
- **@t3-oss/env-core** — environment variable validation in `src/env.ts` (import the validated `env` object; never read `process.env` directly)

## Current Endpoints

| Method | Path          | Description                        |
|--------|---------------|------------------------------------|
| GET    | `/`           | Service info (`version: 1.0.0`)    |
| GET    | `/api/health` | Health check: status, timestamp, uptime |

Both return a uniform envelope: `{ success, data }` on success, `{ success, error: { code, message } }` on failure (handled by the global error middleware).

## Project Structure

```
src/
└── index.ts   # App bootstrap: CORS, JSON body parsing, routes, global error handler
```

The server is freshly scaffolded: Drizzle and Better Auth are installed and configured in `package.json` but not yet wired into the app. Database schema goes in `src/db/schema/` (modular files, barrel-exported from `index.ts`) with `drizzle.config.ts` at `src/drizzle.config.ts`.

## Building & Running

Requires Node 20+ and pnpm 11.

```bash
# 1. Install dependencies
pnpm install

# 2. Start the PostgreSQL container (db-only compose file)
pnpm db:start

# 3. Configure environment
cp .env.example .env    # the template lives at the repo root
#   DATABASE_URL=postgresql://spiceey:spiceey@localhost:5432/spiceey (default works)

# 4. Run the dev server (tsx watch, restarts on change)
pnpm dev
```

The API listens on **http://localhost:4000**. Verify with `curl http://localhost:4000/api/health`.

## Scripts

| Script       | Command                | Purpose                    |
|--------------|------------------------|----------------------------|
| `dev`        | `tsx --watch src/index.ts` | Dev server with hot reload |
| `build`      | `tsc && tsc-alias -f`  | Compile `src/` → `dist/` and rewrite path aliases to ESM-compatible `.js` |
| `start`      | `node dist/index.js`   | Run the compiled server     |

### Path Aliases
We use `moduleResolution: "bundler"` during compilation. Use the `@/` alias in `src/` to refer to internal files without ugly relative `.js` extensions. The `tsc-alias -f` step seamlessly rewrites these to ESM-compatible paths inside `dist/`.
