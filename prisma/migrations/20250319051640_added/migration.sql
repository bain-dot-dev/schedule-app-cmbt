/*
  Warnings:

  - You are about to drop the column `courseProgramID` on the `Section` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sectionName]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_courseProgramID_fkey";

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "courseProgramID";

-- CreateTable
CREATE TABLE "SectionCourse" (
    "SectionCourseID" TEXT NOT NULL,
    "sectionID" TEXT NOT NULL,
    "courseProgramID" TEXT NOT NULL,

    CONSTRAINT "SectionCourse_pkey" PRIMARY KEY ("SectionCourseID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Section_sectionName_key" ON "Section"("sectionName");

-- AddForeignKey
ALTER TABLE "SectionCourse" ADD CONSTRAINT "SectionCourse_sectionID_fkey" FOREIGN KEY ("sectionID") REFERENCES "Section"("sectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SectionCourse" ADD CONSTRAINT "SectionCourse_courseProgramID_fkey" FOREIGN KEY ("courseProgramID") REFERENCES "CourseProgram"("courseProgramID") ON DELETE RESTRICT ON UPDATE CASCADE;
