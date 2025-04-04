/*
  Warnings:

  - The values [FIRST,SECOND] on the enum `SemesterEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SemesterEnum_new" AS ENUM ('First_Semester', 'Second_Semester');
ALTER TABLE "Schedule" ALTER COLUMN "semester" TYPE "SemesterEnum_new" USING ("semester"::text::"SemesterEnum_new");
ALTER TYPE "SemesterEnum" RENAME TO "SemesterEnum_old";
ALTER TYPE "SemesterEnum_new" RENAME TO "SemesterEnum";
DROP TYPE "SemesterEnum_old";
COMMIT;
