const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const categories = [
  {
    name: "Ремонти и майстори",
    slug: "remonti",
    description: "ВиК, електро, боядисване и довършителни ремонти",
    icon: "/images/categories/remonti.jpg",
    subcategories: [
      { name: "ВиК услуги", slug: "vik" },
      { name: "Електро услуги", slug: "elektro" },
      { name: "Боядисване", slug: "boyadisvane" },
      { name: "Шпакловка и зидария", slug: "shpaklovka-zidariya" },
      { name: "Ремонт на баня", slug: "remont-banya" },
      { name: "Гипсокартон", slug: "gipsokarton" },
      { name: "Довършителни ремонти", slug: "dovarshitelni-remonti" }
    ]
  },
  {
    name: "Почистване",
    slug: "pochistvane",
    description: "Домашно, основно и офис почистване",
    icon: "/images/categories/pochistvane.jpg",
    subcategories: [
      { name: "Домашно почистване", slug: "domashno" },
      { name: "Основно почистване", slug: "osnovno" },
      { name: "Почистване след ремонт", slug: "sled-remont" },
      { name: "Офис почистване", slug: "ofis" },
      { name: "Почистване при смяна на наематели", slug: "naem" }
    ]
  },
  {
    name: "Монтаж и дребни услуги",
    slug: "montaj",
    description: "Мебели, техника, хамали и дребни ремонти",
    icon: "/images/categories/montaj.jpg",
    subcategories: [
      { name: "Монтаж на мебели", slug: "mebeli" },
      { name: "Монтаж на климатик", slug: "klimatici" },
      { name: "Монтаж на осветление", slug: "osvetlenie" },
      { name: "Монтаж на електроуреди", slug: "elektrouredi" },
      { name: "Дребни домашни ремонти", slug: "drebni-remonti" },
      { name: "Хамалски услуги", slug: "hamali" },
      { name: "Преместване на мебели", slug: "premestvane-mebeli" }
    ]
  },
  {
    name: "Градина и двор",
    slug: "gradina",
    description: "Косене, поддръжка и озеленяване",
    icon: "/images/categories/gradina.jpg",
    subcategories: [
      { name: "Косене на трева", slug: "kosene" },
      { name: "Поддръжка на двор", slug: "poddrazhka-dvor" },
      { name: "Подрязване на дървета", slug: "podryazvane" },
      { name: "Озеленяване", slug: "ozelenyavane" },
      { name: "Почистване на двор", slug: "pochistvane-dvor" }
    ]
  }
]

async function main() {
  console.log("Seeding launch categories...")

  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        icon: category.icon,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        sortOrder: 0,
        isActive: true,
        updatedAt: new Date()
      }
    })

    for (const sub of category.subcategories) {
      await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: cat.id,
            slug: sub.slug
          }
        },
        update: {
          name: sub.name,
          description: sub.name,
          isActive: true,
          updatedAt: new Date()
        },
        create: {
          categoryId: cat.id,
          name: sub.name,
          slug: sub.slug,
          description: sub.name,
          sortOrder: 0,
          isActive: true,
          updatedAt: new Date()
        }
      })
    }
  }

  console.log("Launch categories seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })