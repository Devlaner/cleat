# Contributing to Cleat

Thanks for taking the time to help out. This guide covers how to get set up, how we like changes
to come in, and a few conventions that are easy to miss.

## Before you start

- For anything beyond a small fix, open an issue first so we can agree on the approach. It saves
  everyone a round of rework.
- Found a security problem? Do not open a public issue. Follow [SECURITY.md](SECURITY.md) instead.
- By contributing, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Repository layout

Cleat is a monorepo:

- `apps/web` is the frontend (React, TypeScript, Vite, Tailwind). It is built and runs on dummy
  data today.
- `backend/` is where the Java and Spring Boot backend will live. It is a placeholder for now.

## Working on the frontend

You need [Bun](https://bun.com). Everything runs from inside `apps/web`.

```bash
cd apps/web
bun install
bun run dev        # http://localhost:5173
```

Before you push, run the checks:

```bash
bun run typecheck && bun run build
```

If you changed the UI, take a quick look in the browser (or capture a screenshot) to confirm it
looks right.

A few conventions that matter here:

- Add dependencies with `bun add` or `bun add -d`. Do not hand-edit `package.json` dependencies.
- Bump the version on a meaningful change with `npm version <patch|minor|major>
  --no-git-tag-version`, as its own commit.
- `apps/web/DESIGN.md` is the visual source of truth. Stick to the dark canvas, keep lavender as
  the single accent, and keep the severity colors out of the marketing pages.
- Avoid em dashes in copy. They read as filler here.

## Working on the backend

The backend is not built yet. The design lives in `local/docs/architecture.md`. If you want to
start on it, open an issue first so we can line up the module structure and tech choices.

## Commits and pull requests

- Keep commits small and focused. One logical change per commit reads much better in history.
- Write clear commit messages in plain language. A short summary line, then detail if it helps.
- Do not add AI attribution lines (no "Generated with" or "Co-Authored-By") to commit messages.
- Branch off `main`, push your branch, and open a pull request. Fill in the template so reviewers
  have context.
- Link the issue your change addresses.

## Reporting bugs and requesting features

Use the issue templates. Good bug reports include what you expected, what happened, and the steps
to reproduce. Good feature requests start with the problem you are trying to solve.

That is it. Thanks again for pitching in.
