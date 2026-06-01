<div align="center">

# Cleat

**Security, maintenance, and audit for your GitHub account and organizations.**

Connect GitHub, and Cleat surfaces leaked secrets, vulnerable dependencies, risky Actions
workflows, and reclaimable spend, then alerts you the moment something critical happens.

</div>

---

## What this is

Cleat watches the parts of GitHub that are easy to lose track of. It pulls together five areas
into one dark, focused dashboard:

- **Security**: leaked secrets, vulnerable dependencies (ranked by real exploitability, not raw
  alert count), and code-scanning alerts.
- **Supply chain**: an Actions audit that flags unpinned actions, over-broad workflow
  permissions, and missing OIDC, alongside live incident bulletins.
- **Dependencies and SBOM**: a full inventory, license compliance, and exportable SBOMs.
- **Maintenance**: reclaim storage spend from forgotten artifacts, stale caches, and untagged
  packages, plus a per-repository hygiene scorecard.
- **Governance**: members and 2FA, OAuth and GitHub Apps, webhooks, keys, token hygiene, the
  audit log, and notifications.

## Project status

The frontend is built and working today. It runs on realistic, deterministic dummy data, so you
can click through the whole product without connecting anything. The Java and Spring Boot backend
that will replace the dummy data with live GitHub intelligence is designed but not yet built. The
full system design is written up in `local/docs/architecture.md`.

## Repository layout

This is a monorepo.

```
cleat/
  apps/
    web/        # frontend SPA: React, TypeScript, Vite, Tailwind (live, dummy data)
  backend/      # Java + Spring Boot (planned, placeholder for now)
  docs/         # shared documentation
  AGENTS.md     # contributor and AI-assistant guide
```

## Getting started (frontend)

You need [Bun](https://bun.com) installed.

```bash
cd apps/web
bun install
bun run dev        # http://localhost:5173
```

Other useful commands from `apps/web`:

```bash
bun run build      # production build
bun run typecheck  # strict TypeScript check
bun run preview    # serve the production build
```

## Backend

The backend will be Java with Spring Boot, organized as a multi-module project (API, webhook
receiver, scan orchestration, per-domain workers, enrichment, and a GitHub App client). It is not
implemented yet. The architecture, data model, and GitHub integration approach are documented in
`local/docs/architecture.md` and `local/docs/arch_mermaid.md`.

## Contributing

We would love your help. Start with [CONTRIBUTING.md](CONTRIBUTING.md) for how to set up, branch,
and open a pull request. By taking part you agree to our
[Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Found a vulnerability? Please do not open a public issue. See [SECURITY.md](SECURITY.md) for how
to report it privately. Cleat is a security product, so we take this seriously.

## License

Cleat is proprietary software. See [LICENSE](LICENSE). All rights reserved.
