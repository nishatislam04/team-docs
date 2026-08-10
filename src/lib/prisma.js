import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/client/client";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

/** @type {import('@/generated/client/client').PrismaClient} */
let prisma;

// Prisma 7: a driver adapter is required to connect to the database.
// DATABASE_URL points to the local Postgres from docker-compose.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
