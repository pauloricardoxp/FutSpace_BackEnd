CREATE TYPE "Sport" AS ENUM ('futebol');
CREATE TYPE "Category" AS ENUM ('futsal', 'society', 'campo');
CREATE TYPE "FieldPosition" AS ENUM ('goleiro', 'fixo', 'pivo', 'ala', 'zagueiro', 'lateral', 'volante', 'meia', 'atacante');

ALTER TABLE "Matches"
ADD COLUMN "sport" "Sport" NOT NULL DEFAULT 'futebol',
ADD COLUMN "category" "Category" NOT NULL DEFAULT 'society';

ALTER TABLE "Players"
ADD COLUMN "field_position" "FieldPosition",
ADD COLUMN "shirt_number" INTEGER;

CREATE TABLE "PlayerProfiles" (
    "id_profile" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "sport" "Sport" NOT NULL DEFAULT 'futebol',
    "category" "Category" NOT NULL,
    "position" "FieldPosition" NOT NULL,
    "shirt_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PlayerProfiles_pkey" PRIMARY KEY ("id_profile")
);

CREATE UNIQUE INDEX "PlayerProfiles_id_usuario_sport_category_key"
ON "PlayerProfiles"("id_usuario", "sport", "category");

ALTER TABLE "PlayerProfiles"
ADD CONSTRAINT "PlayerProfiles_id_usuario_fkey"
FOREIGN KEY ("id_usuario") REFERENCES "Users"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
