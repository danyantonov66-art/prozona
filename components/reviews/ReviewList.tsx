// components/reviews/ReviewList.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface Review {
  id: string
  rating: number
  comment: string | null
  response: string | null
  responseAt: string | null
  createdAt: string
  isVerified: boolean
  client: {
    name: string
    avatar?: string
  }
}

interface ReviewListProps {
  reviews: Review[]
  specialistId: string
  specialistUserId?: string
}

export default function ReviewList({ reviews, specialistId, specialistUserId }: ReviewListProps) {
  const { data: session } = useSession()
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [loading, setLoading] = useState(false)

  const isSpecialist = session?.user?.id === specialistUserId

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/review/${reviewId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText })
      })

      if (res.ok) {
        setRespondingTo(null)
        setResponseText('')
        // Презареди страницата или обнови state-а
        window.location.reload()
      } else {
        const data = await res.json()
        alert(data.error || 'Грешка при изпращане')
      }
    } catch (error) {
      console.error('Error submitting response:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-[#1A1A2E] rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold">{review.client.name}</span>
                {review.isVerified && (
                  <span className="bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded-full">
                    ✓ Верифициран клиент
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  {new Date(review.createdAt).toLocaleDateString('bg-BG')}
                </span>
              </div>
            </div>
          </div>

          {review.comment && (
            <p className="text-gray-300 mb-4">{review.comment}</p>
          )}

          {review.response && (
            <div className="mt-4 pl-4 border-l-2 border-[#1DB954]">
              <p className="text-gray-400 text-sm mb-1">Отговор от специалиста:</p>
              <p className="text-white">{review.response}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(review.responseAt!).toLocaleDateString('bg-BG')}
              </p>
            </div>
          )}

          {isSpecialist && !review.response && respondingTo !== review.id && (
            <button
              onClick={() => setRespondingTo(review.id)}
              className="mt-4 text-sm text-[#1DB954] hover:underline"
            >
              Отговори
            </button>
          )}

          {respondingTo === review.id && (
            <div className="mt-4">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Напишете вашия отговор..."
                className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSubmitResponse(review.id)}
                  disabled={loading || !responseText.trim()}
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50"
                >
                  {loading ? 'Изпращане...' : 'Изпрати'}
                </button>
                <button
                  onClick={() => {
                    setRespondingTo(null)
                    setResponseText('')
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Отказ
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}