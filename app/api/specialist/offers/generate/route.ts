import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface GenerateOfferBody {
  clientName?: string
  serviceDescription: string
  materials?: string
  estimatedPrice?: string
  durationDays?: string
  warrantyMonths?: string
  notes?: string
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        businessName: true,
        phone: true,
        city: true,
        subscriptionPlan: true,
        subscriptionExpiresAt: true,
      }
    })

    if (!specialist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const isPremiumActive =
      specialist.subscriptionPlan === 'PREMIUM' &&
      (!specialist.subscriptionExpiresAt || specialist.subscriptionExpiresAt > new Date())

    if (!isPremiumActive) {
      return NextResponse.json(
        { error: 'PREMIUM_REQUIRED', message: 'Генераторът на оферти е достъпен само за Premium специалисти.' },
        { status: 403 }
      )
    }

    const body: GenerateOfferBody = await req.json()

    if (!body.serviceDescription || body.serviceDescription.trim().length < 5) {
      return NextResponse.json({ error: 'Опиши накратко каква услуга предлагаш.' }, { status: 400 })
    }

    const prompt = `Ти си помощник, който съставя кратки професионални търговски оферти на български език за майстори и специалисти (ВиК, ел. инсталации, ремонти и др.), които ще бъдат изпратени директно на клиент.

Данни за специалиста:
- Фирма/име: ${specialist.businessName || 'Не е посочено'}
- Град: ${specialist.city}
- Телефон: ${specialist.phone || 'Не е посочен'}

Данни за офертата:
- Клиент: ${body.clientName || 'не е посочен, остави поле за попълване'}
- Описание на услугата/работата: ${body.serviceDescription}
- Материали: ${body.materials || 'не е посочено'}
- Приблизителна цена: ${body.estimatedPrice || 'не е посочена, предложи разумен диапазон'}
- Срок за изпълнение: ${body.durationDays || 'не е посочен'}
- Гаранция: ${body.warrantyMonths || 'не е посочена, предложи стандартна гаранция за този тип работа'}
- Допълнителни бележки: ${body.notes || 'няма'}

Състави готова за изпращане оферта на български със следната структура, използвай ясни секции с emoji-заглавия:

📋 ОФЕРТА ЗА УСЛУГА

[кратко обръщение към клиента]

🔧 Описание на работата
[2-4 изречения]

📦 Материали
[списък или кратко описание]

💰 Цена
[конкретна сума или диапазон]

⏱️ Срок за изпълнение
[конкретен срок]

✅ Гаранция
[условия]

📞 Контакт
[име на фирма, телефон]

Отговори само с готовия текст на офертата, без увод и без обяснения преди или след нея.`

    const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!apiResponse.ok) {
      const errText = await apiResponse.text()
      console.error('Claude API error:', errText)
      return NextResponse.json({ error: 'Грешка при генериране на офертата. Опитай отново.' }, { status: 502 })
    }

    const data = await apiResponse.json()
    const offerText = data.content
      ?.filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n') || ''

    if (!offerText) {
      return NextResponse.json({ error: 'Празен отговор от AI. Опитай отново.' }, { status: 502 })
    }

    return NextResponse.json({ offer: offerText })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
