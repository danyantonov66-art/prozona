import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function toSlug(text: string): string {
  const cyrillicMap: Record<string, string> = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
    'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
  }
  return text
    .toLowerCase()
    .split('')
    .map(c => cyrillicMap[c] || c)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  const suggestion = await prisma.categorySuggestion.update({
    where: { id },
    data: { status },
  })

  if (status === 'APPROVED') {
    const name = suggestion.name
    const parentName = suggestion.parentName
    const slugBase = toSlug(name)

    if (parentName) {
      // Намери или създай parent категория
      let parent = await prisma.category.findFirst({
        where: { name: { equals: parentName, mode: 'insensitive' } },
      })
      if (!parent) {
        parent = await prisma.category.create({
          data: {
            name: parentName,
            slug: toSlug(parentName),
            description: `Категория ${parentName}`,
            updatedAt: new Date(),
          },
        })
      }

      // Намери или създай подкатегория
      let sub = await prisma.subcategory.findFirst({
        where: { categoryId: parent.id, slug: slugBase },
      })
      if (!sub) {
        sub = await prisma.subcategory.create({
          data: {
            categoryId: parent.id,
            name,
            slug: slugBase,
            description: suggestion.description,
            updatedAt: new Date(),
          },
        })
      }

      // Свържи специалиста
      if (suggestion.specialistId) {
        await prisma.specialistCategory.upsert({
          where: {
            specialistId_categoryId_subcategoryId: {
              specialistId: suggestion.specialistId,
              categoryId: parent.id,
              subcategoryId: sub.id,
            },
          },
          create: {
            specialistId: suggestion.specialistId,
            categoryId: parent.id,
            subcategoryId: sub.id,
          },
          update: {},
        })
      }
    } else {
      // Създай главна категория
      let cat = await prisma.category.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      })
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name,
            slug: slugBase,
            description: suggestion.description,
            updatedAt: new Date(),
          },
        })
      }

      // Свържи специалиста
      if (suggestion.specialistId) {
        await prisma.specialistCategory.upsert({
          where: {
            specialistId_categoryId_subcategoryId: {
              specialistId: suggestion.specialistId,
              categoryId: cat.id,
              subcategoryId: null,
            },
          },
          create: {
            specialistId: suggestion.specialistId,
            categoryId: cat.id,
          },
          update: {},
        })
      }
    }

    return NextResponse.json({ ...suggestion, autoCreated: true })
  }

  return NextResponse.json(suggestion)
}