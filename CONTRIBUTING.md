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
- `backend/` is the Java and Spring Boot backend, a Gradle multi-module project. It is scaffolded
  with no application code yet.

## One-time setup: git hooks

Point git at the shared hooks so your commits are checked before they land. Run this once after
cloning:

```bash
git config core.hooksPath .githooks
```

This wires up two hooks: a `commit-msg` hook that enforces Conventional Commits, and a
`pre-commit` hook that runs the formatter and linter for whichever part of the repo you touched.

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

The backend is a Gradle multi-module Spring Boot project under `backend/`. See `backend/README.md`
for the module layout. You need Java 21. Use the wrapper, so there is no need to install Gradle:

```bash
cd backend
./gradlew check            # format check, lint, compile, and test
./gradlew spotlessApply    # auto-format your code
./gradlew :apps:api:bootRun
```

Formatting is handled by Spotless (palantir-java-format) and linting by Checkstyle. If `check`
fails on formatting, run `spotlessApply` and commit the result.

## Commits and pull requests

- Keep commits small and focused. One logical change per commit reads much better in history.
- Use [Conventional Commits](https://www.conventionalcommits.org). The first line is
  `type(scope): summary`, for example `feat(api): add the health endpoint`. Valid types are feat,
  fix, docs, style, refactor, perf, test, build, ci, chore, and revert. The scope is optional, and
  a `!` before the colon marks a breaking change. The `commit-msg` hook enforces this.
- Write the summary in plain language, then add detail in the body if it helps.
- Do not add AI attribution lines (no "Generated with" or "Co-Authored-By") to commit messages.
- Branch off `main`, push your branch, and open a pull request. Fill in the template so reviewers
  have context.
- Link the issue your change addresses.

## Reporting bugs and requesting features

Use the issue templates. Good bug reports include what you expected, what happened, and the steps
to reproduce. Good feature requests start with the problem you are trying to solve.

That is it. Thanks again for pitching in.
