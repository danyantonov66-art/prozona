const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.subcategory.update({ where: { id: 188 }, data: { isActive: false } })
  console.log('Done!')
  await prisma.$disconnect()
}

main()