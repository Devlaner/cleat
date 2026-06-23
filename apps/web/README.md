# Cleat

**Cleat** is a GitHub **security + maintenance + audit** platform. Connect your
account and organizations to run security scans, get alerted on critical events,
and manage artifacts, dependencies, access and spend, all in one dark, focused
workspace.

> Frontend-only demo. All data is realistic, deterministic dummy data. No backend.

## Stack

- **React 19 + TypeScript** on **Vite**, run with **Bun**
- **Tailwind CSS v4** themed from `DESIGN.md` (Linear dark system)
- **Zustand** for state, **Recharts** for data viz, **lucide-react** icons, **Motion** for animation

## Features

- **Overview**: security posture grade + trend, severity breakdown, reclaimable spend, risk leaderboard, critical events
- **Security**: Secrets (with live validity + remediation), Vulnerabilities (fix-first priority: CVSS + EPSS + KEV + reachability), Code scanning
- **Supply chain**: Actions audit (SHA-pinning, permissions, OIDC) + incident bulletins
- **Dependencies & SBOM**: inventory, license compliance, SPDX / CycloneDX export
- **Artifacts & cost**: storage explorer with bulk-delete, caches, packages, quota gauges
- **Repositories**: filterable inventory + per-repo hygiene scorecard
- **Access & audit**: members/2FA, OAuth & GitHub Apps, webhooks, keys, PAT hygiene, audit log
- **Notifications & settings**: critical-event feed, alert rules, scan preferences
- Org/account switcher re-scopes every screen · ⌘K command palette · responsive

## Develop

```bash
bun install
bun run dev        # start Vite dev server
bun run build      # type-check + production build
bun run typecheck  # tsc --noEmit
```

---

## Dataset API mode

By default, the app uses the local mock dataset.

To use the HTTP API instead, create a `.env` file and set:

```env
VITE_USE_MOCK_API=false
```

---

## Ufazien Deployment

This project is configured for deployment to Ufazien Hosting.

### Build and Deploy

1. Build your project (this will create a `dist` or `build` folder):

```bash
npm run build
# or
yarn build
# or
pnpm build
```

2. Deploy to Ufazien:

```bash
ufazienjs deploy
```

The deployment will automatically upload the contents of your build folder.
