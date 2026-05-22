import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("server connect via prisma");
  } catch (err) {
    console.log(`Disconnected server ${err.message}`);
  }
};

const disconnectDb = async () => {
  await prisma.$disconnect();
  process.exit(1);
};

export { prisma, connectDb, disconnectDb };
