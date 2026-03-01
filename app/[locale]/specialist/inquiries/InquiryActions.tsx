'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  inquiryId: string
  status: string
}

export default function InquiryActions({ inquiryId, status }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState('')
  const [showReply, setShowReply] = useState(false)

  const markAsViewed = async () => {
    setLoading(true)
    await fetch(`/api/specialist/inquiries/${inquiryId}/viewed`, { method: 'POST' })
    router.refresh()
    setLoading(false)
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    setLoading(true)
    await fetch(`/api/specialist/inquiries/${inquiryId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply })
    })
    setReply('')
    setShowReply(false)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="mt-4">
      {showReply && (
        <div className="mb-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Напишете отговор..."
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={sendReply}
              disabled={loading || !reply.trim()}
              className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50"
            >
              {loading ? 'Изпращане...' : 'Изпрати отговора'}
            </button>
            <button
              onClick={() => setShowReply(false)}
              className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg"
            >
              Откажи
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={() => setShowReply(!showReply)}
          className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
        >
          Отговори (1 кредит)
        </button>
        {status === 'PENDING' && (
          <button
            onClick={markAsViewed}
            disabled={loading}
            className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] disabled:opacity-50"
          >
            Маркирай като прочетено
          </button>
        )}
      </div>
    </div>
  )
}