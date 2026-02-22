import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT current_user, session_user, current_schema()`;
  console.log("Conexión Prisma OK:", result);
}

main().catch(console.error);
