import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Моля, влезте в профила си' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Само клиенти могат да пишат отзиви' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { specialistId, rating, comment, inquiryId } = body

    if (!specialistId) {
      return NextResponse.json(
        { error: 'Липсва ID на специалист' },
        { status: 400 }
      )
    }

    const numericRating = Number(rating)
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: 'Моля, въведете валидна оценка (1-5)' },
        { status: 400 }
      )
    }

    // Проверка: клиентът трябва да има завършено запитване към специалиста
    const completedInquiry = await prisma.inquiry.findFirst({
      where: {
        clientId: session.user.id,
        specialistId,
        status: 'COMPLETED',
      },
    })

    if (!completedInquiry) {
      return NextResponse.json(
        { error: 'Можете да пишете отзив само след завършена работа със специалиста' },
        { status: 403 }
      )
    }

    // Проверка: вече има ли отзив
    const existingReview = await prisma.review.findFirst({
      where: {
        specialistId,
        clientId: session.user.id,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Вече сте написали отзив за този специалист' },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        specialistId,
        clientId: session.user.id,
        rating: numericRating,
        comment: comment || null,
        isVerified: true, // верифициран защото има завършен Inquiry
      },
    })

    // Обнови рейтинга на специалиста
    const allReviews = await prisma.review.findMany({
      where: { specialistId },
      select: { rating: true },
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.specialist.update({
      where: { id: specialistId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    })

    return NextResponse.json(
      { message: 'Отзивът е изпратен успешно', review },
      { status: 201 }
    )
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изпращане на отзива' },
      { status: 500 }
    )
  }
}
