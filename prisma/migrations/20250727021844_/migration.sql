/*
  Warnings:

  - Added the required column `action` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `scope` on the `Permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('SYSTEM', 'WORKSPACE');

-- CreateEnum
CREATE TYPE "PermissionResource" AS ENUM ('WORKSPACE', 'PROJECT', 'SECTION', 'PAGE', 'USER', 'ROLE', 'PERMISSION');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- DropIndex
DROP INDEX "Role_name_key";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "action" "PermissionAction" NOT NULL,
ADD COLUMN     "resource" "PermissionResource" NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
DROP COLUMN "scope",
ADD COLUMN     "scope" "PermissionScope" NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" DROP DEFAULT;
