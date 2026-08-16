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

The server is freshly scaffolded: Drizzle and Better Auth are installed and configured in `package.json` but not yet wired into the app. Database schema goes in `src/db/` when you introduce it (convention: `src/db/schema.ts` with a `drizzle.config.ts` at the server root).

## Running Locally

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

## Drizzle ORM Conventions

Scripts (`pnpm run`):

| Script          | Command            | Purpose                                   |
|-----------------|--------------------|-------------------------------------------|
| `db:start`      | `docker compose up -d` | Start the local PostgreSQL container  |
| `db:stop`       | `docker compose stop` | Stop the container, keep the volume |
| `db:down`       | `docker compose down` | Stop and remove the container      |
| `db:generate`   | `drizzle-kit generate` | Generate SQL migrations from schema |
| `db:migrate`    | `drizzle-kit migrate`  | Apply migrations to the database  |
| `db:push`       | `drizzle-kit push`     | Push schema directly (prototyping only, skip for prod) |
| `db:studio`     | `drizzle-kit studio`   | Browse/seed data in the Drizzle Studio UI |

Conventions: define the schema in `src/db/schema.ts`, use `drizzle-kit generate` + `migrate` for anything that reaches production, and reserve `db:push` for throwaway prototyping.

## Better Auth Setup

`better-auth@1.6.29` is pinned and the client dependency is mirrored in `client/`. To wire it up:

1. Create the auth instance in `src/auth.ts` (or similar) with the Postgres Drizzle adapter.
2. Mount `auth.handler` on the Express app for `/api/auth/*`.
3. Set `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`) and `BETTER_AUTH_URL` (default `http://localhost:4000`) — both are already in `.env.example`.
4. Google OAuth requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and the callback URL configured in the Google Cloud console.

## Building & Running in Docker

The `Dockerfile` is multi-stage using `ghcr.io/pnpm/pnpm:11`:

- **Stage 1** fetches production dependencies only (`pnpm fetch --prod`)
- **Stage 2** installs everything and runs `tsc`
- **Stage 3** copies `dist/` and prod `node_modules`, then runs `node dist/index.js`

```bash
docker build -t spiceey-server .
docker run -p 4000:4000 --env-file .env spiceey-server
```

For the full stack (db + server + client), use the root `docker-compose.yml` instead — see the root `README.md`.

## Scripts

| Script       | Command                | Purpose                    |
|--------------|------------------------|----------------------------|
| `dev`        | `tsx --watch src/index.ts` | Dev server with hot reload |
| `build`      | `tsc`                  | Compile `src/` → `dist/`    |
| `start`      | `node dist/index.js`   | Run the compiled server     |
