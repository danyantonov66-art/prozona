const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const updates = [
    { name: 'Транспорт и хамали', icon: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
    { name: 'Мебели и интериор', icon: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
    { name: 'IT и компютри', icon: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800' },
    { name: 'Красота и здраве', icon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800' },
  ]

  for (const u of updates) {
    await prisma.category.update({
      where: { name: u.name },
      data: { icon: u.icon }
    })
    console.log(`✓ ${u.name}`)
  }
}

main().finally(() => prisma.$disconnect())