import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"
import { sendPasswordResetEmail } from "@/lib/email"

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { email } = data

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find the user by email
    const userEmail = await prisma.email.findUnique({
      where: { email },
      include: {
        user: true,
      },
    })

    // We don't want to reveal if an email exists or not for security reasons
    // So we'll always return success, even if the email doesn't exist
    if (!userEmail) {
      return NextResponse.json({ success: true })
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // 1 hour expiration

    // Save the reset token
    await prisma.resetToken.upsert({
      where: { userID: userEmail.userID },
      update: {
        resetToken: token,
        resetTokenExpires: expires,
      },
      create: {
        userID: userEmail.userID,
        resetToken: token,
        resetTokenExpires: expires,
      },
    })

    // Send the password reset email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 })
  }
}

