// app/api/review/[id]/respond/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Не сте влезли в профила си' }, { status: 401 })
    }

    if (session.user.role !== 'SPECIALIST') {
      return NextResponse.json({ error: 'Само специалисти могат да отговарят на отзиви' }, { status: 403 })
    }

    const { response } = await request.json()

    if (!response?.trim()) {
      return NextResponse.json({ error: 'Отговорът не може да е празен' }, { status: 400 })
    }

    // Провери дали отзивът е за ТОЗИ специалист
    const review = await prisma.review.findUnique({
      where: { id: params.id },
      include: { specialist: true }
    })

    if (!review) {
      return NextResponse.json({ error: 'Отзивът не е намерен' }, { status: 404 })
    }

    if (review.specialist.userId !== session.user.id) {
      return NextResponse.json({ error: 'Нямате право да отговаряте на този отзив' }, { status: 403 })
    }

    if (review.response) {
      return NextResponse.json({ error: 'Вече сте отговорили на този отзив' }, { status: 400 })
    }

    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        response: response.trim(),
        responseAt: new Date()
      }
    })

    return NextResponse.json({ message: 'Отговорът е изпратен успешно', review: updated })
  } catch (error) {
    console.error('❌ ГРЕШКА:', error)
    return NextResponse.json({ error: 'Възникна грешка' }, { status: 500 })
  }
}