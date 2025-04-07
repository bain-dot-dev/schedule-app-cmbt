import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Find the reset token
    const resetToken = await prisma.verificationToken.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          include: {
            emails: true,
          },
        },
      },
    })

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Clear the token (it's been used)
    await prisma.verificationToken.update({
      where: { verificationTokenID: resetToken.verificationTokenID },
      data: {
        verificationToken: undefined,
        verificationTokenExpires: null,
      },
    })

    return NextResponse.json({ success: true, message: "Email verified successfully" })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ error: "Failed to verify email" }, { status: 500 })
  }
}

