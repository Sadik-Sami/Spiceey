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

### C. Planning & Architecture

- **`/scope`** — Use when starting a new major feature to plan and update the living scope in `docs/scope/`.
- **`/architect`** — Use before implementing complex backend services, data structures, or making load-bearing technical decisions.

### D. Implementation & Coding

- **`/develop`** — Use for standard feature implementation (UI or backend) following the specs. UI builds run under design-taste-frontend + ui-rules.md/ui-tokens.md constraints.
- **`ponytail` (Full Mode)** — Emphasize the "lazy senior developer" approach for backend/logic: write minimal, efficient code, reuse standard libraries, and aggressively avoid over-engineering. YAGNI applies heavily.
- **`context7-mcp`** — **Always** use this when implementing `motion/react`, `Next.js 16 (proxy.ts)`, `Drizzle`, or `Better Auth` to pull the latest syntax and avoid hallucinating deprecated APIs.

### E. Verification & Debugging

- **`/check`** — Run after completing a UI component to verify it matches the design system, animations, and specs in `ui-rules.md` and `ui-tokens.md`. Impeccable's `audit` + `critique` run before `/check` as the standard UI verification.
- **`/test`** — Run to generate tests for backend services, complex utilities, or edge cases.
- **`/debug`** — Use strictly for finding the root cause of a failing test, a broken UI behavior, or a persistent issue.

### F. State Management & Documentation

- **`/sync`** — Run as the final step after a feature is completed to update root documentation, reconcile scope, and flag stale specs.
- **`/imprint`** — Run after finalizing a unique UI pattern so it can be captured and reused consistently later.
- **`/document`** — Use for writing human-facing prose about a change (changelogs, release notes).
- **`impeccable document` / `extract`** — Handle DESIGN.md generation and token/component extraction into the design system.
