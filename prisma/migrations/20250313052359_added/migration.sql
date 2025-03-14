/*
  Warnings:

  - A unique constraint covering the columns `[courseCode]` on the table `CourseProgram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseProgram]` on the table `CourseProgram` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roomNumber]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sectionName]` on the table `Section` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectName]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectCode]` on the table `Subject` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "roomNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgram_courseCode_key" ON "CourseProgram"("courseCode");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgram_courseProgram_key" ON "CourseProgram"("courseProgram");

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Section_sectionName_key" ON "Section"("sectionName");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subjectName_key" ON "Subject"("subjectName");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subjectCode_key" ON "Subject"("subjectCode");
