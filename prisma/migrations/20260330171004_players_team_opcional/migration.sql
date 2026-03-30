-- DropForeignKey
ALTER TABLE "Players" DROP CONSTRAINT "Players_id_time_fkey";

-- AlterTable
ALTER TABLE "Players" ALTER COLUMN "id_time" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Players" ADD CONSTRAINT "Players_id_time_fkey" FOREIGN KEY ("id_time") REFERENCES "Teams"("id_time") ON DELETE SET NULL ON UPDATE CASCADE;
