const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.category.updateMany({ where: { slug: 'remonti' }, data: { icon: '/images/categories/stroitelstvo.png' } })
  await prisma.category.updateMany({ where: { slug: 'pochistvane' }, data: { icon: '/images/categories/pochistvane.png' } })
  await prisma.category.updateMany({ where: { slug: 'montaj' }, data: { icon: '/images/categories/mebeli.png' } })
  await prisma.category.updateMany({ where: { slug: 'gradina' }, data: { icon: '/images/categories/gradina.png' } })
  console.log('Done!')
  await prisma.$disconnect()
}

main()