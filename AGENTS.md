<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-rules -->

## 1. Read Before Anything Else

Read in this exact order before any implementation:

1. `context/project-overview.md`
2. `context/architecture.md`
3. `context/ui-tokens.md`
4. `context/ui-rules.md`
5. `context/ui-registry.md`
6. `context/code-standards.md`
7. `context/library-docs.md`
8. `context/build-plan.md`
9. `context/progress-tracker.md`

## 2. Immutable Rules

- Never use hardcoded hex values or raw Tailwind color classes. Always use CSS variables from `@theme` (e.g., `bg-primary`, `text-accent`).
- The brand palette is **Burnt Sienna Committed** — one committed accent (sienna, `#BE5428` light / `#D96C3C` dark fields). Never introduce a second accent color. The sienna must appear as large regions (30-40% of surface), not only tiny button accents.
- Always implement `Motion` animations for UI components from the start (scroll-reveals, hover physics, etc.).
- Follow AEO (Answer Engine Optimization) guidelines for all text content (FAQs, product descriptions).
- Update `context/progress-tracker.md` and `context/ui-registry.md` after every completed feature.
- Before using any third-party library, read `context/library-docs.md` for project-specific rules.
- If the same problem persists after one corrective prompt — stop immediately and run `/recover` or `/debug`.

## 3. Skill Ecosystem & Prioritization

The Spiceey project utilizes a rich ecosystem of specialized skills. Load these skills based on the scenario:

### A. The Impeccable Design Pipeline (All UI Work)

Every UI surface flows through Impeccable's command pipeline. `impeccable` is the design command center: it owns PRODUCT.md/DESIGN.md truth, direction contracts, surface briefs, and finish reviews. Run `node .agents/skills/impeccable/scripts/context.mjs` once per session before design work, then follow its directives.

1. **DIRECTION** — `/impeccable shape [feature]` (plan UX/UI before writing code) or `/impeccable init` (first-time setup: PRODUCT.md + buildPath). New visual worlds go through `reference/new-work.md` (direction contracts, concept seed, color strategy).
2. **BUILD** — `/develop` with `design-taste-frontend` constraints active (quality floor) and ui-rules.md/ui-tokens.md in force.
3. **REFINE** — `/impeccable audit` (a11y/perf/responsive) → `/impeccable critique` (UX review: hierarchy, clarity, resonance) → fix findings in one batch → `/impeccable polish`.
4. **ENHANCE (only when needed)** — `/impeccable animate`, `bolder`, `quieter`, `distill`, `colorize`, `typeset`, `layout`, `delight`, `overdrive`.
5. **HARDEN** — `/impeccable harden` (errors, edge cases, i18n) → `adapt` (devices) → `optimize` (performance).
6. **DOCUMENT** — `/impeccable extract` (pull tokens/components into the design system) → `document` (generate DESIGN.md) → `/sync`.

Discipline: never run two enhancement commands on the same surface in one pass. Batch audit/critique findings, fix once, polish, stop. Bounded passes only — no open-ended polish loops.

### B. Design & UI/UX (tiered)

**Tier 1 — always active during any UI work:**
- **`impeccable`** — the orchestrator (pipeline in Section 3A).
- **`design-taste-frontend`** — anti-slop quality floor. Hard bans always enforced: premium-consumer palette rules (warm beige + brass + oxblood + espresso banned), em-dash ban, eyebrow restraint, one-accent lock, section-layout repetition ban, 50+ item pre-flight check. Load before building any landing or storefront page.

**Tier 2 — load per task type:**
- **`bencium-impact-designer`** — hero sections, product cards, and other components that must be memorable. Force-Variety creative direction, bold commitment.
- **`high-end-visual-design`** — $150k agency component patterns (double-bezel nested cards, island buttons, motion choreography). Signature components only, never as a global style.
- **`bencium-aeo`** — product descriptions, FAQs, blog content (18-token extraction sentences, evidence panels, FAQPage schema).

**Tier 3 — situational:**
- **`bencium-controlled-ux-designer`** — collaborative exploration of design options before committing (ask-first protocol).
- **`design-audit`** — standalone second-opinion visual audit after major milestones (Impeccable's own audit runs in the pipeline first).
- **`imagegen-frontend-web`** — when generating design reference images for direction cards or section comps.

**Retired (do not use):** `bencium-innovative-ux-designer` (redundant with impact-designer), `design-taste-frontend-v1` (superseded by v2), `redesign-existing-projects` (not a greenfield tool), `stitch-design-taste` (Google Stitch-specific).

### C. The Engineering Workflow (Feature Loop)

We follow the JS Mastery Engineering Workflow. State lives in files (`docs/scope/`, `docs/specs/`, `AGENTS.md`, tests), not in chat memory, ensuring work survives across sessions.

**The standard feature loop:**
`idea → /scope → /architect → /develop → /check verify → /test → /check review → /document → /sync`

- **`/audit`** — Run on an existing codebase to seed or update context files (`AGENTS.md`). For greenfield, run it *after* scaffolding the project stack.
- **`/scope`** — Run when starting a new product, or planning the next slice. Turns an idea into a living, coarse plan of what to build, in order, inside `docs/scope/`.
- **`/architect`** — Run when a load-bearing choice is unmade (data model, provider, page design) or if `/develop` says a decision is owed. Runs a deep design conversation and writes it as a build spec in `docs/specs/`.
- **`/develop`** — Run to build a feature (UI or backend) from its spec, run migrations, and advance the scope. **Gate:** It gates to `/architect` if a design is owed. UI builds run under `design-taste-frontend` + `ui-rules.md`/`ui-tokens.md` constraints. (For backend/logic, emphasize the "lazy senior developer" approach via `ponytail` Mode).
- **`/check`** — Run to confirm a change. Use `/check verify` after `/develop` to run the real app and prove the feature works against the spec. Use `/check review` before a PR for a senior review on a different model.
- **`/test`** — Run to write a senior test suite for your uncommitted change after building a feature or fixing a bug.
- **`/document`** — Run to write human-facing prose (PR body, changelog, release note, postmortem) from the real diff when a change needs writing up.
- **`/sync`** — Run as the absolute last step around merge. Reconciles `AGENTS.md`, the scope, and spec statuses to what the repo now shows.
- **`/debug`** — Run anytime something is failing, throwing, or behaving wrong. Finds and fixes the root cause, then hands a regression test to `/test`.

### D. Custom AI Assistants & APIs

- **`context7-mcp`** — **Always** use this when implementing `motion/react`, `Next.js 16 (proxy.ts)`, `Drizzle`, or `Better Auth` to pull the latest syntax and avoid hallucinating deprecated APIs.
- **`ponytail` (Full Mode)** — Emphasize the "lazy senior developer" approach for backend/logic: write minimal, efficient code, reuse standard libraries, and aggressively avoid over-engineering. YAGNI applies heavily.
- **`/imprint`** — Run after finalizing a unique UI pattern so it can be captured and reused consistently later.
- **`impeccable document` / `extract`** — Handle `DESIGN.md` generation and token/component extraction into the design system.
