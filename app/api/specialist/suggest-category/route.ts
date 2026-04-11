import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceName, categoryName, description, city, phone, email } = body

    if (!serviceName || !description) {
      return NextResponse.json(
        { error: 'Моля, попълнете всички задължителни полета' },
        { status: 400 }
      )
    }

    await prisma.categorySuggestion.create({
      data: {
        name: serviceName,
        description,
        parentName: categoryName ?? null,
        updatedAt: new Date(),
      }
    })

    await resend.emails.send({
      from: 'ProZona <office@prozona.bg>',
      to: process.env.ADMIN_EMAIL!,
      subject: `📋 Ново предложение за услуга: ${serviceName}`,
      html: `
        <p><strong>Ново предложение за услуга в ProZona:</strong></p>
        <ul>
          <li>Услуга: ${serviceName}</li>
          <li>Категория: ${categoryName || '—'}</li>
          <li>Описание: ${description}</li>
          <li>Град: ${city || '—'}</li>
          <li>Телефон: ${phone || '—'}</li>
          <li>Имейл: ${email || '—'}</li>
        </ul>
        <a href="https://www.prozona.bg/bg/admin/suggestions">Виж в админ панела →</a>
      `
    })

    return NextResponse.json(
      { message: 'Предложението е изпратено успешно' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изпращане на предложението' },
      { status: 500 }
    )
  }
}