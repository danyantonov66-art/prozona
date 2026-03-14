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
  basic_monthly:   { credits: 10, plan: 'BASIC' },
  premium_monthly: { credits: 25, plan: 'PREMIUM' },
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event: Stripe.Event
  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } else {
      event = JSON.parse(body)
    }
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { userId, planType, credits } = session.metadata || {}

    if (!userId || !planType) {
      console.error('Missing metadata:', session.metadata)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const planConfig = PLANS[planType]
    const creditsToAdd = planConfig?.credits || parseInt(credits || '0')

    try {
      const specialist = await prisma.specialist.findUnique({ where: { userId } })
      if (!specialist) {
        console.error('Specialist not found for userId:', userId)
        return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
      }

      // Обнови кредити + план ако е абонамент
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

      await prisma.specialist.update({
        where: { userId },
        data: updateData,
      })

      await prisma.creditTransaction.create({
        data: {
          id: session.id,
          specialistId: specialist.id,
          amount: creditsToAdd,
          type: 'PURCHASE',
          description: `Закупен план: ${planType}`,
          price: (session.amount_total || 0) / 100,
        },
      })

      await prisma.payment.create({
        data: {
          id: session.payment_intent as string || session.id,
          userId,
          specialistId: specialist.id,
          amount: (session.amount_total || 0) / 100,
          status: 'COMPLETED',
          type: 'CREDIT_PURCHASE',
          credits: creditsToAdd,
          updatedAt: new Date(),
        },
      })

      console.log(`Added ${creditsToAdd} credits + plan ${planConfig?.plan || 'none'} to specialist ${specialist.id}`)
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}