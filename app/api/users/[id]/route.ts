import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { userID: id },
      include: {
        emails: true,
      },
    });

    const courseProgram = await prisma.courseProgram.findUnique({
      where: { courseProgramID: user?.courseProgramID ?? undefined },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      userID: user.userID,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.emails?.email || "",
      courseProgramID: courseProgram?.courseProgramID,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params;
    const data = await request.json();

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { userID: id },
      include: {
        emails: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is being changed and if it's already in use by another user
    if (existingUser.emails?.email !== data.email) {
      const existingEmail = await prisma.email.findUnique({
        where: { email: data.email },
      });

      if (existingEmail && existingEmail.userID !== id) {
        return NextResponse.json(
          { error: "Email already in use by another user" },
          { status: 409 }
        );
      }
    }

    // Check if course program exists
    // const course = await prisma.courseProgram.findUnique({
    //   where: { courseProgramID: data.courseProgramID },
    // });

    // Update user with transaction to ensure all related records are updated
    await prisma.$transaction(async (prisma) => {
      // Update user
      await prisma.user.update({
        where: { userID: id },
        data: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          isAdmin: data.isAdmin || false,
          isActive: data.isActive || false,
          courseProgramID: data.courseProgramID || null,
        },
      });

      // Update email if it exists, otherwise create it
      if (existingUser.emails) {
        await prisma.email.update({
          where: { userID: id },
          data: { email: data.email },
        });
      } else {
        await prisma.email.create({
          data: {
            userID: id,
            email: data.email,
          },
        });
      }

      // Update password if provided
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const existingPassword = await prisma.password.findUnique({
          where: { userID: id },
        });

        if (existingPassword) {
          await prisma.password.update({
            where: { userID: id },
            data: { password: hashedPassword },
          });
        } else {
          await prisma.password.create({
            data: {
              userID: id,
              password: hashedPassword,
            },
          });
        }
      }
    });

    return NextResponse.json({
      userID: id,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   try {
//     const id = params.id

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { userID: id },
//     })

//     if (!existingUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Delete user and all related records with transaction
//     await prisma.$transaction(async (prisma) => {
//       // Delete reset tokens
//       await prisma.resetToken.deleteMany({
//         where: { userID: id },
//       })

//       // Delete passwords
//       await prisma.password.deleteMany({
//         where: { userID: id },
//       })

//       // Delete emails
//       await prisma.email.deleteMany({
//         where: { userID: id },
//       })

//       // Delete user
//       await prisma.user.delete({
//         where: { userID: id },
//       })
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting user:", error)
//     return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
//   }
// }
