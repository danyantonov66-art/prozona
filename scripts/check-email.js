const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'zahari_stroi@abv.bg' },
    include: { 
      specialist: {
        include: {
          CreditTransaction: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      }
    }
  })
  console.log(JSON.stringify(user, null, 2))
}

main().finally(() => prisma.$disconnect())