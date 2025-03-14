import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { SessionData, sessionOptions } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const lookForEmail = await prisma.email.findUnique({ where: { email } });

    const user = await prisma.user.findUnique({
      where: { userID: lookForEmail?.userID },
    });

    const lookForPassword = await prisma.password.findUnique({
      where: { userID: lookForEmail?.userID },
    });

    if (
      !lookForPassword ||
      !(await bcrypt.compare(password, lookForPassword.password))
    ) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      message: "Logged in Successfully",
      email: lookForEmail?.email,
    });

    const userData = await prisma.user.findUnique({
      where: { userID: user?.userID },
    });

    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    session.userid = userData?.userID;
    session.firstname = userData?.firstName;
    session.middlename = userData?.middleName ?? undefined;
    session.lastname = userData?.lastName;
    session.email = lookForEmail?.email;
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
