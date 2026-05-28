const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // Намери специалиста
  const specialist = await p.specialist.findFirst({
    where: { user: { name: { contains: 'Ефтим' } } },
    select: { id: true }
  })
  console.log('Специалист:', specialist)

  // Намери подкатегория Геодезист
  const sub = await p.subcategory.findFirst({
    where: { slug: 'geodezist' },
    select: { id: true, categoryId: true }
  })
  console.log('Подкатегория:', sub)

  // Обнови категорията на специалиста
  await p.specialistCategory.updateMany({
    where: { specialistId: specialist.id },
    data: { subcategoryId: sub.id, categoryId: sub.categoryId }
  })
  console.log('✅ Специалистът е преместен в Геодезист')
}

main()
  .catch(e => { console.error('❌', e); process.exit(1) })
  .finally(() => p.$disconnect())