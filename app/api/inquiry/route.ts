import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { specialistId, name, email, phone, message } = body ?? {}

    if (!specialistId || typeof specialistId !== 'string') {
      return NextResponse.json({ error: 'Missing specialistId' }, { status: 400 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { id: specialistId },
      include: { user: true }
    })

    if (!specialist) {
      return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
    }

    if (specialist.user?.email) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: specialist.user.email,
        subject: 'Ново запитване от ProZona',
        text: [
          `Име: ${name ?? ''}`,
          `Имейл: ${email ?? ''}`,
          `Телефон: ${phone ?? ''}`,
          '',
          'Съобщение:',
          `${message ?? ''}`
        ].join('\n')
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
