-- CreateEnum
CREATE TYPE "PermissionStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "status" "PermissionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "workspaceId" TEXT;
