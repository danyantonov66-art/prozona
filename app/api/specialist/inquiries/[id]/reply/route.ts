import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { message } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Липсва съобщение' }, { status: 400 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    })

    if (!specialist) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (specialist.credits < 1) {
      return NextResponse.json({ error: 'Недостатъчно кредити' }, { status: 400 })
    }

    const inquiry = await prisma.inquiry.findUnique({ where: { id } })
    if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.$transaction([
      prisma.inquiryResponse.create({
        data: {
          inquiryId: id,
          specialistId: specialist.id,
          message,
          creditsSpent: 1,
        }
      }),
      prisma.specialist.update({
        where: { id: specialist.id },
        data: { credits: { decrement: 1 }, totalCreditsUsed: { increment: 1 } }
      }),
      prisma.inquiry.update({
        where: { id },
        data: { status: 'REPLIED', repliedAt: new Date() }
      })
    ])

    if (inquiry.email && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: inquiry.email,
        subject: `${specialist.user.name} отговори на вашето запитване - ProZona`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1DB954;">Получихте отговор от ${specialist.user.name}</h2>
            <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
            <p>Свържете се директно: ${specialist.phone || specialist.user.email}</p>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reply error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}