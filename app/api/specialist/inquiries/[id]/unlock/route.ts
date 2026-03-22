import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params

    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id },
      select: { id: true, credits: true }
    })

    if (!specialist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    if (specialist.credits < 1) {
      return NextResponse.json(
        { error: 'Нямаш достатъчно кредити' },
        { status: 400 }
      )
    }

    // Вземи запитването с контактите
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      select: { id: true, email: true, phone: true, name: true }
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Извади 1 кредит и запиши отключването
    await prisma.$transaction([
      prisma.specialist.update({
        where: { id: specialist.id },
        data: {
          credits: { decrement: 1 },
          totalCreditsUsed: { increment: 1 },
        }
      }),
      prisma.inquiryResponse.create({
        data: {
          id: `${specialist.id}-${id}`,
          inquiryId: id,
          specialistId: specialist.id,
          message: 'unlocked',
          creditsSpent: 1,
        }
      }),
      prisma.creditTransaction.create({
        data: {
          id: `tx-${specialist.id}-${id}`,
          specialistId: specialist.id,
          amount: -1,
          type: 'USAGE',
          description: `Отключено запитване ${id}`,
        }
      })
    ])

    return NextResponse.json({
      success: true,
      email: inquiry.email,
      phone: inquiry.phone,
      name: inquiry.name,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}