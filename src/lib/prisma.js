import { PrismaClient } from "@/generated/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Create a global reference to reuse Prisma client
const globalForPrisma = global;

/** @type {import('@prisma/client').PrismaClient} */
// eslint-disable-next-line import-x/no-mutable-exports
let prisma;

const useAccelerate = process.env.PRISMA_USE_ACCELERATE === "true";
const isPreview = process.env.IS_PREVIEW === "true";

const resolvedUrl = isPreview
  ? process.env.PREVIEW_DATABASE_URL
  : useAccelerate
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL;

// const resolvedUrl = useAccelerate
//   ? process.env.DATABASE_URL
//   : process.env.NODE_ENV === "development"
//     ? process.env.DATABASE_URL
//     : isPreview
//       ? process.env.PREVIEW_DATABASE_URL
//       : process.env.DATABASE_URL;

const basePrisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedUrl,
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
