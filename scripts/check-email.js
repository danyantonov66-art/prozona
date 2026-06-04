const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'r.emilov9918@mail.bg' },
    include: { specialist: true }
  })
  console.log(JSON.stringify(user, null, 2))
}

main().finally(() => prisma.$disconnect())