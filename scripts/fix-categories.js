const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Провери всички подкатегории с кирилски slug
  const subs = await prisma.subcategory.findMany({
    select: { id: true, name: true, slug: true, categoryId: true }
  })
  
  const bad = subs.filter(s => /[а-яА-ЯёЁ]/.test(s.slug))
  console.log('Подкатегории с кирилски slug:', JSON.stringify(bad, null, 2))
  
  await prisma.$disconnect()
}

main()