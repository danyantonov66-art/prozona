// app/specialist/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SpecialistDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inquiryCount, setInquiryCount] = useState(0)
  const [credits, setCredits] = useState(0)
  const [plan, setPlan] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'SPECIALIST') {
      router.push('/login')
    } else {
      fetchSpecialistData()
      fetchInquiryCount()
    }
  }, [session, status, router])

  const fetchSpecialistData = async () => {
    try {
      const res = await fetch('/api/specialist/me')
      const data = await res.json()
      if (res.ok) {
        setCredits(data.credits || 0)
        setPlan(data.subscriptionPlan || 'FREE')
        setVerificationStatus(data.verified ? 'verified' : 'pending')
      }
    } catch (error) {
      console.error('Error fetching specialist data:', error)
    }
  }

  const fetchInquiryCount = async () => {
    try {
      const res = await fetch('/api/specialist/inquiries/count')
      const data = await res.json()
      if (res.ok) {
        setInquiryCount(data.count || 0)
      }
    } catch (error) {
      console.error('Error fetching inquiry count:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Зареждане...</div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'SPECIALIST') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
          <span className="text-white">Здравей, {session.user?.name}</span>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Табло за специалисти</h1>
        
        {/* Информация за план и кредити */}
        <div className="bg-[#1A1A2E] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400">Текущ план</p>
              <p className="text-2xl font-bold text-white">
                {plan === 'FREE' && '🆓 Безплатен'}
                {plan === 'BASIC' && '💰 Базов'}
                {plan === 'PREMIUM' && '💎 Премиум'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Налични кредити</p>
              <p className="text-2xl font-bold text-[#1DB954]">{credits}</p>
            </div>
          </div>
        </div>

        {/* Карти с функции */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Карта с профил */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Моят профил</h2>
            <p className="text-gray-400 mb-4">Виж и редактирай своя публичен профил</p>
            <Link 
              href={`/specialist/${session.user?.id}`} 
              className="text-[#1DB954] hover:underline inline-flex items-center gap-1"
            >
              Виж профила
              <span>→</span>
            </Link>
          </div>

          {/* Карта със запитвания */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors relative">
            {inquiryCount > 0 && (
              <span className="absolute top-4 right-4 bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full">
                {inquiryCount} нови
              </span>
            )}
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Запитвания</h2>
            <p className="text-gray-400 mb-4">Прегледай получените запитвания от клиенти</p>
            <Link 
              href="/specialist/inquiries" 
              className="text-[#1DB954] hover:underline inline-flex items-center gap-1"
            >
              Виж запитванията
              <span>→</span>
            </Link>
          </div>

          {/* Карта със статистики */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Статистики</h2>
            <p className="text-gray-400 mb-4">Прегледай преглеждания и запитвания</p>
            <Link 
              href="/specialist/stats" 
              className="text-[#1DB954] hover:underline inline-flex items-center gap-1"
            >
              Виж статистиките
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Бързи действия */}
        <div className="mt-8 bg-[#1A1A2E] rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Бързи действия</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/specialist/profile/edit" 
              className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
            >
              ✏️ Редактирай профил
            </Link>
            <Link 
              href="/specialist/gallery" 
              className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] transition-colors"
            >
              🖼️ Добави снимки
            </Link>
            <Link 
              href="/specialist/prices" 
              className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] transition-colors"
            >
              💰 Ценова листа
            </Link>
            <Link 
              href="/specialist/buy-credits" 
              className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] transition-colors"
            >
              💳 Закупи кредити
            </Link>
            <Link 
              href="/specialist/suggest-category" 
              className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] transition-colors"
            >
              📋 Предложи категория
            </Link>
            {/* НОВ БУТОН - Верификация */}
            <Link 
              href="/specialist/verification" 
              className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a] transition-colors flex items-center gap-1"
            >
              ✓ Верификация
              {verificationStatus === 'verified' && (
                <span className="ml-1 text-[#1DB954]">✅</span>
              )}
            </Link>
          </div>
        </div>

        {/* Информация за предложения */}
        <div className="mt-6 bg-[#1A1A2E] rounded-lg p-6 border border-[#1DB954]/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#1DB954]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[#1DB954] text-xl">💡</span>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Не намирате точната категория?</h3>
              <p className="text-gray-400 text-sm mb-3">
                Ако вашата услуга не се вписва в съществуващите категории, можете да предложите нова. 
                Нашият екип ще я прегледа и добави възможно най-скоро.
              </p>
              <Link 
                href="/specialist/suggest-category" 
                className="text-[#1DB954] text-sm hover:underline inline-flex items-center gap-1"
              >
                Предложи нова категория
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}