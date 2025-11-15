.PHONY: size

BUN = bun

# Run dev migration with timestamp
migrate:
	bunx prisma migrate dev

# Push schema directly to DB
push:
	bunx prisma db push

# Generate Prisma client
generate:
	bunx prisma generate

# Reset DB (DANGEROUS)
reset:
	bunx prisma migrate reset --force --skip-seed

# Seed DB
seed:
	bunx prisma db seed

# Apply migration in production (safe)
deploy:
	bunx prisma migrate deploy

# -----------------------
# Development commands
# -----------------------

# Show project size
size:
	@echo "🔍 Project Folder Size:"
	@du -sh . | sort -h

	@echo "📦 Node Modules:"
	@du -sh node_modules 2>/dev/null || echo "node_modules not found"

# Run development environment
dev:
	bunx prisma generate
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

# Install dependencies (respect package.json + bun.lockb)
bun-install:
	$(BUN) install

# Install fresh (clear lockfile + reinstall)
bun-reinstall:
	rm -f bun.lockb
	rm -rf node_modules
	$(BUN) install

# Upgrade all dependencies
bun-upgrade:
	$(BUN) update

# Show outdated packages
bun-outdated:
	$(BUN) outdated
