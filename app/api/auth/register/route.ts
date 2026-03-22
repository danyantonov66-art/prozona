import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function generateRefCode(name: string, id: string): string {
  return Buffer.from(`${name}-${id}`).toString('base64').slice(0, 8).toUpperCase()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role, phone, city, service, description, categoryId, subcategoryId } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Липсващи задължителни полета' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Потребител с този имейл вече съществува' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: role || 'CLIENT',
      }
    })

    if (role === 'SPECIALIST') {
      const specialist = await prisma.specialist.create({
        data: {
          userId: user.id,
          description: description || 'Профилът предстои да бъде попълнен.',
          city: city || 'България',
          serviceAreas: city ? [city] : [],
          phone: phone || null,
          verified: false,
        }
      })

      // Запиши категорията в SpecialistCategory
      if (categoryId && subcategoryId) {
        // Намери категорията в БД по slug
        const dbCategory = await prisma.category.findUnique({
          where: { slug: categoryId }
        })

        if (dbCategory) {
          // Намери подкатегорията в БД по slug
          const dbSubcategory = await prisma.subcategory.findFirst({
            where: {
              slug: subcategoryId,
              categoryId: dbCategory.id
            }
          })

          await prisma.specialistCategory.create({
            data: {
              specialistId: specialist.id,
              categoryId: dbCategory.id,
              subcategoryId: dbSubcategory?.id || null,
            }
          })
        }
      }

      const refCode = generateRefCode(name, user.id)
      const refLink = `https://www.prozona.bg/bg/register/specialist?ref=${refCode}`

      // Welcome имейл към специалиста
      await resend.emails.send({
        from: 'ProZona <office@prozona.bg>',
        to: email,
        subject: '🎉 Добре дошъл в ProZona!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
                <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">PZ ProZona</span>
              </div>
            </div>
            <h1 style="color: #1DB954; font-size: 28px; margin-bottom: 16px;">
              Здравей, ${name}! 👋
            </h1>
            <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
              Благодарим ти, че се присъедини към <strong style="color: #1DB954;">ProZona</strong>!
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://www.prozona.bg/bg/specialist/dashboard"
                style="background: #1DB954; color: #0D0D1A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Попълни профила си →
              </a>
            </div>
            <div style="background: #151528; border: 1px solid #1DB954; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
              <p style="color: #888; font-size: 13px; margin: 0 0 8px;">Твоят реферален линк:</p>
              <a href="${refLink}" style="color: #1DB954; font-size: 14px; word-break: break-all;">${refLink}</a>
            </div>
          </div>
        `
      })

      // Известие към админа
      await resend.emails.send({
        from: 'ProZona <office@prozona.bg>',
        to: process.env.ADMIN_EMAIL!,
        subject: `🆕 Нов специалист: ${name}`,
        html: `
          <p><strong>Нов специалист се регистрира в ProZona:</strong></p>
          <ul>
            <li>Име: ${name}</li>
            <li>Имейл: ${email}</li>
            <li>Телефон: ${phone || '—'}</li>
            <li>Град: ${city || '—'}</li>
            <li>Услуга: ${service || '—'}</li>
            <li>Категория: ${categoryId || '—'}</li>
            <li>Подкатегория: ${subcategoryId || '—'}</li>
          </ul>
          <a href="https://www.prozona.bg/bg/admin/specialists">Виж в админ панела →</a>
        `
      })
    }

    return NextResponse.json(
      { message: 'Успешна регистрация', user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при регистрацията' },
      { status: 500 }
    )
  }
}