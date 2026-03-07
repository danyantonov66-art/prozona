const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  const email = "admin@prozona.bg"
  const password = "Admin123456!"
  const name = "Admin"

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    const updated = await prisma.user.update({
      where: { email },
      data: {
        name,
        password: hashedPassword,
        role: "ADMIN"
      }
    })

    console.log("Admin updated:", {
      id: updated.id,
      email: updated.email,
      role: updated.role
    })
    return
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log("Admin created:", {
    id: user.id,
    email: user.email,
    role: user.role
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })