// app/api/review/[id]/respond/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session) {
      return NextResponse.json(
        { error: 'Моля, влезте в профила си' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { response } = body

    if (!response) {
      return NextResponse.json(
        { error: 'Моля, въведете отговор' },
        { status: 400 }
      )
    }

    // Намери отзива
    const review = await prisma.review.findUnique({
      where: { id },
      include: { specialist: true }
    })

    if (!review) {
      return NextResponse.json(
        { error: 'Отзивът не е намерен' },
        { status: 404 }
      )
    }

    // Провери дали потребителят е специалистът, за когото е отзивът
    if (review.specialist.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Можете да отговаряте само на отзиви за вашия профил' },
        { status: 403 }
      )
    }

    // Провери дали вече има отговор
    if (review.response) {
      return NextResponse.json(
        { error: 'Вече сте отговорили на този отзив' },
        { status: 400 }
      )
    }

    // Добави отговор
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        response,
        responseAt: new Date()
      }
    })

    return NextResponse.json(
      { message: 'Отговорът е изпратен успешно', review: updatedReview },
      { status: 200 }
    )
  } catch (error) {
    console.error('Грешка при отговор на отзив:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изпращане на отговора' },
      { status: 500 }
    )
  }
}