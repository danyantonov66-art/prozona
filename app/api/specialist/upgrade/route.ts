// app/api/specialist/upgrade/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
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

    // Проверка дали потребителят съществува
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Потребителят не съществува' },
        { status: 404 }
      )
    }

    // Проверка дали вече е специалист
    const existingSpecialist = await prisma.specialist.findUnique({
      where: { userId }
    })

    if (existingSpecialist) {
      return NextResponse.json(
        { error: 'Вече сте специалист' },
        { status: 400 }
      )
    }

    // Актуализирай ролята на потребителя
    await prisma.user.update({
      where: { id: userId },
      data: { role: 'SPECIALIST' }
    })

    // Намери категорията
    const categoryRecord = await prisma.category.findUnique({
      where: { slug: category }
    })

    if (!categoryRecord) {
      return NextResponse.json(
        { error: 'Категорията не съществува' },
        { status: 400 }
      )
    }

    // Създай специалист с безплатен план
    const specialist = await prisma.specialist.create({
      data: {
        userId,
        businessName: businessName || null,
        description,
        city,
        serviceAreas: [city],
        experienceYears: experience || 0,
        phone,
        credits: 0, // Започва с 0 кредити
        subscriptionPlan: 'FREE',
        maxImages: 5,
        maxPriceListItems: 0,
        creditPrice: 2.99,
        categories: {
          create: {
            categoryId: categoryRecord.id,
          }
        }
      }
    })

    return NextResponse.json(
      { message: 'Успешно станахте специалист', specialist },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error upgrading to specialist:', error)
    return NextResponse.json(
      { error: 'Възникна грешка' },
      { status: 500 }
    )
  }
}