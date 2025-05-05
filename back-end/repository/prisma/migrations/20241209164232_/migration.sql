/*
  Warnings:

  - You are about to drop the column `captainOfTeamId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_captainOfTeamId_fkey";

-- DropIndex
DROP INDEX "User_captainOfTeamId_key";

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "zipCode" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "captainOfTeamId",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER';
