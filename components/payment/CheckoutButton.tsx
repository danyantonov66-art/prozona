'use client'
import { useState } from 'react'

type Props = {
  specialistId?: string
  planType?: string
  price?: number
  credits?: number
  label?: string
  className?: string
}

export default function CheckoutButton({
  planType,
  price,
  credits,
  label = 'Плати',
  className = '',
}: Props) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType, price, credits }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data?.error || 'Грешка при създаване на checkout сесия.')
        return
      }
      if (data?.url) {
        window.location.href = data.url
      } else {
        setErrorMsg('Липсва URL от сървъра.')
      }
    } catch {
      setErrorMsg('Неуспешна заявка. Опитай отново.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? 'Обработва се…' : label}
      </button>
      {errorMsg && <p className="mt-2 text-sm text-red-500">{errorMsg}</p>}
    </div>
  )
}
