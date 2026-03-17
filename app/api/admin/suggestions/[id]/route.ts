import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const THRESHOLD = 10 // Брой одобрения за автоматично създаване на категория

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0400-\u04FF-]/g, '')
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

  // Обнови статуса на предложението
  const suggestion = await prisma.categorySuggestion.update({
    where: { id },
    data: { status },
  })

  // Ако е одобрено — провери дали трябва да се създаде категория
  if (status === 'APPROVED') {
    const name = suggestion.name
    const parentName = suggestion.parentName

    // Брой одобрени предложения със същото име
    const approvedCount = await prisma.categorySuggestion.count({
      where: {
        name: { equals: name, mode: 'insensitive' },
        status: 'APPROVED',
      },
    })

    if (approvedCount >= THRESHOLD) {
      // Провери дали категорията вече съществува
      const existingCategory = await prisma.category.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
      })

      if (!existingCategory) {
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

          // Създай подкатегория
          const slugBase = toSlug(name)
          const existingSub = await prisma.subcategory.findFirst({
            where: {
              categoryId: parent.id,
              slug: slugBase,
            },
          })

          if (!existingSub) {
            await prisma.subcategory.create({
              data: {
                categoryId: parent.id,
                name,
                slug: slugBase,
                description: suggestion.description,
                updatedAt: new Date(),
              },
            })
          }
        } else {
          // Създай главна категория
          await prisma.category.create({
            data: {
              name,
              slug: toSlug(name),
              description: suggestion.description,
              updatedAt: new Date(),
            },
          })
        }
      }
    }

    return NextResponse.json({
      ...suggestion,
      autoCreated: approvedCount >= THRESHOLD,
      approvedCount,
      threshold: THRESHOLD,
    })
  }

  return NextResponse.json(suggestion)
}
