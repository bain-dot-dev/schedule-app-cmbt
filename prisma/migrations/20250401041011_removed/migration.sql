/*
  Warnings:

  - You are about to drop the column `rankID` on the `Faculty` table. All the data in the column will be lost.
  - Added the required column `rank` to the `Faculty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "rankID",
ADD COLUMN     "rank" TEXT NOT NULL;

-- DropEnum
DROP TYPE "RankEnum";
