// app/api/specialist/profile/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Получени данни:', body)

    const { 
      userId, 
      businessName, 
      description, 
      city, 
      category, 
      subcategory, 
      experience,
      phone 
    } = body

    // Валидация
    if (!userId) {
      return NextResponse.json(
        { error: 'Липсва userId' },
        { status: 400 }
      )
    }

    if (!description || !city || !category) {
      return NextResponse.json(
        { error: 'Моля, попълнете всички задължителни полета' },
        { status: 400 }
      )
    }

    // Първо провери дали потребителят съществува
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Потребителят не съществува' },
        { status: 404 }
      )
    }

    // Намери категорията
    let categoryRecord = await prisma.category.findUnique({
      where: { slug: category }
    })

    // Ако няма категория, създай я
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category,
          slug: category,
          description: `${category} услуги`,
          sortOrder: 1,
          isActive: true
        }
      })
    }

    // Създай специалист
    const specialist = await prisma.specialist.create({
      data: {
        userId,
        businessName: businessName || null,
        description,
        city,
        serviceAreas: [city],
        experienceYears: experience ? parseInt(experience) : 0,
        phone: phone || null,
        categories: {
          create: {
            categoryId: categoryRecord.id,
          }
        }
      },
      include: {
        user: true,
        categories: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Профилът е създаден успешно', 
        specialist 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Грешка при създаване на профил:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при създаване на профила: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
export async function PUT(request: Request) {
  try {
    const { getServerSession } = await import("next-auth")
    const { authOptions } = await import("@/lib/auth")
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 })

    const userId = (session.user as any)?.id
    const body = await request.json()
    const { businessName, description, phone, experienceYears } = body

    const specialist = await prisma.specialist.update({
      where: { userId },
      data: {
        businessName: businessName || null,
        description,
        phone: phone || null,
        experienceYears: experienceYears || 0,
      }
    })

    return Response.json(specialist)
  } catch (error) {
    console.error("Update error:", error)
    return Response.json({ error: "Update failed" }, { status: 500 })
  }
}
