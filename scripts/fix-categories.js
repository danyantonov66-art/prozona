const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: 'ivaylo@yahoo.com' }
  })
  console.log(JSON.stringify(user, null, 2))
  await prisma.$disconnect()
}

main()