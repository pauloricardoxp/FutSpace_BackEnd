-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'ongoing', 'finished');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('linha', 'goleiro');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('goal', 'assist');

-- CreateTable
CREATE TABLE "Users" (
    "id_usuario" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Matches" (
    "id_matches" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(50),
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_minutes" INTEGER NOT NULL,
    "num_teams" INTEGER NOT NULL,
    "players_per_team" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id_matches")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id_time" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "id_matches" INTEGER NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id_time")
);

-- CreateTable
CREATE TABLE "Players" (
    "id_players" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "position" "Position" NOT NULL,
    "is_guest" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER,
    "id_matches" INTEGER NOT NULL,
    "id_time" INTEGER NOT NULL,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id_players")
);

-- CreateTable
CREATE TABLE "Events" (
    "id_events" SERIAL NOT NULL,
    "type" "Type" NOT NULL,
    "minute" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_matches" INTEGER NOT NULL,
    "id_player" INTEGER NOT NULL,
    "id_assistido" INTEGER,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id_events")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Users"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_id_matches_fkey" FOREIGN KEY ("id_matches") REFERENCES "Matches"("id_matches") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Users"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_id_matches_fkey" FOREIGN KEY ("id_matches") REFERENCES "Matches"("id_matches") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_id_time_fkey" FOREIGN KEY ("id_time") REFERENCES "Teams"("id_time") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_id_matches_fkey" FOREIGN KEY ("id_matches") REFERENCES "Matches"("id_matches") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_id_player_fkey" FOREIGN KEY ("id_player") REFERENCES "Players"("id_players") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_id_assistido_fkey" FOREIGN KEY ("id_assistido") REFERENCES "Players"("id_players") ON DELETE SET NULL ON UPDATE CASCADE;
