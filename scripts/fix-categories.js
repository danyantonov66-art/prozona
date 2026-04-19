const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Намери предложението
  const suggestion = await prisma.categorySuggestion.findFirst({
    where: { name: { contains: 'покриви', mode: 'insensitive' }, status: 'APPROVED' },
    include: { Specialist: true }
  })
  console.log('Suggestion:', JSON.stringify(suggestion, null, 2))

  if (!suggestion?.specialistId) {
    console.log('Няма специалист')
    await prisma.$disconnect()
    return
  }

  // Намери категорията
  const cat = await prisma.category.findFirst({ where: { slug: 'remonti' } })
  console.log('Категория:', JSON.stringify(cat, null, 2))

  if (!cat) {
    console.log('Категорията не е намерена')
    await prisma.$disconnect()
    return
  }

  // Намери подкатегорията ако има
  const sub = await prisma.subcategory.findFirst({
    where: { categoryId: cat.id, name: { contains: 'покриви', mode: 'insensitive' } }
  })
  console.log('Подкатегория:', JSON.stringify(sub, null, 2))

  // Свържи специалиста
  const existing = await prisma.specialistCategory.findFirst({
    where: { specialistId: suggestion.specialistId, categoryId: cat.id }
  })

  if (!existing) {
    await prisma.specialistCategory.create({
      data: {
        specialistId: suggestion.specialistId,
        categoryId: cat.id,
        subcategoryId: sub?.id ?? null,
      }
    })
    console.log('✓ Специалистът е свързан!')
  } else {
    console.log('- Вече е свързан')
  }

  await prisma.$disconnect()
}

main()