'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  specialistId: string
  specialistName: string
  locale: string  // ✅ добавен locale prop
}

export default function ReviewForm({ specialistId, specialistName, locale }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Моля, изберете оценка')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specialistId, rating, comment })
      })

      const data = await res.json()

      if (res.ok) {
        // ✅ беше без locale — сега редиректва правилно
        router.push(`/${locale}/specialist/${specialistId}?review=success`)
      } else {
        setError(data.error || 'Грешка при изпращане')
      }
    } catch (error) {
      console.error('❌ ГРЕШКА:', error)
      setError('Възникна грешка. Опитайте отново.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-300 mb-3">Вашата оценка *</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-600'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
              </svg>
            </button>
          ))}
          <span className="text-gray-400 ml-2">
            {rating > 0 ? `${rating} от 5 звезди` : 'Кликнете за оценка'}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Вашият коментар</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
          placeholder="Споделете вашето мнение за специалиста..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50 transition-colors"
      >
        {loading ? 'Изпращане...' : 'Изпрати отзива'}
      </button>

      <p className="text-center text-gray-500 text-sm">
        Вашият отзив ще помогне на други клиенти да изберат правилния специалист.
      </p>
    </form>
  )
}