import { PrismaClient } from "@/generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

/** @type {import('@prisma/client').PrismaClient} */
let prisma;

const basePrisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.DATABASE_URL?.startsWith("prisma+postgres://")) {
  prisma = basePrisma.$extends(withAccelerate());
} else {
  prisma = basePrisma;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
