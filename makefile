.PHONY: size

BUN = bun

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

# Run development environment
dev:
	npx prisma generate
	npm run local-dev

build: 
	npx build

start:
	npx start

preview: 
	npx deploy:preview

production: 
	npx deploy:prod

## ----------------------------
## BUN
## ----------------------------

# Install dependencies (respect package.json + bun.lockb)
bun-install:
	npx install

# Install fresh (clear lockfile + reinstall)
bun-reinstall:
	rm -f bun.lockb
	rm -rf node_modules
	npx install

# Upgrade all dependencies
bun-upgrade:
	npx update

# Show outdated packages
bun-outdated:
	npx outdated
