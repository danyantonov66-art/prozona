// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '../../../../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
})

const PLANS: Record<string, { credits: number; plan?: string }> = {
  credits_5:       { credits: 5 },
  credits_15:      { credits: 15 },
  credits_30:      { credits: 30 },
  basic_monthly:   { credits: 5,  plan: 'BASIC' },
  premium_monthly: { credits: 15, plan: 'PREMIUM' },
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  // Подписът е ЗАДЪЛЖИТЕЛЕН. Без него всеки може да изпрати фалшиво събитие.
  if (!webhookSecret || !sig) {
    console.error('Webhook rejected: missing STRIPE_WEBHOOK_SECRET or stripe-signature header')
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Плащане, което още не е платено (асинхронни методи) - не даваме кредити
    if (session.payment_status !== 'paid') {
      console.log('Session not paid yet, skipping:', session.id, session.payment_status)
      return NextResponse.json({ received: true })
    }

    const { userId, specialistId, planType, credits } = session.metadata || {}

    if (!userId || !planType) {
      console.error('Missing metadata:', session.metadata)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const planConfig = PLANS[planType]
    const creditsToAdd = planConfig?.credits || parseInt(credits || '0')

    try {
      // Вече обработена сесия (повторно изпращане от Stripe или ръчен Resend)
      const already = await prisma.creditTransaction.findUnique({ where: { id: session.id } })
      if (already) {
        console.log('Duplicate webhook, already processed:', session.id)
        return NextResponse.json({ received: true, duplicate: true })
      }

      let specialist
      if (specialistId) {
        specialist = await prisma.specialist.findUnique({ where: { id: specialistId } })
      } else {
        specialist = await prisma.specialist.findUnique({ where: { userId } })
      }

      if (!specialist) {
        console.error('Specialist not found. userId:', userId, 'specialistId:', specialistId)
        return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
      }

      const updateData: any = {
        credits: { increment: creditsToAdd },
      }

      if (planConfig?.plan) {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
        updateData.subscriptionPlan = planConfig.plan
        updateData.subscriptionExpiresAt = expiresAt
        if (planConfig.plan === 'PREMIUM') {
          updateData.isFeatured = true
          updateData.featuredExpiresAt = expiresAt
          updateData.priorityInquiries = true
        }
      }

      // Всичко или нищо. Записът на CreditTransaction (id = session.id) е първи,
      // така че при дубликат транзакцията пада ПРЕДИ да се добавят кредити.
      await prisma.$transaction([
        prisma.creditTransaction.create({
          data: {
            id: session.id,
            specialistId: specialist.id,
            amount: creditsToAdd,
            type: 'PURCHASE',
            description: `Закупен план: ${planType}`,
            price: (session.amount_total || 0) / 100,
          },
        }),
        prisma.specialist.update({
          where: { id: specialist.id },
          data: updateData,
        }),
        prisma.payment.create({
          data: {
            id: (session.payment_intent as string) || session.id,
            userId,
            specialistId: specialist.id,
            amount: (session.amount_total || 0) / 100,
            status: 'COMPLETED',
            type: 'CREDIT_PURCHASE',
            credits: creditsToAdd,
            updatedAt: new Date(),
          },
        }),
      ])

      console.log(`Added ${creditsToAdd} credits to specialist ${specialist.id}`)
    } catch (error: any) {
      // Паралелно изпълнение на същото събитие: другото вече е записало сесията
      if (error?.code === 'P2002') {
        const done = await prisma.creditTransaction.findUnique({ where: { id: session.id } })
        if (done) {
          console.log('Duplicate webhook (race), already processed:', session.id)
          return NextResponse.json({ received: true, duplicate: true })
        }
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}