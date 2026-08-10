# 🔧 Change Summary

All work below lives on branch **`feat/update-stack`** (12 commits on top of `main`).
Main was left untouched — every work item is its own commit so anything can be reverted independently.

---

## 1. 📦 Dependency upgrades (commit `d1a38d3`)

Everything updated to latest via `bun update --latest` — **`bun outdated` now reports 0 outdated packages**.

| Package | Before | After |
| ------- | ------ | ----- |
| Next.js | 16.0.3 | 16.3.0 |
| React / ReactDOM | 19.2.0 | 19.2.8 |
| TypeScript | 5.9 | 7.0 |
| Prisma | 6.19 | 7.9.1 |
| Tiptap | 2.27 | 3.29 |
| Zod | 3.25 | 4.4 |
| Framer Motion | 12 | 13 |
| lucide-react | 0.5 | 1.3 |
| Tailwind | 4.1 | 4.3 |
| ESLint / Next lint | — | pinned 9.39.5 (see below) |

### Breaking-change fixes required by the majors

- **next-auth** pinned to `5.0.0-beta.32` — bun grabbed v4 (stable) which *downgraded* the v5-beta API the app uses.
- **Prisma 7 migration** (biggest change):
  - `schema.prisma`: `prisma-client-js` → `prisma-client` generator with explicit `output`
  - `prisma.config.js`: added `datasource.url` (required in Prisma 7)
  - `src/lib/prisma.js` + `prisma/seed.js`: rewritten for the new client/adapter (see §2)
  - Removed deprecated `@prisma/nextjs-monorepo-workaround-plugin` and `--no-engine` from build
- **TypeScript 7**: tsconfig modernized (`module: esnext` + `bundler`, removed `baseUrl`/`node10`)
- **Tiptap 3**: `TextStyle` is now a named export; `BubbleMenu` moved to `@tiptap/react/menus` with floating-ui `options` (replaces tippy)
- **lucide-react 1.x**: brand icons removed → replaced with generic equivalents in `FooterSocials.jsx`
- **ESLint** pinned to 9.39.5 — eslint-plugin-react has no ESLint-10-compatible release yet (later replaced by Biome, see §5)

---

## 2. 🐳 Local Postgres + Redis via docker compose (commit `3a140de`)

- **`docker-compose.yml`** (new): `postgres:18-alpine` + `redis:8-alpine` — works with both podman and docker
  - healthchecks for both services, named volumes, `restart: unless-stopped`
  - Postgres 18 mount point convention (`/var/lib/postgresql`)
- **`.env` / `.env.example`**: `DATABASE_URL` → `postgresql://teamdocs:teamdocs@localhost:5432/teamdocs`, added `REDIS_URL`, **removed the old Prisma `prisma+postgres://` URL**
- **Prisma driver**: switched from Accelerate (`withAccelerate()`/`accelerateUrl`) to **`@prisma/adapter-pg`** — plain Postgres URL, no accelerator service needed
- Scripts: `db:up` / `db:down` / `db:restart`, `local-dev` starts DB + Prisma Studio + Next dev
- `makefile`: `db-up`/`db-down`/`db-restart` targets; `make dev` fixed

---

## 3. 📖 README rewrite (commit `575c5c6`)

- Simple, short quick-start: install bun → `bun install` → `cp .env.example .env` → `docker compose up -d` → migrate/seed → `make dev`
- Tech stack table + useful commands reference
- Troubleshooting note for podman stale-container errors

---

## 4. 🧹 Markdown linting with rumdl (commit `3c453cd`)

- Added `rumdl` (dev dep) + `.rumdl.toml`
- Scripts: `lint:md` / `lint:md:fix`
- Auto-fixed markdown issues in maintained files; legacy `docs/` excluded (pre-existing content issues)

---

## 5. 🚀 ESLint + Prettier → Biome (commit `51ef4c5` + `2b62215`)

- **Removed** all eslint/prettier deps and configs (`eslint.config.js`, `.prettierrc`)
- **Added** `@biomejs/biome` with `biome.json`:
  - 2-space formatting, double quotes, trailing commas, line width 100
  - Tailwind CSS directive support
  - Excludes: `src/generated`, `.next`, `node_modules`, `docs`, `assets`, `public`
  - Noisy rules (a11y, correctness) downgraded to `warn` — `bun run lint` exits 0 out of the box
- Auto-formatted the whole `src/` tree; removed stale `eslint-disable` comments
- Scripts: `lint` / `lint:fix` / `format` / `check`
- Removed accidentally-installed `i` package

---

## 6. 🗑️ Cleanup (commits `a619ee0`, `389be1b`, `48cafcc`)

- Deleted `.windsurf/` and `.vscode/` editor dirs
- Removed stale npm `package-lock.json` (project uses `bun.lock`)
- Removed unused `PRISAMA_STUDIO_URL` env var (typo'd leftover)
- Fixed `make build/start/preview/production` (were broken `npx` aliases → `bun run`)

---

## 7. 🛠️ Next.js 16.3 config warnings (commit `c09c803`)

- `experimental.browserDebugInfoInTerminal` → **`logging.browserToTerminal: true`** (moved out of `experimental`; the old depth/edge options no longer exist in 16.3)
- Removed `experimental.useCache: true` (redundant — `cacheComponents` already enables `"use cache"`)

---

## 8. 🐘 Podman stale-container fix (commit `f9b1d8a`)

- Plain `podman-compose up` (foreground) can fail with *"cannot start an already running container"* when containers are left half-started
- Added **`db:restart`** script + **`make db-restart`** (`down && up -d`) as the one-shot recovery
- README now warns: always use `up -d` (detached)

---

## 9. 🔒 No console logs in production browser (commit `c1d8aec`)

- **Removed** stray `console.log` from client components:
  - `ProfileMenu.jsx` — was dumping the whole user session object to the browser console
  - `PermissionManage.jsx` — admin permissions debug log
- **Hardened `src/lib/Logger.js`**: production gate now checks `process.env.NODE_ENV` (statically inlined by Next for both client & server bundles) instead of `NEXT_PUBLIC_NODE_ENV` (which was unset in production → logs could fire in the browser). Logger is imported by ~40 files including client components, so this was the real leak vector.
- **Biome enforcement**: `suspicious/noConsole` as **error** (allows `warn`/`error` for error reporting), with overrides for `Logger.js` + `prisma/seed.js` (intentional server-side logging). Future `console.log`/`debug`/`info` anywhere fails `bun run lint`.

---

## ✅ Validation status

| Check | Result |
| ----- | ------ |
| `bun run build` | ✅ compiled successfully |
| `tsc --noEmit` | ✅ |
| `bun run lint` (Biome) | ✅ 0 errors (161 pre-existing warnings) |
| `bun run lint:md` (rumdl) | ✅ no issues |
| `prisma validate` | ✅ |
| `docker compose config` | ✅ valid |
| DB containers (podman) | ✅ both healthy, ports 5432/6379 |
| Seed against local Postgres | ✅ applied |

---

## ⚠️ Notes for you

- **Stale shell env**: your current shell has an old exported `DATABASE_URL` from the Prisma-Postgres era — open a fresh terminal or `unset DATABASE_URL` so `.env` is used.
- **Vercel**: set `DATABASE_URL` + `REDIS_URL` to your hosted Postgres/Redis in production env vars (no `prisma+postgres://` URLs anymore).
- **Restart dev server** after the next.config change to pick up the new options.
