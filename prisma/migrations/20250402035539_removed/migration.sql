/*
  Warnings:

  - You are about to drop the column `sectionID` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `sectionCourseID` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_sectionID_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "sectionID",
ADD COLUMN     "sectionCourseID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_sectionCourseID_fkey" FOREIGN KEY ("sectionCourseID") REFERENCES "SectionCourse"("SectionCourseID") ON DELETE RESTRICT ON UPDATE CASCADE;
