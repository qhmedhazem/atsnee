const { hashSync } = require("bcryptjs");

const { PrismaClient } = require("@prisma/client");
const { config } = require("dotenv");
config();

const prisma = new PrismaClient();

async function main() {
  // Example seed data
  await prisma.user.update({
    where: {
      email: "ahmedhazemcoding@gmail.com",
    },
    data: {
      avatarURL: "/landing2.jpg",
    },
  });
  // Add more seeding logic as needed
  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
