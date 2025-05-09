-- AlterTable
ALTER TABLE "User" ADD COLUMN     "courseProgramID" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_courseProgramID_fkey" FOREIGN KEY ("courseProgramID") REFERENCES "CourseProgram"("courseProgramID") ON DELETE SET NULL ON UPDATE CASCADE;
