-- CreateEnum
CREATE TYPE "SemesterEnum" AS ENUM ('FIRST', 'SECOND');

-- CreateTable
CREATE TABLE "User" (
    "userID" SERIAL NOT NULL,
    "firstName" VARCHAR(25) NOT NULL,
    "middleName" VARCHAR(25),
    "lastName" VARCHAR(25) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Email" (
    "emailID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "email" VARCHAR(50) NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("emailID")
);

-- CreateTable
CREATE TABLE "Password" (
    "passwordID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "password" VARCHAR(80) NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("passwordID")
);

-- CreateTable
CREATE TABLE "ResetToken" (
    "resetTokenID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "resetToken" VARCHAR(191),
    "resetTokenExpires" TIMESTAMP(3),

    CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("resetTokenID")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "facultyID" TEXT NOT NULL,
    "employeeNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "departmentID" TEXT,
    "rankID" TEXT,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("facultyID")
);

-- CreateTable
CREATE TABLE "Department" (
    "departmentID" TEXT NOT NULL,
    "departmentName" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("departmentID")
);

-- CreateTable
CREATE TABLE "Rank" (
    "rankID" TEXT NOT NULL,
    "rankName" TEXT NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("rankID")
);

-- CreateTable
CREATE TABLE "Room" (
    "roomID" TEXT NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("roomID")
);

-- CreateTable
CREATE TABLE "CourseProgram" (
    "courseProgramID" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,
    "courseProgram" TEXT NOT NULL,

    CONSTRAINT "CourseProgram_pkey" PRIMARY KEY ("courseProgramID")
);

-- CreateTable
CREATE TABLE "Section" (
    "sectionID" TEXT NOT NULL,
    "sectionName" TEXT NOT NULL,
    "courseProgramID" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("sectionID")
);

-- CreateTable
CREATE TABLE "Subject" (
    "subjectID" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "numberOfUnits" INTEGER NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subjectID")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "scheduleID" TEXT NOT NULL,
    "facultyID" TEXT NOT NULL,
    "roomID" TEXT NOT NULL,
    "sectionID" TEXT NOT NULL,
    "subjectID" TEXT NOT NULL,
    "academicYearID" TEXT NOT NULL,
    "semesterID" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "timeStart" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("scheduleID")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "academicYearID" TEXT NOT NULL,
    "academicYearName" TEXT NOT NULL,

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("academicYearID")
);

-- CreateTable
CREATE TABLE "Semester" (
    "semesterID" TEXT NOT NULL,
    "semesterName" "SemesterEnum" NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("semesterID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_userID_key" ON "Email"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Email_email_key" ON "Email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userID_key" ON "Password"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_userID_key" ON "ResetToken"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_employeeNumber_key" ON "Faculty"("employeeNumber");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_departmentID_fkey" FOREIGN KEY ("departmentID") REFERENCES "Department"("departmentID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_rankID_fkey" FOREIGN KEY ("rankID") REFERENCES "Rank"("rankID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_courseProgramID_fkey" FOREIGN KEY ("courseProgramID") REFERENCES "CourseProgram"("courseProgramID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_facultyID_fkey" FOREIGN KEY ("facultyID") REFERENCES "Faculty"("facultyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("roomID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_sectionID_fkey" FOREIGN KEY ("sectionID") REFERENCES "Section"("sectionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectID_fkey" FOREIGN KEY ("subjectID") REFERENCES "Subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_academicYearID_fkey" FOREIGN KEY ("academicYearID") REFERENCES "AcademicYear"("academicYearID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_semesterID_fkey" FOREIGN KEY ("semesterID") REFERENCES "Semester"("semesterID") ON DELETE RESTRICT ON UPDATE CASCADE;
