import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { SessionData, sessionOptions } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // const lookForEmail = await prisma.email.findUnique({ where: { email } });

    // const user = await prisma.user.findUnique({
    //   where: { userID: lookForEmail?.userID },
    // });

    // const lookForPassword = await prisma.password.findUnique({
    //   where: { userID: lookForEmail?.userID },
    // });

    // if (
    //   !lookForPassword ||
    //   !(await bcrypt.compare(password, lookForPassword.password))
    // ) {
    //   return NextResponse.json(
    //     { message: "Invalid email or password" },
    //     { status: 401 }
    //   );
    // }

    // Find user by email
    const userEmail = await prisma.email.findUnique({
      where: { email },
      include: {
        user: {
          include: {
            passwords: true,
            resetTokens: true,
          },
        },
      },
    });

    if (!userEmail || !userEmail.user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (userEmail.user.isActive === false) {
      return NextResponse.json(
        { message: "Account is inactive" },
        { status: 401 }
      );
    }

    // // Check if user has a reset token with a non-null resetToken field
    // // This indicates the user hasn't verified their email yet
    // const pendingVerification = userEmail.user.resetTokens.some(
    //   (token) => token.resetToken !== null && token.resetTokenExpires !== null,
    // )

    // if (pendingVerification) {
    //   return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 401 })
    // }

    // Check password
    const userPassword = userEmail.user.passwords[0];
    if (!userPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, userPassword.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      message: "Logged in Successfully",
      email: userEmail?.email,
    });

    const userData = await prisma.user.findUnique({
      where: { userID: userEmail?.userID },
    });

    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    session.userid = userData?.userID;
    session.firstname = userData?.firstName;
    session.middlename = userData?.middleName ?? undefined;
    session.lastname = userData?.lastName;
    session.email = userEmail?.email;
    session.isAdmin = userData?.isAdmin ?? false;
    session.isLoggedIn = true;
    await session.save();

    return res;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
