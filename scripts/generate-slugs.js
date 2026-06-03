const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function generateSlug(name, city, id) {
  const translitMap = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
    'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
    'А':'a','Б':'b','В':'v','Г':'g','Д':'d','Е':'e','Ж':'zh','З':'z',
    'И':'i','Й':'y','К':'k','Л':'l','М':'m','Н':'n','О':'o','П':'p',
    'Р':'r','С':'s','Т':'t','У':'u','Ф':'f','Х':'h','Ц':'ts','Ч':'ch',
    'Ш':'sh','Щ':'sht','Ъ':'a','Ь':'','Ю':'yu','Я':'ya'
  }

  function transliterate(str) {
    return str.split('').map(char => translitMap[char] || char).join('')
  }

  const base = transliterate(`${name}-${city}`)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${base}-${id.slice(-6)}`
}

async function main() {
  const specialists = await prisma.specialist.findMany({
    include: { user: true }
  })

  console.log(`Генериране на slugs за ${specialists.length} специалисти...`)

  for (const s of specialists) {
    const name = s.businessName || s.user.name
    const slug = generateSlug(name, s.city, s.id)
    await prisma.specialist.update({
      where: { id: s.id },
      data: { slug }
    })
    console.log(`✓ ${name} (${s.city}) → ${slug}`)
  }

  console.log('\nГотово!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())