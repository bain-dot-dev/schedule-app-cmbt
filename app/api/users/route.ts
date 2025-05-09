import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from the URL
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalItems = await prisma.user.count();

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        emails: true,
        courseProgram: true,
      },
      orderBy: {
        lastName: "asc",
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);

    // Transform the data to include all necessary information
    const formattedUsers = users.map((user) => ({
      userID: user.userID,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.emails?.email || "",
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      courseProgramID: user.courseProgram?.courseProgramID,
      courseProgram: user.courseProgram?.courseProgram,
      courseCode: user.courseProgram?.courseCode,
    }));

    return NextResponse.json({
      data: formattedUsers,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.email.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the user with transaction to ensure all related records are created
    const result = await prisma.$transaction(async (prisma) => {
      // Create user
      const user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          isAdmin: data.isAdmin || false,
          isActive: data.isActive || true,
          courseProgramID: data.courseProgramID || null,
        },
      });

      // Create email
      const email = await prisma.email.create({
        data: {
          userID: user.userID,
          email: data.email,
        },
      });

      // Create password
      await prisma.password.create({
        data: {
          userID: user.userID,
          password: hashedPassword,
        },
      });

      // If verification email should be sent, create a reset token for verification
      if (data.sendVerificationEmail) {
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date();
        expires.setHours(expires.getHours() + 24); // 24 hour expiration

        await prisma.verificationToken.create({
          data: {
            userID: user.userID,
            verificationToken: token,
            verificationTokenExpires: expires,
          },
        });

        // Send verification email
        await sendVerificationEmail(data.email, token);
      }

      return { user, email };
    });

    return NextResponse.json(
      {
        userID: result.user.userID,
        firstName: result.user.firstName,
        middleName: result.user.middleName,
        lastName: result.user.lastName,
        email: result.email.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
