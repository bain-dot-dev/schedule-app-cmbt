import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "test@gmail.com";

  const hashedPassword = await bcrypt.hash("test123", 10);

  const user = await prisma.user.create({
    data: {
      firstName: "John",
      middleName: "Lito",
      lastName: "Doe",
    },
  });

  await prisma.email.create({
    data: {
      userID: user.userID,
      email: email,
    },
  });

  await prisma.password.create({
    data: {
      userID: user.userID,
      password: hashedPassword,
    },
  });

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
