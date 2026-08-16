# Spiceey Client

Next.js 16 frontend for Spiceey — the storefront for a single-brand DTC ecommerce platform selling homemade spices and pickles in Bangladesh.

## Stack

- **Next.js 16** (App Router, React 19) with `output: "standalone"` for optimized Docker builds
- **Tailwind CSS v4** — CSS-first config via `@theme` in `app/globals.css` (no `tailwind.config`)
- **Zustand** 5 — lightweight client state
- **TanStack Query** 5 — server state and data fetching (via axios)
- **Motion** (Framer Motion) 13 — scroll reveals, hover physics, and micro-interactions
- **Better Auth** 1.6.29 — auth client, mirrors the server's version
- **shadcn/ui** + **Base UI** + `lucide-react` icons — component primitives

## UI Standards

These rules are enforced project-wide — follow them in every component.

### Burnt Sienna — one committed accent

The brand palette is **Burnt Sienna Committed**: exactly one accent color (sienna), used for primary actions, highlights, and large surface regions (30–40% of a page), not just tiny button accents. Never introduce a second accent color.

Never write hardcoded hex values or raw Tailwind color classes in components. Always use the CSS variables defined in `app/globals.css` via `@theme`:

- `bg-primary`, `text-primary-foreground` — sienna `#BE5428` (WCAG AA-safe with white text at 4.66:1)
- `bg-surface`, `bg-surface-secondary`, `bg-surface-muted` — page and card backgrounds
- `text-text-primary`, `text-text-secondary`, `text-text-muted` — text tiers
- `border-border` — hairlines and dividers
- Status tokens (`status-pending`, `status-confirmed`, … `status-returned`) for order/review states

### Typography

Two Google Fonts, loaded with `next/font/google` in `app/layout.tsx`:

- **Bricolage Grotesque** (`--font-bricolage`) — display/headings, mapped to `font-display`
- **Schibsted Grotesk** (`--font-schibsted`) — body text, mapped to `font-sans` (default)

Use `font-display` for headings and hero copy; reserve `font-sans` for body and UI text.

### Motion

All interactive UI uses Motion animations from the start: scroll-reveals on section entry, hover physics on cards and buttons. Import from `motion/react`.

## Running Locally

Requires Node 20+ and pnpm 11.

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env    # the template lives at the repo root
#   NEXT_PUBLIC_SERVER_URL=http://localhost:4000 (default works)

# 3. Start the dev server
pnpm dev
```

Open **http://localhost:3000**. The API must be running for data fetching to work — see `../server/README.md` (the dev database-only compose file is `server/docker-compose.yml`).

## Scripts

| Script  | Command       | Purpose                       |
|---------|---------------|-------------------------------|
| `dev`   | `next dev`    | Dev server with hot reload    |
| `build` | `next build`  | Production build (standalone) |
| `start` | `next start`  | Serve the production build    |
| `lint`  | `eslint`      | Lint the codebase             |

## Building & Running in Docker

The `Dockerfile` is multi-stage on `node:20-alpine`:

1. **deps** — `pnpm install --frozen-lockfile` with corepack
2. **builder** — `next build` (emits `.next/standalone` because of `output: "standalone"`)
3. **runner** — copies the standalone server, static assets, and `public/`, then runs `node server.js` on port 3000

```bash
docker build -t spiceey-client .
docker run -p 3000:3000 spiceey-client
```

For the full stack (db + server + client), use the root `docker-compose.yml` — see the root `README.md`.
