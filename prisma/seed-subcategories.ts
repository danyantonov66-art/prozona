import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const subcategories = [
    // Ремонти (categoryId: 9)
    { categoryId: 9, name: "ВиК и канализация", slug: "vik" },
    { categoryId: 9, name: "Електроинсталации и осветление", slug: "elektro" },
    { categoryId: 9, name: "Боядисване и шпакловане", slug: "boyadisvane" },
    { categoryId: 9, name: "Гипсокартон и сухо строителство", slug: "gipsokarton" },
    { categoryId: 9, name: "Подови настилки", slug: "podovi-nastilki" },
    { categoryId: 9, name: "Ключарски услуги", slug: "klyucharski" },
    { categoryId: 9, name: "Довършителни ремонти", slug: "dovarshitelni-remonti" },
    { categoryId: 9, name: "Дребни ремонти в дома", slug: "drebni-remonti-dom" },
    { categoryId: 9, name: "Ремонт на баня и кухня", slug: "remont-banya-kuhnya" },
    { categoryId: 9, name: "Климатици", slug: "klimatici" },

    // Почистване (categoryId: 11)
    { categoryId: 11, name: "Почистване на дом", slug: "domashno" },
    { categoryId: 11, name: "Почистване на офис", slug: "ofis-targovski" },
    { categoryId: 11, name: "Почистване след ремонт", slug: "sled-remont" },
    { categoryId: 11, name: "Почистване на прозорци и фасади", slug: "prozortsi-fasadi" },
    { categoryId: 11, name: "Почистване на тапицерии и килими", slug: "tapicerii-kilimi" },
    { categoryId: 11, name: "Генерално почистване", slug: "generalno" },
    { categoryId: 11, name: "Почистване на имоти след напускане", slug: "imoti-napuskane" },
    { categoryId: 11, name: "Авто почистване и детайлинг", slug: "avto-detailing" },
    { categoryId: 11, name: "Груминг за домашни любимци", slug: "gruming" },

    // Монтаж (categoryId: 12)
    { categoryId: 12, name: "Изработка и монтаж на мебели", slug: "mebeli" },
    { categoryId: 12, name: "Монтаж на битова техника", slug: "bitova-tehnika" },
    { categoryId: 12, name: "Хамалски услуги и преместване", slug: "premestvane-hamali" },
    { categoryId: 12, name: "Монтаж на врати, прозорци и щори", slug: "vrati-prozortsi-shtori" },
    { categoryId: 12, name: "Дребни битови услуги", slug: "drebni-bitovi" },
    { categoryId: 12, name: "Монтаж на осветление", slug: "elektro-osvetlenie" },

    // Градина (categoryId: 8)
    { categoryId: 8, name: "Косене и поддръжка на трева", slug: "kosene" },
    { categoryId: 8, name: "Подрязване на дървета и храсти", slug: "podryazvane" },
    { categoryId: 8, name: "Озеленяване и цветни лехи", slug: "ozelenyavane" },
    { categoryId: 8, name: "Почистване на двор и тераса", slug: "pochistvane-dvor" },
    { categoryId: 8, name: "Изграждане и поддръжка на алеи", slug: "aleyi" },
    { categoryId: 8, name: "Поддръжка на басейни", slug: "baseini" },
  ]

  for (const sub of subcategories) {
    await prisma.subcategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: sub.categoryId,
          slug: sub.slug,
        }
      },
      update: { name: sub.name },
      create: {
        categoryId: sub.categoryId,
        name: sub.name,
        slug: sub.slug,
        isActive: true,
        updatedAt: new Date(),
      }
    })
    console.log(`✅ ${sub.name}`)
  }

  console.log('🎉 Готово!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())