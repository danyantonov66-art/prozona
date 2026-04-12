const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const specialist = await prisma.specialist.findFirst({
    include: { user: true, SpecialistCategory: true }
  })

  // Намери Лино Спасов
  const lino = await prisma.user.findFirst({
    where: { name: { contains: 'Лино' } },
    include: { specialist: { include: { SpecialistCategory: true } } }
  })

  if (lino?.specialist) {
    // Изтрий старата категория
    await prisma.specialistCategory.deleteMany({
      where: { specialistId: lino.specialist.id }
    })
    // Добави в Ремонти и майстори (id: 9) / Довършителни ремонти (id: 35)
    await prisma.specialistCategory.create({
      data: {
        specialistId: lino.specialist.id,
        categoryId: 9,
        subcategoryId: 35,
      }
    })
    console.log('✓ Лино Спасов преместен в Ремонти!')
  } else {
    console.log('Не е намерен')
  }

  await prisma.$disconnect()
}

main()