import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = "admin@prozona.bg";
const password = "Admin12345!";
const name = "Admin";

async function main() {
  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, password: hash, role: "ADMIN" },
    create: { email, name, password: hash, role: "ADMIN" },
  });

  console.log("ADMIN READY:", { email: user.email, role: user.role });
}

main().finally(async () => prisma.$disconnect());
