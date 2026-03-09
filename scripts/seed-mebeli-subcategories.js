const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: 'mebeli' },
  })

  if (!category) {
    throw new Error('Категорията "mebeli" не е намерена.')
  }

  const items = [
    {
      name: 'Сглобяване на мебели',
      slug: 'sglobyavane-mebeli',
      description: 'Сглобяване на шкафове, бюра, легла, секции и други мебели',
    },
    {
      name: 'Монтаж на кухни',
      slug: 'montazh-kuhni',
      description: 'Монтаж и настройка на кухненски шкафове, плотове и механизми',
    },
    {
      name: 'Монтаж на гардероби',
      slug: 'montazh-garderobi',
      description: 'Сглобяване и монтаж на гардероби и системи за съхранение',
    },
    {
      name: 'Ремонт на мебели',
      slug: 'remont-mebeli',
      description: 'Поправка, укрепване, освежаване и частичен ремонт на мебели',
    },
    {
      name: 'Изработка на мебели по поръчка',
      slug: 'izrabotka-mebeli-po-porachka',
      description: 'Изработка на мебели по индивидуален проект за дом, офис и търговски обекти',
    },
    {
      name: 'Кухни по поръчка',
      slug: 'kuhni-po-porachka',
      description: 'Проектиране, изработка и монтаж на кухни по поръчка',
    },
    {
      name: 'Гардероби по поръчка',
      slug: 'garderobi-po-porachka',
      description: 'Изработка и монтаж на гардероби по размер и индивидуален дизайн',
    },
    {
      name: 'Монтаж на мебели по поръчка',
      slug: 'montazh-mebeli-po-porachka',
      description: 'Професионален монтаж на мебели и кухни по поръчка',
    },
  ]

  for (const item of items) {
    const existing = await prisma.subcategory.findFirst({
      where: {
        slug: item.slug,
        categoryId: category.id,
      },
    })

    if (existing) {
      await prisma.subcategory.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          description: item.description,
          isActive: true,
        },
      })
      console.log(`Обновена: ${item.name}`)
    } else {
      await prisma.subcategory.create({
        data: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          categoryId: category.id,
          isActive: true,
        },
      })
      console.log(`Добавена: ${item.name}`)
    }
  }

  console.log('Готово: подкатегориите за "Мебели и сглобяване" са записани.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })