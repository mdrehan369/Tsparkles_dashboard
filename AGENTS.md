# AGENTS.md

Next.js 16 App Router admin dashboard (products/categories/orders), React 19, Tailwind v4, Prisma 7 + Postgres. Package manager: **pnpm**.

## Commands

```sh
pnpm check        # tsc --noEmit — THE typecheck
pnpm db:generate  # prisma generate (required after install/clone)
pnpm db:migrate   # none exists — run `pnpm exec prisma migrate dev --name <x>`
pnpm dev          # next dev
```

Gotchas:
- `next build` will NOT catch type errors (`typescript.ignoreBuildErrors: true` in next.config.mjs). Always verify with `pnpm check`.
- `lib/generated/prisma` is gitignored. Run `pnpm db:generate` before `pnpm check`, and after every `schema.prisma` change (imports of `@/lib/generated/prisma/client` fail otherwise).
- `pnpm lint` fails: eslint is configured nowhere and not installed. Don't rely on it.
- No test runner exists.

## Git traps

- `.gitignore` contains `/prisma`. Only `prisma/schema.prisma` is tracked (force-added); **new migration folders from `prisma migrate dev` are silently ignored** — add them with `git add -f prisma/migrations/<timestamp>_<name>`.
- Husky pre-commit runs `pnpm test`, but there is no `test` script, so the hook exits 1 and blocks every commit. Use `git commit --no-verify`.

## Architecture

Request flow for data changes:

- `app/api/v1/**/route.ts` — route handlers. Export `GET`/`POST`/etc., wrap the handler in `asyncHandler` (utils/asyncHandler.ts — maps ZodError to 400, Error.message to response). Validate input with schemas from root-level `zod/`, then call repositories.
- `repositories/` — the ONLY layer touching Prisma directly.
- `actions/*.ts` — `'use server'` server actions orchestrating repositories + ImageKit asset ops (utils/upload.ts).
- `queries/*.ts` — client-side axios fetchers (config/axiosConfig.ts) consumed by TanStack Query; query keys live in constants/querykeys.ts.
- `utils/txHandler.ts` — wrapper for multi-step writes needing `prisma.$transaction`.

Other wiring:
- Route groups: `app/(auth)/auth/signin` (public) and `app/(main)/` dashboard. `(main)/Provider.tsx` mounts React Query, ImageKitProvider, Toaster, and the dashboard layout.
- Auth: JWT in `accessToken` cookie (sign/verify in utils/auth.ts, creds from ADMIN_EMAIL/ADMIN_PASSWORD env). `middleware.ts` redirects unauthenticated users on ALL routes except `_next|favicon|api` — **API routes under /api have no auth checks**; don't assume middleware covers them.
- Prisma client singleton at lib/prisma.ts uses the `@prisma/adapter-pg` driver adapter (required in Prisma v7). Import model types from `@/lib/generated/prisma/client`.
- Path alias `@/*` maps to repo root (not src/).

## Style

Prettier is configured (.prettierrc) but NOT installed as a dependency — match its rules manually: 4-space indent, single quotes (including JSX), printWidth 100, es5 trailing commas, semicolons.
