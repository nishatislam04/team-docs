# 🧩 team-docs

A collaborative documentation platform built with Next.js, Prisma, and Tiptap.

## 🛠️ Tech Stack

| Layer       | Tool                          |
| ----------- | ----------------------------- |
| Framework   | Next.js (App Router)          |
| Database    | PostgreSQL 18 (docker compose)|
| ORM         | Prisma 7                      |
| Cache       | Redis 8 (docker compose)      |
| Package Mgr | Bun                           |
| Styling     | Tailwind CSS v4 + Shadcn UI   |
| Editor      | Tiptap (RTE)                  |
| Linting     | Biome + rumdl (markdown)      |

## 🚀 Quick Start

```bash
# 1. Install bun (if you don't have it)
curl -fsSL https://bun.sh/install | bash

# 2. Install dependencies
bun install

# 3. Copy env file
cp .env.example .env

# 4. Start Postgres + Redis (podman or docker)
docker compose up -d     # or: podman compose up -d

# 5. Apply migrations + seed
npx prisma migrate deploy
npx prisma db seed

# 6. Run the app (starts DB + prisma studio + next dev)
make dev
```

Then open **<http://localhost:3000**>.

## 🗄️ Database

- **Postgres**: `localhost:5432` (db: `teamdocs`, user/pass: `teamdocs/teamdocs`)
- **Redis**: `localhost:6379`
- Manage containers: `make db-up` / `make db-down`
- Reset database: `make reset` (⚠️ deletes all data)

> For production (Vercel), set `DATABASE_URL` and `REDIS_URL` to your hosted
> Postgres/Redis (e.g. Neon, Upstash). No code changes needed.

## 🧰 Useful Commands

| Command          | What it does                         |
| ---------------- | ------------------------------------ |
| `make dev`       | Start everything for development     |
| `make migrate`   | Create + apply a new migration       |
| `make generate`  | Regenerate Prisma client             |
| `make seed`      | Seed the database                    |
| `make build`     | Production build                     |
| `bun run lint`   | Lint code (Biome)                    |
| `bun run check`  | Lint + format (Biome, auto-fix)      |
| `bun run lint:md`| Lint markdown (rumdl)                |

## ✅ You're all set

![Homepage Screenshot](assets/homepage.png)
