// app/api/stripe/create-checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Моля, влезте в профила си' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planType, specialistId } = body;

    // Намери специалиста
    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id }
    });

    if (!specialist) {
      return NextResponse.json(
        { error: 'Специалистът не е намерен' },
        { status: 404 }
      );
    }

    // Определи параметрите според плана
    let priceId: string;
    let mode: Stripe.Checkout.SessionCreateParams.Mode;
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // ════════════════════════════════════════════════════════════
    // 🔥 Price ID-та от Stripe (актуализирани на 23.02.2026)
    // ════════════════════════════════════════════════════════════
    
    switch (planType) {
      case 'basic_monthly':
        priceId = 'price_1T3qM0LSYKGf1eB9s0vIu5sK'; // Базов месечен (€4.99)
        mode = 'subscription';
        lineItems = [{ price: priceId, quantity: 1 }];
        break;
        
      case 'premium_monthly':
        priceId = 'price_1T3qKkLSYKGf1eB9eOODBqJf'; // Премиум месечен (€9.99)
        mode = 'subscription';
        lineItems = [{ price: priceId, quantity: 1 }];
        break;
        
      case 'credits_5':
        priceId = 'price_1T3qhyLSYKGf1eB9ZRU8x58y'; // 5 кредита (€2.99)
        lineItems = [{ price: priceId, quantity: 1 }];
        mode = 'payment';
        break;
        
      case 'credits_15':
        priceId = 'price_1T3qgtLSYKGf1eB9GamgDTPC'; // 15 кредита (€6.99)
        lineItems = [{ price: priceId, quantity: 1 }];
        mode = 'payment';
        break;
        
      case 'credits_30':
        priceId = 'price_1T3qf1LSYKGf1eB9p0zizP6z'; // 30 кредита (€11.99)
        lineItems = [{ price: priceId, quantity: 1 }];
        mode = 'payment';
        break;
        
      default:
        return NextResponse.json(
          { error: 'Невалиден тип план' },
          { status: 400 }
        );
    }

    // ════════════════════════════════════════════════════════════
    // КРАЙ НА Price ID-тата
    // ════════════════════════════════════════════════════════════

    // Създаване на Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode,
      success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/payment/cancel`,
      metadata: {
        userId: session.user.id,
        specialistId: specialist.id,
        planType,
      },
      client_reference_id: session.user.id,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_email: session.user.email!,
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Възникна грешка при създаване на плащане' },
      { status: 500 }
    );
  }
}