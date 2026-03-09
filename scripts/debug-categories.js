const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true
    },
    orderBy: { id: 'asc' }
  })

  for (const c of categories) {
    console.log('\nCATEGORY ----------------')
    console.log('id:', c.id)
    console.log('name:', c.name)
    console.log('slug:', c.slug)
    console.log('subcategories:', c.subcategories.length)

    for (const s of c.subcategories) {
      console.log('   SUB:', s.name)
      console.log('   slug:', s.slug)
      console.log('   categoryId:', s.categoryId)
      console.log('   isActive:', s.isActive)
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())