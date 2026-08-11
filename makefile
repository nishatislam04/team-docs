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
	bunx prisma migrate reset

# Seed DB
seed:
	bunx prisma db seed

# Apply migration in production (safe)
deploy:
	bunx prisma migrate deploy

# Run development server
dev:
	bunx prisma generate
	bun --bun run dev

studio:
	bunx prisma studio --browser none --port 5555

build:
	bun run build

start:
	bun run start

preview:
	bun run deploy:preview

production:
	bun run deploy:prod
