const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const cityFixes = {
  'Sofia ': 'София',
  'Sofia': 'София',
  'Sofiq': 'София',
  'Sofia  ': 'София',
  'Велико Търново ': 'Велико Търново',
  'Пловдив ': 'Пловдив',
  'София ': 'София',
  'Елин пелин': 'Елин Пелин',
  'Елин Пелин ': 'Елин Пелин',
  'Варна ': 'Варна',
  'Плевен ': 'Плевен',
  'Плевен , Ловеч ': 'Плевен',
  'Дупница ': 'Дупница',
  'Stara Zagora': 'Стара Загора',
  'Vraca': 'Враца',
  'Burgas': 'Бургас',
  'град Варна': 'Варна',
  'гр. София (обл.София (столица))': 'София',
  'гр. София (1000)': 'София',
  '1000 София, община Столична, област София - град': 'София',
  'Ново село Община Русе': 'Русе',
  'Всички': '',
  'Qmbol': '',
  'България': '',
  'ДОЛНИ ЧИФЛИК (ВАРНА)': 'Варна',
  'Велико Търново ': 'Велико Търново',
}

async function main() {
  const specialists = await prisma.specialist.findMany({
    select: { id: true, city: true, user: { select: { name: true } } }
  })

  let fixed = 0
  for (const s of specialists) {
    const corrected = cityFixes[s.city]
    if (corrected !== undefined) {
      await prisma.specialist.update({
        where: { id: s.id },
        data: { city: corrected }
      })
      console.log(`✓ "${s.city}" → "${corrected}" | ${s.user?.name}`)
      fixed++
    }
  }

  console.log(`\nОправени: ${fixed} специалисти`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())