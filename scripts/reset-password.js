const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const newPassword = '123456'
  const hashed = await bcrypt.hash(newPassword, 10)
  
  await prisma.user.update({
    where: { email: 'r.emilov9918@mail.bg' },
    data: { password: hashed }
  })
  
  console.log('✓ Паролата е нулирана на: 123456')
}

main().finally(() => prisma.$disconnect())