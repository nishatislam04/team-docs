import { PrismaClient } from "@/generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

/** @type {import('@prisma/client').PrismaClient} */
// eslint-disable-next-line import-x/no-mutable-exports
let prisma;

// Explicit toggle so local production runs (bun run start) can bypass Accelerate
const useAccelerate = process.env.PRISMA_USE_ACCELERATE === "true";

// Decide which URL to use for PrismaClient
// If not using Accelerate, prefer DIRECT_DATABASE_URL, else attempt to coerce prisma+ scheme into postgresql
const resolvedUrl = useAccelerate ? process.env.DATABASE_URL : process.env.PREVIEW_DATABASE_URL;

const basePrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        // Fall back to env-driven resolution if resolvedUrl is undefined
        url: resolvedUrl || process.env.PREVIEW_DATABASE_URL || process.env.DATABASE_URL,
      },
    },
  });

if (useAccelerate) {
  prisma = basePrisma.$extends(withAccelerate());
} else {
  prisma = basePrisma;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
