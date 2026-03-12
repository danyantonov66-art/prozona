import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover' as any,
})

const PLANS: Record<string, { name: string; priceEur: number; credits: number; mode: 'payment' | 'subscription' }> = {
  credits_5:       { name: '5 кредита',         priceEur: 2.99,  credits: 5,  mode: 'payment' },
  credits_15:      { name: '15 кредита',         priceEur: 6.99,  credits: 15, mode: 'payment' },
  credits_30:      { name: '30 кредита',         priceEur: 11.99, credits: 30, mode: 'payment' },
  basic_monthly:   { name: 'Базов абонамент',    priceEur: 4.99,  credits: 5,  mode: 'subscription' },
  premium_monthly: { name: 'Премиум абонамент',  priceEur: 9.99,  credits: 15, mode: 'subscription' },
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { planType } = body

    const plan = PLANS[planType]
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prozona.bg'
    const amountBgn = Math.round(plan.priceEur * 1.95583 * 100)

    if (plan.mode === 'subscription') {
      // За абонамент трябва предварително създаден Price в Stripe
      // Засега го правим като еднократно плащане
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'bgn',
            product_data: {
              name: `ProZona – ${plan.name}`,
              description: `${plan.credits} кредита за ProZona`,
            },
            unit_amount: amountBgn,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: (session.user as any).id,
        planType,
        credits: plan.credits,
      },
      success_url: `${appUrl}/bg/specialist/buy-credits?success=1&credits=${plan.credits}`,
      cancel_url: `${appUrl}/bg/specialist/buy-credits?cancelled=1`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
