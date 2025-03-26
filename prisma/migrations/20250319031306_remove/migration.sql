/*
  Warnings:

  - A unique constraint covering the columns `[academicYearName]` on the table `AcademicYear` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Section_sectionName_key";

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_academicYearName_key" ON "AcademicYear"("academicYearName");
