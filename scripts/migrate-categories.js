const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

// Нова структура на категориите
const NEW_CATEGORIES = [
  {
    name: 'Ремонти и строителство',
    slug: 'remonti-i-stroitelstvo-new',
    description: 'ВиК, електро, шпакловка, покриви и всички ремонти',
    subcategories: [
      { name: 'ВиК', slug: 'vik-new' },
      { name: 'Електро', slug: 'elektro-new' },
      { name: 'Шпакловка и боядисване', slug: 'shpaklovka-boyadisvane-new' },
      { name: 'Гипсокартон', slug: 'gipsokarton-new' },
      { name: 'Ремонт на покриви', slug: 'remont-pokrivi-new' },
      { name: 'Ремонт на баня', slug: 'remont-banya-new' },
      { name: 'Подови настилки', slug: 'podovi-nastilki-new' },
      { name: 'Дребни ремонти', slug: 'drebni-remonti-new' },
      { name: 'Къртене и събаряне', slug: 'kartene-sabarane-new' },
      { name: 'Извозване на строителни отпадъци', slug: 'izvozване-otpadaci-new' },
    ]
  },
  {
    name: 'Почистване',
    slug: 'pochistvane-new',
    description: 'Домашно, офис и генерално почистване',
    subcategories: [
      { name: 'Домашно почистване', slug: 'domashno-pochistvane-new' },
      { name: 'Почистване след ремонт', slug: 'sled-remont-new' },
      { name: 'Почистване на офиси', slug: 'ofis-pochistvane-new' },
      { name: 'Генерално почистване', slug: 'generalno-pochistvane-new' },
    ]
  },
  {
    name: 'Транспорт и хамали',
    slug: 'transport-hamali-new',
    description: 'Хамалски услуги, преместване и транспорт',
    subcategories: [
      { name: 'Хамалски услуги', slug: 'hamali-new' },
      { name: 'Преместване на дома/офис', slug: 'premestvane-new' },
      { name: 'Транспортни услуги', slug: 'transport-new' },
      { name: 'Пътна помощ', slug: 'patna-pomosht-new' },
    ]
  },
  {
    name: 'Климатици',
    slug: 'klimatici-new',
    description: 'Монтаж, демонтаж и сервиз на климатици',
    subcategories: [
      { name: 'Монтаж и демонтаж', slug: 'montaj-demontaj-klimatik-new' },
      { name: 'Сервиз и профилактика', slug: 'servis-klimatik-new' },
    ]
  },
  {
    name: 'Мебели и интериор',
    slug: 'mebeli-interior-new',
    description: 'Монтаж и изработка на мебели',
    subcategories: [
      { name: 'Монтаж на мебели', slug: 'montaj-mebeli-new' },
      { name: 'Изработка по поръчка', slug: 'izrabotka-mebeli-new' },
      { name: 'Монтаж на врати и прозорци', slug: 'vrati-prozortsi-new' },
    ]
  },
  {
    name: 'Градина и двор',
    slug: 'gradina-dvor-new',
    description: 'Косене, озеленяване и поддръжка',
    subcategories: [
      { name: 'Косене на трева', slug: 'kosene-new' },
      { name: 'Озеленяване', slug: 'ozelenyavane-new' },
      { name: 'Подрязване на дървета', slug: 'podryazvane-new' },
      { name: 'Почистване на двор', slug: 'pochistvane-dvor-new' },
    ]
  },
  {
    name: 'Авто услуги',
    slug: 'avto-uslugi-new',
    description: 'Автосервиз, автомивка и ГТП',
    subcategories: [
      { name: 'Автосервиз', slug: 'avtoservis-new' },
      { name: 'Автомивка', slug: 'avtomivka-new' },
      { name: 'ГТП', slug: 'gtp-new' },
      { name: 'Авто детайлинг, полиране и керамична защита', slug: 'avto-detailing-new' },
    ]
  },
  {
    name: 'IT и компютри',
    slug: 'it-kompyutri-new',
    description: 'Ремонт на компютри и IT услуги',
    subcategories: [
      { name: 'Ремонт на компютри', slug: 'remont-kompyutri-new' },
      { name: 'Мрежи и интернет', slug: 'mreji-internet-new' },
    ]
  },
  {
    name: 'Красота и здраве',
    slug: 'krasota-zdrave-new',
    description: 'Фризьори, маникюристи, масажисти и фитнес',
    subcategories: [
      { name: 'Фризьори', slug: 'frizyor-new' },
      { name: 'Маникюристи', slug: 'manikyur-new' },
      { name: 'Масажисти', slug: 'masaj-new' },
      { name: 'Фитнес салони', slug: 'fitnes-new' },
    ]
  },
]

// Mapping от стари категории към нови
const CATEGORY_MIGRATION_MAP = {
  20: 'transport-hamali-new',      // Транспортни услуги → Транспорт и хамали
  21: 'remonti-i-stroitelstvo-new', // Ремонти и майстори → Ремонти и строителство
  19: 'klimatici-new',              // Климатици → Климатици
  9: 'remonti-i-stroitelstvo-new',  // Ремонти и строителство → Ремонти и строителство
  11: 'pochistvane-new',            // Почистване → Почистване
  12: 'mebeli-interior-new',        // Монтаж и инсталации → Мебели и интериор
  6: 'mebeli-interior-new',         // Мебели и обзавеждане → Мебели и интериор
  8: 'gradina-dvor-new',            // Градина и двор → Градина и двор
  4: 'avto-uslugi-new',             // Авто услуги → Авто услуги
  14: 'it-kompyutri-new',           // Компютърни и IT услуги → IT и компютри
  1: 'remonti-i-stroitelstvo-new',  // Строителство и ремонт → Ремонти и строителство
  5: 'krasota-zdrave-new',          // Красота и грижа → Красота и здраве
  15: 'remonti-i-stroitelstvo-new', // Декоративни мазилки → Ремонти и строителство
  16: 'it-kompyutri-new',           // Поддръжка на компютри → IT и компютри
  17: 'remonti-i-stroitelstvo-new', // Дребни ремонти → Ремонти и строителство
  18: 'remonti-i-stroitelstvo-new', // Подово отопление → Ремонти и строителство
}

async function main() {
  console.log('🚀 Започване на миграция на категории...\n')

  // 1. Създаване на нови категории
  console.log('📁 Създаване на нови категории...')
  const newCategoryMap = {}

  for (let i = 0; i < NEW_CATEGORIES.length; i++) {
    const cat = NEW_CATEGORIES[i]
    
    // Провери дали вече съществува
    let catRecord = await p.category.findFirst({ where: { name: cat.name } })
if (!catRecord) {
  catRecord = await p.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          isActive: true,
          sortOrder: i + 1,
          updatedAt: new Date(),
        }
      })
      console.log(`  ✓ Създадена: ${cat.name}`)
    } else {
      console.log(`  ⏭ Вече съществува: ${cat.name}`)
    }
    newCategoryMap[cat.slug] = catRecord.id

    // Създаване на подкатегории
    for (let j = 0; j < cat.subcategories.length; j++) {
      const sub = cat.subcategories[j]
      const existingSub = await p.subcategory.findFirst({ where: { slug: sub.slug } })
      if (!existingSub) {
        await p.subcategory.create({
          data: {
            name: sub.name,
            slug: sub.slug,
            description: sub.name,
            categoryId: catRecord.id,
            isActive: true,
            sortOrder: j + 1,
            updatedAt: new Date(),
          }
        })
      }
    }
  }

  console.log('\n🔄 Миграция на специалисти...')
  
  // 2. Мигриране на специалистите
  const oldCategories = await p.specialistCategory.findMany({
    include: { Category: true, Subcategory: true }
  })

  let migrated = 0
  let skipped = 0

  for (const sc of oldCategories) {
    const newSlug = CATEGORY_MIGRATION_MAP[sc.categoryId]
    if (!newSlug) {
      console.log(`  ⚠ Няма mapping за categoryId: ${sc.categoryId} (${sc.Category.name})`)
      skipped++
      continue
    }

    const newCatId = newCategoryMap[newSlug]
    if (!newCatId) {
      console.log(`  ⚠ Не е намерена нова категория: ${newSlug}`)
      skipped++
      continue
    }

    // Проверка дали вече е мигриран
    const existing = await p.specialistCategory.findFirst({
      where: { specialistId: sc.specialistId, categoryId: newCatId }
    })

    if (!existing) {
      await p.specialistCategory.create({
        data: {
          specialistId: sc.specialistId,
          categoryId: newCatId,
          subcategoryId: null,
        }
      })
      migrated++
    } else {
      skipped++
    }
  }

  console.log(`  ✓ Мигрирани: ${migrated}`)
  console.log(`  ⏭ Пропуснати (вече мигрирани): ${skipped}`)

  // 3. Деактивиране на старите категории
  console.log('\n🗑 Деактивиране на стари категории...')
  const oldCatIds = Object.keys(CATEGORY_MIGRATION_MAP).map(Number)
  await p.category.updateMany({
    where: { id: { in: oldCatIds } },
    data: { isActive: false }
  })
  console.log(`  ✓ Деактивирани ${oldCatIds.length} стари категории`)

  console.log('\n✅ Миграцията приключи успешно!')
  process.exit()
}

main().catch(e => { console.error(e); process.exit(1) })
