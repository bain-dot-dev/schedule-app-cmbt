/*
  Warnings:

  - The primary key for the `Email` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Password` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ResetToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_userID_fkey";

-- DropForeignKey
ALTER TABLE "Password" DROP CONSTRAINT "Password_userID_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_userID_fkey";

-- AlterTable
ALTER TABLE "Email" DROP CONSTRAINT "Email_pkey",
ALTER COLUMN "emailID" DROP DEFAULT,
ALTER COLUMN "emailID" SET DATA TYPE TEXT,
ALTER COLUMN "userID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Email_pkey" PRIMARY KEY ("emailID");
DROP SEQUENCE "Email_emailID_seq";

-- AlterTable
ALTER TABLE "Password" DROP CONSTRAINT "Password_pkey",
ALTER COLUMN "passwordID" DROP DEFAULT,
ALTER COLUMN "passwordID" SET DATA TYPE TEXT,
ALTER COLUMN "userID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Password_pkey" PRIMARY KEY ("passwordID");
DROP SEQUENCE "Password_passwordID_seq";

-- AlterTable
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_pkey",
ALTER COLUMN "resetTokenID" DROP DEFAULT,
ALTER COLUMN "resetTokenID" SET DATA TYPE TEXT,
ALTER COLUMN "userID" SET DATA TYPE TEXT,
ADD CONSTRAINT "ResetToken_pkey" PRIMARY KEY ("resetTokenID");
DROP SEQUENCE "ResetToken_resetTokenID_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "userID" DROP DEFAULT,
ALTER COLUMN "userID" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");
DROP SEQUENCE "User_userID_seq";

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
