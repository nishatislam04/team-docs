.PHONY: size

BUN = bun

# Start local database (Postgres + Redis via docker compose)
db-up:
	docker compose up -d

# Stop local database
db-down:
	docker compose down

# Restart local database (fixes stale podman container state)
db-restart:
	docker compose down && docker compose up -d

# Run dev migration with timestamp
migrate:
	npx prisma migrate dev

# Push schema directly to DB
push:
	npx prisma db push

# Generate Prisma client
generate:
	npx prisma generate

# Reset DB (DANGEROUS)
reset:
	npx prisma migrate reset --force --skip-seed

# Seed DB
seed:
	npx prisma db seed

# Apply migration in production (safe)
deploy:
	npx prisma migrate deploy

# -----------------------
# Development commands
# -----------------------

# Show project size
size:
	@echo "🔍 Project Folder Size:"
	@du -sh . | sort -h

	@echo "📦 Node Modules:"
	@du -sh node_modules 2>/dev/null || echo "node_modules not found"

# Run development environment (starts DB, prisma studio + next dev)
dev:
	npx prisma generate
	bun run local-dev

build:
	bun run build

start:
	bun run start

preview:
	bun run deploy:preview

production:
	bun run deploy:prod

## ----------------------------
## BUN
## ----------------------------

# Install dependencies
bun-install:
	bun install

# Install fresh (clear lockfile + reinstall)
bun-reinstall:
	rm -f bun.lock
	rm -rf node_modules
	bun install

# Upgrade all dependencies
bun-upgrade:
	bun update --latest

# Show outdated packages
bun-outdated:
	bun outdated
