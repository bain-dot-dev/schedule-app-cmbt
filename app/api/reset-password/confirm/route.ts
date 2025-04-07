import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { token, password } = data

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Find the reset token
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    })

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password
    await prisma.$transaction(async (prisma) => {
      // Update password
      await prisma.password.upsert({
        where: { userID: resetToken.userID },
        update: { password: hashedPassword },
        create: {
          userID: resetToken.userID,
          password: hashedPassword,
        },
      })

      // Clear the reset token
      await prisma.resetToken.update({
        where: { resetTokenID: resetToken.resetTokenID },
        data: {
          resetToken: null,
          resetTokenExpires: null,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}

