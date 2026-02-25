'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

type Props = {
  specialistId?: string
  plan?: 'basic' | 'pro'
  // backward-compatible alias (ползва се в buy-credits/page.tsx)
  planType?: string
  label?: string
  className?: string
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

export default function CheckoutButton({
  specialistId,
  plan,
  planType,
  label = 'Плати',
  className = '',
}: Props) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const resolvedPlan = (plan ?? (planType === 'pro' ? 'pro' : 'basic')) as 'basic' | 'pro'

  const handleCheckout = async () => {
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // backend да приема plan (basic/pro) и евентуално specialistId ако ти трябва
        body: JSON.stringify({ specialistId, plan: resolvedPlan }),
      })

      const data: { sessionId?: string; error?: string } = await res.json()

      if (!res.ok) {
        setErrorMsg(data?.error || 'Грешка при създаване на checkout сесия.')
        return
      }

      if (!data?.sessionId) {
        setErrorMsg('Липсва sessionId от сървъра.')
        return
      }

      const stripe = await stripePromise
      if (!stripe) {
        setErrorMsg('Stripe не можа да се зареди.')
        return
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (error) {
        setErrorMsg(error.message || 'Stripe checkout грешка.')
      }
    } catch {
      setErrorMsg('Неуспешна заявка. Опитай отново.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button type="button" onClick={handleCheckout} disabled={loading} className={className}>
        {loading ? 'Обработва се…' : label}
      </button>

      {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}
    </div>
  )
}