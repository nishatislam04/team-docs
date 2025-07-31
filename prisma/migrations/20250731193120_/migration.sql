-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "projectScope" TEXT,
ALTER COLUMN "scope" DROP NOT NULL;
