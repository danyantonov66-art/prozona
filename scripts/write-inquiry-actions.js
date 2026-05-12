const fs = require("fs");

const actions = `'use client'
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
    await fetch(\`/api/specialist/inquiries/\${inquiryId}/viewed\`, { method: 'POST' })
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
    const res = await fetch(\`/api/specialist/inquiries/\${inquiryId}/reply\`, {
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
`;

const page = `import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import InquiryActions from './InquiryActions'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SpecialistInquiriesPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session) redirect(\`/\${locale}/login\`)

  const specialist = await prisma.specialist.findUnique({
    where: { userId: (session.user as any).id }
  })

  if (!specialist) redirect(\`/\${locale}/become-specialist\`)

  const inquiries = await prisma.inquiry.findMany({
    where: { specialistId: specialist.id },
    orderBy: { createdAt: 'desc' },
    include: {
      InquiryResponse: {
        orderBy: { createdAt: 'asc' }
      }
    }
  })

  const credits = specialist.credits

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Получени запитвания</h1>
            <p className="text-sm text-gray-400 mt-1">
              Общо: {inquiries.length}&nbsp;&middot;&nbsp;
              <span className={credits < 3 ? 'text-red-400' : 'text-[#1DB954]'}>
                {credits} кредита
              </span>
            </p>
          </div>
          <Link href={\`/\${locale}/specialist/dashboard\`} className="text-[#1DB954] hover:underline text-sm">
            &larr; Към таблото
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <p className="text-gray-400 text-xl mb-2">Все още няма запитвания</p>
            <p className="text-gray-500 text-sm">Когато клиент изпрати запитване, ще се появи тук.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{inquiry.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(inquiry.createdAt).toLocaleString('bg-BG', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={\`text-xs px-2 py-1 rounded-full \${
                    inquiry.status === 'PENDING'   ? 'bg-[#1DB954]/20 text-[#1DB954]' :
                    inquiry.status === 'VIEWED'    ? 'bg-yellow-500/20 text-yellow-400' :
                    inquiry.status === 'REPLIED'   ? 'bg-blue-500/20 text-blue-400' :
                    inquiry.status === 'COMPLETED' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-700 text-gray-400'
                  }\`}>
                    {inquiry.status === 'PENDING'   ? 'Ново' :
                     inquiry.status === 'VIEWED'    ? 'Прочетено' :
                     inquiry.status === 'REPLIED'   ? 'Отговорено' :
                     inquiry.status === 'COMPLETED' ? 'Завършено' : inquiry.status}
                  </span>
                </div>

                <div className="mb-3 rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Запитване от клиента</p>
                  <p className="text-gray-300 whitespace-pre-line">{inquiry.message}</p>
                </div>

                <div className="flex gap-4 text-sm text-gray-400 mb-4 flex-wrap">
                  <span>{inquiry.email}</span>
                  {inquiry.phone && <span>{inquiry.phone}</span>}
                  {inquiry.city && <span>{inquiry.city}</span>}
                </div>

                {inquiry.InquiryResponse.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Вашите отговори</p>
                    {inquiry.InquiryResponse.map((resp) => (
                      <div key={resp.id} className="rounded-xl border border-[#1DB954]/20 bg-[#1DB954]/5 px-4 py-3">
                        <p className="text-gray-200 whitespace-pre-line text-sm">{resp.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(resp.createdAt).toLocaleString('bg-BG', {
                            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                          })}
                          {' · 1 кредит'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <InquiryActions
                  inquiryId={inquiry.id}
                  status={inquiry.status}
                  credits={credits}
                  hasReplied={inquiry.InquiryResponse.length > 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
`;

fs.writeFileSync("app/[locale]/specialist/inquiries/InquiryActions.tsx", actions, "utf8");
fs.writeFileSync("app/[locale]/specialist/inquiries/page.tsx", page, "utf8");
console.log("Done — both files written.");