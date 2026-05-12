'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  inquiryId: string
  status: string
  credits: number
  hasReplied: boolean
}

export default function InquiryActions({ inquiryId, status, credits, hasReplied }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState('')
  const [showReply, setShowReply] = useState(false)
  const [error, setError] = useState('')

  const markAsViewed = async () => {
    setLoading(true)
    await fetch(`/api/specialist/inquiries/${inquiryId}/viewed`, { method: 'POST' })
    router.refresh()
    setLoading(false)
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    if (credits < 1) {
      setError('Нямате достатъчно кредити. Купете кредити от таблото.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch(`/api/specialist/inquiries/${inquiryId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply })
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Грешка при изпращане')
      setLoading(false)
      return
    }
    setReply('')
    setShowReply(false)
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="mt-2">
      {error && (
        <p className="text-red-400 text-sm mb-2">{error}</p>
      )}

      {showReply && (
        <div className="mb-3">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={3}
            placeholder="Напишете отговор... (1 кредит)"
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white mb-2 text-sm resize-none focus:border-[#1DB954] outline-none"
          />
          <div className="flex gap-2 items-center">
            <button
              onClick={sendReply}
              disabled={loading || !reply.trim() || credits < 1}
              className="px-4 py-2 bg-[#1DB954] text-black font-medium rounded-lg hover:bg-[#169b43] disabled:opacity-50 text-sm"
            >
              {loading ? 'Изпращане...' : 'Изпрати отговор'}
            </button>
            <button
              onClick={() => { setShowReply(false); setError('') }}
              className="px-4 py-2 bg-transparent border border-gray-700 text-gray-400 rounded-lg text-sm"
            >
              Откажи
            </button>
            {credits < 3 && (
              <span className="text-xs text-yellow-400 ml-auto">
                Остават {credits} кредита
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => { setShowReply(!showReply); setError('') }}
          className="px-4 py-2 bg-[#1DB954] text-black font-medium rounded-lg hover:bg-[#169b43] text-sm"
        >
          {hasReplied ? 'Отговори отново' : 'Отговори'}
        </button>
        {status === 'PENDING' && (
          <button
            onClick={markAsViewed}
            disabled={loading}
            className="px-4 py-2 bg-transparent border border-gray-700 text-gray-400 rounded-lg hover:bg-[#25253a] disabled:opacity-50 text-sm"
          >
            Маркирай като прочетено
          </button>
        )}
      </div>
    </div>
  )
}
