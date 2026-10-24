-- CreateEnum
CREATE TYPE "ChampionshipSport" AS ENUM ('futebol', 'fifa');

-- CreateEnum
CREATE TYPE "ChampionshipFormat" AS ENUM ('league', 'knockout');

-- CreateEnum
CREATE TYPE "ChampionshipStatus" AS ENUM ('pending', 'ongoing', 'finished');

-- CreateTable
CREATE TABLE "Championships" (
    "id_championship" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sport" "ChampionshipSport" NOT NULL,
    "format" "ChampionshipFormat" NOT NULL DEFAULT 'league',
    "players_per_team" INTEGER NOT NULL,
    "status" "ChampionshipStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Championships_pkey" PRIMARY KEY ("id_championship")
);

-- CreateTable
CREATE TABLE "ChampionshipTeams" (
    "id_championship_team" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "id_championship" INTEGER NOT NULL,

    CONSTRAINT "ChampionshipTeams_pkey" PRIMARY KEY ("id_championship_team")
);

-- CreateTable
CREATE TABLE "Fixtures" (
    "id_fixture" SERIAL NOT NULL,
    "id_championship" INTEGER NOT NULL,
    "round_number" INTEGER NOT NULL,
    "id_team_a" INTEGER NOT NULL,
    "id_team_b" INTEGER NOT NULL,
    "id_matches" INTEGER,

    CONSTRAINT "Fixtures_pkey" PRIMARY KEY ("id_fixture")
);

-- CreateTable
CREATE TABLE "Standings" (
    "id_championship_team" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "score_for" INTEGER NOT NULL DEFAULT 0,
    "score_against" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Standings_pkey" PRIMARY KEY ("id_championship_team")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fixtures_id_matches_key" ON "Fixtures"("id_matches");

-- AddForeignKey
ALTER TABLE "Championships" ADD CONSTRAINT "Championships_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Users"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChampionshipTeams" ADD CONSTRAINT "ChampionshipTeams_id_championship_fkey" FOREIGN KEY ("id_championship") REFERENCES "Championships"("id_championship") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixtures" ADD CONSTRAINT "Fixtures_id_championship_fkey" FOREIGN KEY ("id_championship") REFERENCES "Championships"("id_championship") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixtures" ADD CONSTRAINT "Fixtures_id_team_a_fkey" FOREIGN KEY ("id_team_a") REFERENCES "ChampionshipTeams"("id_championship_team") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixtures" ADD CONSTRAINT "Fixtures_id_team_b_fkey" FOREIGN KEY ("id_team_b") REFERENCES "ChampionshipTeams"("id_championship_team") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fixtures" ADD CONSTRAINT "Fixtures_id_matches_fkey" FOREIGN KEY ("id_matches") REFERENCES "Matches"("id_matches") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standings" ADD CONSTRAINT "Standings_id_championship_team_fkey" FOREIGN KEY ("id_championship_team") REFERENCES "ChampionshipTeams"("id_championship_team") ON DELETE RESTRICT ON UPDATE CASCADE;
