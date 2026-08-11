# team-docs

A collaborative documentation platform built with Next.js, Prisma, and Tiptap.

## 🛠️ Tech Stack

- Framework: Next.js (App Router)
- Database: PostgreSQL 18 (docker compose)
- ORM: Prisma 7
- Cache: Redis 8 (docker compose)
- Package Manager: Bun
- Styling: Tailwind CSS v4 + Shadcn UI
- Editor: Tiptap (RTE)
- Linting: Biome + rumdl (markdown)

## 🚀 Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Copy env file
cp .env.example .env

# 3. Start docker with: Postgres + Redis
# i think we need to start it with detach (-d) for some unknown reason
podman-compose up -d     # or: `docker compose up -d`

# 4. Apply migrations + seed
make migrate
make seed

# 5. Run local dev server
make dev

# 6. Run prisma studio
make studio
```

> ⚠️ Always use `up -d` (detached). Plain `podman-compose up` can fail with
> `cannot start an already running container` when containers are left in a stale

## ✅ You're all set

![Homepage Screenshot](assets/homepage.png)
