/*
  Warnings:

  - Added the required column `teamId` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Goal" DROP CONSTRAINT "Goal_matchId_fkey";

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "score" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_matchId_teamId_fkey" FOREIGN KEY ("matchId", "teamId") REFERENCES "MatchTeam"("matchId", "teamId") ON DELETE CASCADE ON UPDATE CASCADE;
