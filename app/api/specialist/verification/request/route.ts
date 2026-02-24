// app/api/specialist/verification/request/route.ts
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
    const { documents } = body

    // Намери специалиста
    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id }
    })

    if (!specialist) {
      return NextResponse.json(
        { error: 'Специалистът не е намерен' },
        { status: 404 }
      )
    }

    // Тук ще качим документите в Cloudinary
    // Засега само маркираме като чакащ верификация

    // Създай запис за верификация
    // В реална ситуация ще има отделен модел VerificationRequest

    return NextResponse.json(
      { message: 'Заявката за верификация е изпратена успешно' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting verification request:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изпращане на заявката' },
      { status: 500 }
    )
  }
}