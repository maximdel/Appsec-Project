/*
  Warnings:

  - You are about to drop the column `score` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "score";
