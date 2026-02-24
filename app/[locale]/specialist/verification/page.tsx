// app/specialist/verification/page.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerificationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [documents, setDocuments] = useState({
    idCard: null,
    license: null,
    insurance: null,
    certificate: null
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Зареждане...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'SPECIALIST') {
    router.push('/login')
    return null
  }

  const handleFileUpload = (type: string) => {
    // Тук ще интегрираме Cloudinary или друг storage
    console.log(`Uploading ${type}...`)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/specialist/verification/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents })
      })

      if (res.ok) {
        setMessage('Заявката за верификация е изпратена успешно!')
        setTimeout(() => router.push('/specialist/dashboard'), 3000)
      } else {
        const data = await res.json()
        setMessage(data.error || 'Грешка при изпращане')
      }
    } catch (error) {
      setMessage('Възникна грешка. Опитайте отново.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/specialist/dashboard" className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <div className="bg-[#1A1A2E] rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Верификация на профил</h1>
          <p className="text-gray-400 mb-6">
            Потвърдете самоличността си и получете значка "Проверен специалист"
          </p>

          {/* Стъпки */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-[#1DB954] text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {i}
                </div>
                <p className="text-xs mt-1 text-gray-400">
                  {i === 1 && 'Лична карта'}
                  {i === 2 && 'Документи'}
                  {i === 3 && 'Финален'}
                </p>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Стъпка 1: Лична карта</h2>
              <p className="text-gray-400">Качете снимка на личната си карта (лицева и задна страна)</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-[#1DB954] transition-colors">
                  <input type="file" accept="image/*" className="hidden" id="idFront" />
                  <label htmlFor="idFront" className="cursor-pointer block">
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-white">Лицева страна</p>
                    <p className="text-gray-500 text-xs mt-1">Кликни за качване</p>
                  </label>
                </div>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-[#1DB954] transition-colors">
                  <input type="file" accept="image/*" className="hidden" id="idBack" />
                  <label htmlFor="idBack" className="cursor-pointer block">
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-white">Задна страна</p>
                    <p className="text-gray-500 text-xs mt-1">Кликни за качване</p>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
              >
                Продължи
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Стъпка 2: Професионални документи</h2>
              <p className="text-gray-400">Качете документи за вашата квалификация (дипломи, сертификати, лицензи)</p>
              
              <div className="space-y-3">
                <div className="border border-gray-700 rounded-lg p-4">
                  <label className="block text-white mb-2">Диплома/Сертификат</label>
                  <input type="file" accept="image/*,.pdf" className="w-full text-white" />
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <label className="block text-white mb-2">Лиценз (ако имате)</label>
                  <input type="file" accept="image/*,.pdf" className="w-full text-white" />
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <label className="block text-white mb-2">Застраховка (ако имате)</label>
                  <input type="file" accept="image/*,.pdf" className="w-full text-white" />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
                >
                  Продължи
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Стъпка 3: Потвърждение</h2>
              <p className="text-gray-400">Прегледайте и изпратете документите за проверка</p>
              
              <div className="bg-[#0D0D1A] rounded-lg p-4">
                <p className="text-white mb-2">Декларирам, че:</p>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#1DB954]">✓</span>
                    Предоставените документи са истински
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1DB954]">✓</span>
                    Имам право да практикувам професията
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#1DB954]">✓</span>
                    Съгласявам се документите да бъдат проверени
                  </li>
                </ul>
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.includes('успешно') 
                    ? 'bg-green-500/10 border border-green-500 text-green-500' 
                    : 'bg-red-500/10 border border-red-500 text-red-500'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Назад
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50"
                >
                  {loading ? 'Изпращане...' : 'Изпрати за верификация'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}