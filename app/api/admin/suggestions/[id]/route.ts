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
  const body = await request.json()
  const { status, categoryId, subcategoryId, newCategoryName, newSubcategoryName } = body

  const suggestion = await prisma.categorySuggestion.update({
    where: { id },
    data: { status },
  })

  if (status === 'APPROVED') {
    let finalCategoryId: number | null = categoryId ?? null
    let finalSubcategoryId: number | null = subcategoryId ?? null

    // Създай нова главна категория ако е поискано
    if (newCategoryName && !finalCategoryId) {
      const slug = toSlug(newCategoryName)
      let cat = await prisma.category.findFirst({ where: { slug } })
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: newCategoryName,
            slug,
            description: suggestion.description ?? '',
            updatedAt: new Date(),
          },
        })
      }
      finalCategoryId = cat.id
    }

    // Създай нова подкатегория ако е поискано
    if (newSubcategoryName && finalCategoryId && !finalSubcategoryId) {
      const slug = toSlug(newSubcategoryName)
      let sub = await prisma.subcategory.findFirst({
        where: { categoryId: finalCategoryId, slug },
      })
      if (!sub) {
        sub = await prisma.subcategory.create({
          data: {
            categoryId: finalCategoryId,
            name: newSubcategoryName,
            slug,
            description: suggestion.description ?? '',
            updatedAt: new Date(),
          },
        })
      }
      finalSubcategoryId = sub.id
    }

    // Свържи специалиста
    if (suggestion.specialistId && finalCategoryId) {
      await prisma.specialistCategory.upsert({
        where: {
          specialistId_categoryId_subcategoryId: {
            specialistId: suggestion.specialistId,
            categoryId: finalCategoryId,
            subcategoryId: finalSubcategoryId ?? null,
          },
        },
        create: {
          specialistId: suggestion.specialistId,
          categoryId: finalCategoryId,
          subcategoryId: finalSubcategoryId ?? null,
        },
        update: {},
      })
    }

    return NextResponse.json({ ...suggestion, autoCreated: true })
  }

  return NextResponse.json(suggestion)
}