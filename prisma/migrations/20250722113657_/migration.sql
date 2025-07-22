/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'DEVELOPER', 'VIEWER', 'PROJECT_MANAGER', 'SUPPORT');

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "name" SET DEFAULT 'DEVELOPER';

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
