# AGENTS.md

Guidance for anyone (people or AI assistants) working in this repository. Claude Code reads
this through `CLAUDE.md`, and other tools that follow the `agents.md` convention pick it up
directly.

## What Cleat is

Cleat is a GitHub security, maintenance, and audit platform. You connect your GitHub account
and organizations, and Cleat surfaces leaked secrets, vulnerable dependencies, risky Actions
workflows, and reclaimable spend, then alerts you when something critical happens.

The repository is a monorepo with two halves:

- `apps/web`: the frontend. It is built and working today, driven entirely by deterministic
  dummy data (no backend calls yet). React, TypeScript, Vite, Tailwind v4.
- `backend/`: Java with Spring Boot, scaffolded as a Gradle multi-module project. No application
  code yet. See `backend/README.md`.

```
cleat/
  apps/
    web/            # frontend SPA (live, dummy data)
  backend/          # Java + Spring Boot (planned, placeholder only)
  docs/             # shared documentation
  AGENTS.md         # this file
  CLAUDE.md         # imports AGENTS.md
```

## Frontend (`apps/web`)

All web commands run from inside `apps/web`.

```bash
bun run dev        # Vite dev server on http://localhost:5173
bun run build      # production build (run typecheck separately)
bun run typecheck  # tsc --noEmit, strict. This is the main correctness gate.
bun run preview    # serve the built dist/
```

There is no automated test suite. Verification is visual: throwaway Playwright scripts live in
`apps/web/scripts` (gitignored) and write to `apps/web/scripts/shots`. Run them with `node`,
not `bun`, because Chromium's `--remote-debugging-pipe` transport hangs under Bun on this
machine. Keep those scripts inside the `scripts` folder, since Node cannot resolve `playwright`
from a temp directory. After a change, the normal check is `bun run typecheck && bun run build`,
plus a screenshot if the UI moved.

### Conventions that are easy to get wrong

- Add dependencies with `bun add` or `bun add -d`. Do not hand-edit `package.json` dependencies.
- Bump the version on every meaningful change. `bun pm version` does not exist in this Bun
  version, so use `npm version <patch|minor|major> --no-git-tag-version` (and `npm pkg set` for
  scripts or fields). Keep the bump as its own commit.
- `apps/web/DESIGN.md` is the visual source of truth. Dark canvas only, lavender (`#5e6ad2`) is
  the single chromatic accent (brand mark, primary CTA, focus, links). Depth comes from the
  surface ladder and hairline borders. The severity palette (critical, high, medium, low, info)
  is product-only and never appears on the marketing landing.
- Avoid em dashes in copy. They read as an AI tell here. Commas, colons, and periods do the job.
- `lucide-react` is v1.x, which dropped brand glyphs, so `Github`, `Slack`, and similar do not
  exist. Use `components/ui/GithubMark.tsx` for GitHub and generic icons elsewhere.
- TypeScript is strict, with `verbatimModuleSyntax` (use `import type`) and
  `noUncheckedIndexedAccess` (indexed access is `T | undefined`, so guard or assert). The path
  alias `@/*` maps to `apps/web/src/*`.

### How the frontend is built

Stack: React 19 + TypeScript, Vite, Tailwind CSS v4 (CSS-first `@theme`), Zustand, Recharts,
lucide-react, Motion (Framer).

The data layer is the heart of it. Everything is fake but realistic and stable per account,
because it is seeded:

- `src/data/accounts.ts` defines four accounts (one personal, three orgs).
- `src/data/rng.ts` is a seeded PRNG so output is deterministic.
- `src/data/catalog.ts` holds pools of realistic names (repos, packages, secrets, actions).
- `src/data/generate.ts` builds a whole `Dataset` from `new Rng(account.id)`. Repo-level
  finding counts are derived from the generated findings so the numbers agree across screens.
- `src/data/index.ts` memoizes the dataset via `getDataset(accountId)`.
- `src/data/metrics.ts` holds the pure aggregates: `severityBreakdown`, `vulnPriority`
  (CVSS + EPSS + KEV + reachability), `sidebarCounts`, `topRiskRepos`, and so on.

Components never call `getDataset` directly. They use the `useDataset()` hook, which returns the
dataset for the active account. Switching the active account in `useOrgStore` re-scopes every
screen at once.

State lives in Zustand: `useOrgStore` (connection, connected accounts, active account; gates
`/app/*`), `useUiStore` (sidebar, mobile nav, command palette, toasts), `useFilterStore`
(per-table search, sort, and facets keyed by a `tableKey`), and `useNotificationStore` (read
state for activity events).

Routing is in `src/App.tsx` with `BrowserRouter`. Marketing and onboarding load eagerly; every
`/app/*` page is lazy-loaded because it pulls in Recharts. The whole tree sits inside
`<MotionConfig reducedMotion="user">`. `AppShell` is the authenticated shell and the connection
guard.

Two patterns worth knowing before you touch list screens or the landing page:

- Tables use `DataTable<T>` plus `FilterBar` plus the `useFilteredRows(tableKey, rows, ...)`
  hook. You define a `Column<T>[]` and a `FacetDef<T>[]` and give each table a unique `tableKey`.
- The landing page "screenshots" are the real app UI rendered live and scaled into a browser
  frame, not images. See `features/marketing/ProductPreview.tsx`, `ui/ScaledFrame.tsx`, and the
  per-screen bodies in `features/marketing/previews/`. This keeps marketing identical to the
  product and is lazy-loaded so charts do not bloat the landing bundle.

## Backend (`backend/`)

Java with Spring Boot, set up as a Gradle multi-module project. The structure is scaffolded but
no application code is written yet (no main classes, no Gradle wrapper). See `backend/README.md`
for the module rundown.

It is a modular monolith with two deployables off one codebase: `api` serves the frontend and
receives webhooks (fast), `worker` does the slow async work (scans, enrichment, scheduled
re-scans). Both depend on the shared `libs/*`.

```
backend/
  settings.gradle.kts        registers every module
  build.gradle.kts           Java 21, Spring Boot 3.3 BOM, shared plugins
  apps/
    api/                     deployable: REST read path + webhook receiver
    worker/                  deployable: queue consumers, scheduled scans, enrichment
  libs/
    common/                  config, observability, errors, shared DTOs
    domain/                  entities + business logic (vulnPriority, posture, hygiene)
    persistence/             JPA, repositories, Flyway migrations
    github-client/           GitHub App client: token manager + rate limiter
    enrichment/              EPSS, KEV, OSV, SPDX feeds plus scoring
    scanning/                scan orchestration + per-domain workers
```

An app pulls in a library with a Gradle project dependency, for example
`implementation(project(":libs:domain"))`, then imports it in Java. Each module's package root is
`dev.cleat.<module>` (the `github-client` module uses `dev.cleat.githubclient`).

When you start the backend, the first move is to make the api return the same shapes the frontend
already uses (see `apps/web/src/data/types.ts`), so the frontend can switch from local generation
to live data with no UI change.

## Working conventions (whole repo)

- Many small commits, each focused on one thing.
- No AI attribution in commit messages. Do not add "Generated with" or "Co-Authored-By" lines.
- Git identity is already set at the repo level.
- Keep secrets out of the repo. Cleat is a security product, so we hold ourselves to the bar we
  sell.
