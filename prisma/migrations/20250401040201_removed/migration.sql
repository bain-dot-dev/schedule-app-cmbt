/*
  Warnings:

  - You are about to drop the `Rank` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rankID` to the `Faculty` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RankEnum" AS ENUM ('Instructor_1', 'Instructor_2', 'Instructor_3', 'Assistant_Professor_1', 'Assistant_Professor_2', 'Assistant_Professor_3', 'Assistant_Professor_4', 'Associate_Professor_1', 'Associate_Professor_2', 'Associate_Professor_3', 'Associate_Professor_4', 'Associate_Professor_5', 'Professor_1', 'Professor_2', 'Professor_3', 'Professor_4', 'Professor_5', 'Professor_6');

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_rankID_fkey";

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "rankID",
ADD COLUMN     "rankID" "RankEnum" NOT NULL;

-- DropTable
DROP TABLE "Rank";
