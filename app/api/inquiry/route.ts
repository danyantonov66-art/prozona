import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { specialistId, name, email, phone, message, preferredDate } = body ?? {}

    if (!specialistId || typeof specialistId !== 'string') {
      return NextResponse.json({ error: 'Missing specialistId' }, { status: 400 })
    }
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Липсват задължителни полета' }, { status: 400 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { id: specialistId },
      include: { user: true, categories: { include: { category: true }, take: 1 } }
    })

    if (!specialist) {
      return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
    }

    const categoryId = specialist.categories[0]?.categoryId ?? 1

    const inquiry = await prisma.inquiry.create({
      data: {
        specialistId,
        name,
        email,
        phone: phone || null,
        message,
        categoryId,
        city: specialist.city,
        status: 'PENDING',
      }
    })

    if (specialist.user?.email && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: specialist.user.email,
        subject: `Ново запитване от ${name} - ProZona`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1DB954;">Ново запитване от ProZona</h2>
            <p>Имате ново запитване от <strong>${name}</strong>.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; color: #666;">Име:</td><td style="padding: 8px;"><strong>${name}</strong></td></tr>
              <tr><td style="padding: 8px; color: #666;">Имейл:</td><td style="padding: 8px;">${email}</td></tr>
              <tr><td style="padding: 8px; color: #666;">Телефон:</td><td style="padding: 8px;">${phone || 'Не е посочен'}</td></tr>
              ${preferredDate ? `<tr><td style="padding: 8px; color: #666;">Предпочитана дата:</td><td style="padding: 8px;">${preferredDate}</td></tr>` : ''}
            </table>
            <h3>Съобщение:</h3>
            <p style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${message}</p>
            <a href="https://www.prozona.bg/bg/specialist/inquiries" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #1DB954; color: white; text-decoration: none; border-radius: 8px;">
              Виж запитването
            </a>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true, inquiryId: inquiry.id })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
