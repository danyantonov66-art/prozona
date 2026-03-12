import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '../../../../lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
})

const PLANS: Record<string, number> = {
  credits_5: 5,
  credits_15: 15,
  credits_30: 30,
  basic_monthly: 10,
  premium_monthly: 25,
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

    const creditsToAdd = PLANS[planType] || parseInt(credits || '0')

    try {
      const specialist = await prisma.specialist.findUnique({ where: { userId } })
      if (!specialist) {
        console.error('Specialist not found for userId:', userId)
        return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
      }

      await prisma.specialist.update({
        where: { userId },
        data: { credits: { increment: creditsToAdd } },
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

      console.log(`Added ${creditsToAdd} credits to specialist ${specialist.id}`)
    } catch (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}