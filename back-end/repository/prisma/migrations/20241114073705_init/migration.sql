-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COACH', 'CAPTAIN', 'PLAYER', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "coachOfTeamId" INTEGER,
    "captainOfTeamId" INTEGER,
    "playerOfTeamId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "score" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchTeam" (
    "matchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "MatchTeam_pkey" PRIMARY KEY ("matchId","teamId")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_coachOfTeamId_key" ON "User"("coachOfTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "User_captainOfTeamId_key" ON "User"("captainOfTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "User_playerOfTeamId_key" ON "User"("playerOfTeamId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coachOfTeamId_fkey" FOREIGN KEY ("coachOfTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_captainOfTeamId_fkey" FOREIGN KEY ("captainOfTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_playerOfTeamId_fkey" FOREIGN KEY ("playerOfTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTeam" ADD CONSTRAINT "MatchTeam_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchTeam" ADD CONSTRAINT "MatchTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
