/*
  Warnings:

  - A unique constraint covering the columns `[courseCode]` on the table `CourseProgram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseProgram]` on the table `CourseProgram` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `courseCode` on the `CourseProgram` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `courseProgram` on the `CourseProgram` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CourseProgram" DROP COLUMN "courseCode",
ADD COLUMN     "courseCode" TEXT NOT NULL,
DROP COLUMN "courseProgram",
ADD COLUMN     "courseProgram" TEXT NOT NULL;

-- DropEnum
DROP TYPE "CourseCode";

-- DropEnum
DROP TYPE "Courses";

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgram_courseCode_key" ON "CourseProgram"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgram_courseProgram_key" ON "CourseProgram"("courseProgram");
