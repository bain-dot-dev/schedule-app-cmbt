/*
  Warnings:

  - You are about to drop the column `departmentID` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the column `semesterID` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Semester` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `courseCode` on the `CourseProgram` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `courseProgram` on the `CourseProgram` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `courseProgramID` to the `Faculty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CourseCode" AS ENUM ('TM', 'HM', 'EM', 'BAM_MKT', 'BAM_HRM', 'BAM_FM', 'BAM_BPO');

-- CreateEnum
CREATE TYPE "Courses" AS ENUM ('TOURISM_MANAGEMENT', 'HOSPITALITY_MANAGEMENT', 'ENTREPRENEURSHIP_MANAGEMENT', 'BUSINESS_ADMIN_MKT', 'BUSINESS_ADMIN_HRM', 'BUSINESS_ADMIN_FM', 'BUSINESS_ADMIN_BPO');

-- DropForeignKey
ALTER TABLE "Faculty" DROP CONSTRAINT "Faculty_departmentID_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_semesterID_fkey";

-- DropIndex
DROP INDEX "CourseProgram_courseCode_key";

-- DropIndex
DROP INDEX "CourseProgram_courseProgram_key";

-- AlterTable
ALTER TABLE "CourseProgram" DROP COLUMN "courseCode",
ADD COLUMN     "courseCode" "CourseCode" NOT NULL,
DROP COLUMN "courseProgram",
ADD COLUMN     "courseProgram" "Courses" NOT NULL;

-- AlterTable
ALTER TABLE "Faculty" DROP COLUMN "departmentID",
ADD COLUMN     "courseProgramID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "semesterID",
ADD COLUMN     "semester" "SemesterEnum" NOT NULL;

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "Semester";

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_courseProgramID_fkey" FOREIGN KEY ("courseProgramID") REFERENCES "CourseProgram"("courseProgramID") ON DELETE RESTRICT ON UPDATE CASCADE;
