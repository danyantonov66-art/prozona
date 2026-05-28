/**
 * Скрипт за merge на ВСИЧКИ дублиращи се подкатегории в ProZona
 * Пуснете с: node scripts/merge-duplicate-subcategories.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const MERGES = [
  // ── Монтаж и инсталации (categoryId:12) ──────────────────────────────
  {
    description: 'Монтаж на осветление (elektro-osvetlenie) → Електроинсталации и осветление (categoryId:9)',
    deleteSlug: 'elektro-osvetlenie',
    deleteCategoryId: 12,
    keepSlug: 'elektro',
    keepCategoryId: 9,
  },
  {
    description: 'Монтаж на осветление (osvetlenie) → Електроинсталации и осветление (categoryId:9)',
    deleteSlug: 'osvetlenie',
    deleteCategoryId: 12,
    keepSlug: 'elektro',
    keepCategoryId: 9,
  },
  {
    description: 'Монтаж на климатик (klimatici/categoryId:12) → Климатици (categoryId:9)',
    deleteSlug: 'klimatici',
    deleteCategoryId: 12,
    keepSlug: 'klimatici',
    keepCategoryId: 9,
  },
  {
    description: 'Дребни битови услуги → Дребни ремонти в дома (categoryId:9)',
    deleteSlug: 'drebni-bitovi',
    deleteCategoryId: 12,
    keepSlug: 'drebni-remonti-dom',
    keepCategoryId: 9,
  },
  {
    description: 'Дребни домашни ремонти → Дребни ремонти в дома (categoryId:9)',
    deleteSlug: 'drebni-remonti',
    deleteCategoryId: 12,
    keepSlug: 'drebni-remonti-dom',
    keepCategoryId: 9,
  },

  // ── Градина и двор (categoryId:8) ─────────────────────────────────────
  {
    description: 'Косене на трева (kosene-treva) → Косене и поддръжка на трева (kosene)',
    deleteSlug: 'kosene-treva',
    deleteCategoryId: 8,
    keepSlug: 'kosene',
    keepCategoryId: 8,
  },

  // ── Ремонти и строителство (categoryId:9) ─────────────────────────────
  {
    description: 'Декоративни мазилки (id:185) → Декоративни мазилки (id:188)',
    deleteSlug: 'dekorativni-mazilki',
    deleteCategoryId: 9,
    keepSlug: 'dekorativni-mazilki-shpaklovka-boya',
    keepCategoryId: 9,
  },
  {
    description: 'Ремонт на баня (remont-banya) → Ремонт на баня и кухня',
    deleteSlug: 'remont-banya',
    deleteCategoryId: 9,
    keepSlug: 'remont-banya-kuhnya',
    keepCategoryId: 9,
  },

  // ── Почистване (categoryId:11) ─────────────────────────────────────────
  {
    description: 'Почистване на офис (ofis) → Почистване на офис (ofis-targovski)',
    deleteSlug: 'ofis',
    deleteCategoryId: 11,
    keepSlug: 'ofis-targovski',
    keepCategoryId: 11,
  },
]

async function main() {
  console.log('🔍 Зареждане на всички подкатегории...\n')

  const allSubs = await prisma.subcategory.findMany({
    include: { Category: { select: { id: true, name: true } } },
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
  })

  console.log('📋 Текущи подкатегории:')
  console.log('─'.repeat(70))
  let lastCatId = null
  for (const s of allSubs) {
    if (s.categoryId !== lastCatId) {
      console.log(`\n[${s.categoryId}] ${s.Category.name}`)
      lastCatId = s.categoryId
    }
    console.log(`   id:${s.id}  slug:"${s.slug}"  name:"${s.name}"`)
  }
  console.log('\n' + '─'.repeat(70))
  console.log(`\nОбщо подкатегории: ${allSubs.length}`)

  console.log('\n🔄 Започвам merge...\n')

  let successCount = 0
  let skipCount = 0

  for (const merge of MERGES) {
    console.log(`\n📌 ${merge.description}`)

    const toDelete = await prisma.subcategory.findFirst({
      where: { slug: merge.deleteSlug, categoryId: merge.deleteCategoryId },
    })

    if (!toDelete) {
      console.log(`   ⚠️  Не намерих slug="${merge.deleteSlug}" в categoryId=${merge.deleteCategoryId} — пропускам`)
      skipCount++
      continue
    }

    const toKeep = await prisma.subcategory.findFirst({
      where: { slug: merge.keepSlug, categoryId: merge.keepCategoryId },
    })

    if (!toKeep) {
      console.log(`   ⚠️  Не намерих keep slug="${merge.keepSlug}" в categoryId=${merge.keepCategoryId} — пропускам`)
      skipCount++
      continue
    }

    if (toDelete.id === toKeep.id) {
      console.log(`   ⚠️  DELETE и KEEP са един и същ запис (id:${toDelete.id}) — пропускам`)
      skipCount++
      continue
    }

    console.log(`   DELETE: id=${toDelete.id} "${toDelete.name}"`)
    console.log(`   KEEP:   id=${toKeep.id} "${toKeep.name}"`)

    const moved = await prisma.specialistCategory.updateMany({
      where: { subcategoryId: toDelete.id },
      data: { subcategoryId: toKeep.id },
    })
    console.log(`   ✅ Преместени специалисти: ${moved.count}`)

    await prisma.subcategory.delete({ where: { id: toDelete.id } })
    console.log(`   🗑️  Изтрита подкатегория id=${toDelete.id}`)
    successCount++
  }

  // Финален брой
  const remaining = await prisma.subcategory.count()
  console.log('\n' + '─'.repeat(70))
  console.log(`✅ Успешни merge-ове: ${successCount}`)
  console.log(`⚠️  Пропуснати: ${skipCount}`)
  console.log(`📊 Оставащи подкатегории в базата: ${remaining}`)
  console.log('\n🎉 Готово!')
}

main()
  .catch((e) => {
    console.error('❌ Грешка:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())