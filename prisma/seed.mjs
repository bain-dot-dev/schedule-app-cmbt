import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "testadmin@gmail.com";
  const adminHashedPassword = await bcrypt.hash("testadmin123", 10);

  const regularUserAdmin = "test@gmail.com";
  const regularUserHashedPassword = await bcrypt.hash("test123", 10);

  const createUserAdmin = await prisma.user.create({
    data: {
      firstName: "John",
      middleName: "Lito",
      lastName: "Doe",
      isAdmin: true,
      isActive: true,
    },
  });

  await prisma.email.create({
    data: {
      userID: createUserAdmin.userID,
      email: adminEmail,
    },
  });

  await prisma.password.create({
    data: {
      userID: createUserAdmin.userID,
      password: adminHashedPassword,
    },
  });

  const createRegularUser = await prisma.user.create({
    data: {
      firstName: "Jane",
      middleName: "Lito",
      lastName: "Doe",
      isAdmin: false,
      isActive: true,
    },
  });

  await prisma.email.create({
    data: {
      userID: createRegularUser.userID,
      email: regularUserAdmin,
    },
  });

  await prisma.password.create({
    data: {
      userID: createRegularUser.userID,
      password: regularUserHashedPassword,
    },
  });

  console.log("Successfully created admin");
  console.log("Successfully created regular user");
  console.log("🌱 Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
