/*
  Warnings:

  - Added the required column `isAdmin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "VerificationToken" (
    "verificationTokenID" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    "verificationToken" VARCHAR(191) NOT NULL,
    "verificationTokenExpires" TIMESTAMP(3),

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("verificationTokenID")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_userID_key" ON "VerificationToken"("userID");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
