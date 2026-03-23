import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const REFERRAL_CREDITS = 5

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'guerrillamail.net',
  'guerrillamail.org', 'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'throwam.com', 'throwaway.email', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.at', 'trashmail.io', 'trashmail.org', 'yopmail.com', 'yopmail.fr',
  'yopmail.net', 'cool.fr.nf', 'jetable.fr.nf', 'nospam.ze.tc', 'nomail.xl.cx',
  'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf', 'moncourrier.fr.nf',
  'monemail.fr.nf', 'monmail.fr.nf', 'dispostable.com', 'mailnesia.com',
  'mailnull.com', 'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'spam4.me', 'spamfree24.org', 'spamfree24.de', 'spamfree24.eu', 'spamfree24.info',
  'spamfree24.net', 'spamfree.eu', 'temporaryemail.net', 'tempinbox.com',
  'tempinbox.co.uk', 'fakeinbox.com', 'mailtemp.info', 'sharklasers.com',
  'guerrillamailblock.com', 'grr.la', 'spam.la', 'maildrop.cc',
  'discard.email', 'spamhereplease.com', 'spamherelots.com', 'spaml.de',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.de',
  'minutemail.com', 'tempmail.net', 'tempmail.org', 'temp-mail.org', 'temp-mail.io',
  'tempr.email', 'crazymailing.com', 'spamgob.com', 'mailscrap.com',
  'mytemp.email', 'spambox.us', 'getairmail.com',
])

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return !!domain && DISPOSABLE_DOMAINS.has(domain)
}

function generateRefCode(name: string, id: string): string {
  return Buffer.from(`${name}-${id}`).toString('base64').slice(0, 8).toUpperCase()
}

function containsContactInfo(text: string): boolean {
  const patterns = [
    /(\+359|08|00359)\s?[\d\s\-]{8,}/,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /(https?:\/\/|www\.)/i,
    /facebook\.com|instagram\.com|viber|whatsapp/i,
  ]
  return patterns.some((p) => p.test(text))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role, phone, city, description, categoryId, subcategoryId, ref } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Липсващи задължителни полета' }, { status: 400 })
    }

    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: 'Моля, използвайте истински имейл адрес. Временни имейли не се приемат.' },
        { status: 400 }
      )
    }

    if (description && containsContactInfo(description)) {
      return NextResponse.json(
        { error: 'Описанието не може да съдържа телефон, имейл или линкове.' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Потребител с този имейл вече съществува' }, { status: 400 })
    }

    // ✅ Намери поканващия по refCode
    let referrer: { id: string } | null = null
    if (ref && role === 'SPECIALIST') {
      referrer = await prisma.specialist.findUnique({
        where: { refCode: ref },
        select: { id: true }
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verifyToken = crypto.randomBytes(32).toString('hex')

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
          referredBy: referrer ? ref : null,
        }
      })

      // ✅ Генерирай refCode за новия специалист
      const refCode = generateRefCode(name, specialist.id)
      await prisma.specialist.update({
        where: { id: specialist.id },
        data: { refCode }
      })

      // ✅ Награди поканващия с 5 кредита
      if (referrer) {
        await prisma.specialist.update({
          where: { id: referrer.id },
          data: {
            credits: { increment: REFERRAL_CREDITS },
            referralCount: { increment: 1 },
            referralCreditsEarned: { increment: REFERRAL_CREDITS },
          }
        })
        await prisma.creditTransaction.create({
          data: {
            id: crypto.randomUUID(),
            specialistId: referrer.id,
            amount: REFERRAL_CREDITS,
            type: 'BONUS',
            description: `Реферал бонус — ${name} се регистрира с твоя линк`,
          }
        })
      }

      if (categoryId && subcategoryId) {
        const dbCategory = await prisma.category.findUnique({ where: { slug: categoryId } })
        if (dbCategory) {
          const dbSubcategory = await prisma.subcategory.findFirst({
            where: { slug: subcategoryId, categoryId: dbCategory.id }
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

      const refLink = `https://www.prozona.bg/bg/register/specialist?ref=${refCode}`
      const verifyLink = `https://www.prozona.bg/api/auth/verify-email?token=${verifyToken}&id=${user.id}`

      await resend.emails.send({
        from: 'ProZona <office@prozona.bg>',
        to: email,
        subject: '✅ Потвърди имейла си — ProZona',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
                <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">PZ ProZona</span>
              </div>
            </div>
            <h1 style="color: #1DB954; font-size: 28px; margin-bottom: 16px;">Здравей, ${name}! 👋</h1>
            <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">
              Благодарим ти, че се регистрира в <strong style="color: #1DB954;">ProZona</strong>!
              Моля потвърди имейла си за да активираш профила си.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verifyLink}" style="background: #1DB954; color: #0D0D1A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                ✅ Потвърди имейла си →
              </a>
            </div>
            <p style="color: #666; font-size: 13px; text-align: center;">Линкът е валиден 24 часа.</p>
            <hr style="border: 1px solid #333; margin: 32px 0;" />
            <div style="background: #151528; border: 1px solid #1DB954; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center;">
              <p style="color: #888; font-size: 13px; margin: 0 0 8px;">Твоят реферален линк — сподели с колеги:</p>
              <a href="${refLink}" style="color: #1DB954; font-size: 14px; word-break: break-all;">${refLink}</a>
            </div>
          </div>
        `
      })

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
            <li>Реферал от: ${ref || '—'}</li>
          </ul>
          <a href="https://www.prozona.bg/bg/admin/specialists">Виж в админ панела →</a>
        `
      })
    }

    return NextResponse.json(
      { message: 'Успешна регистрация! Провери имейла си за потвърждение.', user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Възникна грешка при регистрацията' }, { status: 500 })
  }
}