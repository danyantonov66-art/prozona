// app/api/review/route.ts
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

    const body = await request.json()
    
    // Диагностика
    console.log('📦 ПОЛУЧЕНИ ДАННИ:')
    console.log('specialistId:', body.specialistId)
    console.log('rating:', body.rating, 'тип:', typeof body.rating)
    console.log('comment:', body.comment)

    const { specialistId, rating, comment } = body

    // Валидация
    if (!specialistId) {
      return NextResponse.json(
        { error: 'Липсва ID на специалист' },
        { status: 400 }
      )
    }

    if (rating === undefined || rating === null) {
      return NextResponse.json(
        { error: 'Моля, изберете оценка' },
        { status: 400 }
      )
    }

    // Превърни в число
    const numericRating = Number(rating)
    
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: 'Моля, въведете валидна оценка (1-5)' },
        { status: 400 }
      )
    }

    // Провери дали потребителят е клиент
    if (session.user.role !== 'CLIENT') {
      return NextResponse.json(
        { error: 'Само клиенти могат да пишат отзиви' },
        { status: 403 }
      )
    }

    // Провери дали вече има отзив
  const existingReview = await prisma.review.findFirst({
  where: {
    specialistId,
    clientId: session.user.id
    }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Вече сте написали отзив за този специалист' },
        { status: 400 }
      )
    }

    // Създай отзив
    const review = await prisma.review.create({
      data: {
        specialistId,
        clientId: session.user.id,
        rating: numericRating,
        comment: comment || null,
        isVerified: false
      }
    })

    console.log('✅ Отзив създаден:', review.id)

    return NextResponse.json(
      { message: 'Отзивът е изпратен успешно', review },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ ГРЕШКА:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изпращане на отзива' },
      { status: 500 }
    )
  }
}