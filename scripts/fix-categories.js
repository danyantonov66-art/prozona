const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.subcategory.findFirst({
    where: { categoryId: 4, slug: 'gtp' }
  })

  if (!existing) {
    await prisma.subcategory.create({
      data: {
        categoryId: 4,
        name: 'ГТП (Годишни технически прегледи)',
        slug: 'gtp',
        description: 'Годишни технически прегледи на автомобили',
        updatedAt: new Date(),
      }
    })
    console.log('Добавено!')
  } else {
    console.log('Вече съществува!')
  }

  await prisma.$disconnect()
}

main()