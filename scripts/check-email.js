const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
<<<<<<< HEAD
    where: { email: 'r.emilov9918@mail.bg' },
    include: { specialist: true }
=======
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
>>>>>>> 447ec65 (feat: show credit balance on dashboard)
  })
  console.log(JSON.stringify(user, null, 2))
}

main().finally(() => prisma.$disconnect())