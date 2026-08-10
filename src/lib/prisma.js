import { PrismaClient } from "@/generated/client/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

/** @type {import('@/generated/client/client').PrismaClient} */
// eslint-disable-next-line import-x/no-mutable-exports
let prisma;

const isPreview = process.env.IS_PREVIEW === "true";

const resolvedUrl = isPreview ? process.env.PREVIEW_DATABASE_URL : process.env.DATABASE_URL;

// Prisma 7: prisma+postgres:// (Prisma Postgres / Accelerate) URLs are passed
// via `accelerateUrl` and used with the Accelerate extension.
const basePrisma = globalForPrisma.prisma || new PrismaClient({ accelerateUrl: resolvedUrl });

prisma = basePrisma.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
