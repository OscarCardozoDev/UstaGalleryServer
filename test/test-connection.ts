import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const result = await prisma.$queryRaw`SELECT current_user, session_user, current_schema()`;
  console.log("Conexión Prisma OK:", result);
}

main().catch(console.error);
