const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const specialists = await prisma.specialist.findMany({
    include: { user: true, SpecialistCategory: true }
  })

  // Категории и подкатегории ID-та
  const REMONTI = 9      // Ремонти и майстори
  const POCHISTVANE = 11 // Почистване
  const MONTAJ = 12      // Монтаж и дребни услуги
  const GRADINA = 8      // Градина и двор

  // Подкатегории
  const VIK = 29
  const ELEKTRO = 30
  const BOYADISVANE = 31
  const GIPSOKARTON = 34
  const PODOVI = 59
  const KLYUCHARSKI = 60
  const DOVARSHITELNI = 35
  const REMONT_BANYA = 53
  const REMONT_POKRIVI = 181
  const KLIMATICI = 64
  const MEBELI = 41
  const HAMALI = 76

  for (const s of specialists) {
    if (s.SpecialistCategory.length > 0) continue

    const desc = (s.description + ' ' + (s.user?.name || '')).toLowerCase()

    let categoryId = REMONTI
    let subcategoryId = null

    if (desc.includes('почист') || desc.includes('клиниг') || desc.includes('clean')) {
      categoryId = POCHISTVANE
    } else if (desc.includes('градин') || desc.includes('косен') || desc.includes('озелен')) {
      categoryId = GRADINA
    } else if (desc.includes('хамал') || desc.includes('преместван') || desc.includes('транспорт')) {
      categoryId = MONTAJ
      subcategoryId = HAMALI
    } else if (desc.includes('мебел')) {
      categoryId = MONTAJ
      subcategoryId = MEBELI
    } else if (desc.includes('климатик')) {
      categoryId = REMONTI
      subcategoryId = KLIMATICI
    } else if (desc.includes('покрив')) {
      categoryId = REMONTI
      subcategoryId = REMONT_POKRIVI
    } else if (desc.includes('vik') || desc.includes('виk') || desc.includes('водопровод') || desc.includes('канализ')) {
      categoryId = REMONTI
      subcategoryId = VIK
    } else if (desc.includes('електр') || desc.includes('ел.') || desc.includes('инсталаци')) {
      categoryId = REMONTI
      subcategoryId = ELEKTRO
    } else if (desc.includes('шпаклов') || desc.includes('боя') || desc.includes('мазилк')) {
      categoryId = REMONTI
      subcategoryId = BOYADISVANE
    } else if (desc.includes('гипсокартон')) {
      categoryId = REMONTI
      subcategoryId = GIPSOKARTON
    } else if (desc.includes('баня') || desc.includes('плочк') || desc.includes('фаянс')) {
      categoryId = REMONTI
      subcategoryId = REMONT_BANYA
    } else if (desc.includes('ламинат') || desc.includes('паркет') || desc.includes('подов')) {
      categoryId = REMONTI
      subcategoryId = PODOVI
    } else if (desc.includes('довърш')) {
      categoryId = REMONTI
      subcategoryId = DOVARSHITELNI
    }

    try {
      await prisma.specialistCategory.create({
        data: {
          specialistId: s.id,
          categoryId,
          subcategoryId,
        }
      })
      console.log(`✓ ${s.user?.name} → категория ${categoryId} / подкатегория ${subcategoryId}`)
    } catch (e) {
      console.log(`✗ ${s.user?.name} — вече има категория или грешка`)
    }
  }

  await prisma.$disconnect()
}

main()