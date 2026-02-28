// app/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ClientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale || 'bg'
  const [inquiries, setInquiries] = useState([])

  useEffect(() => {
  if (status === 'loading') return
  if (!session) {
    router.push('/login')
    return
  }
  if ((session.user as any)?.role === 'ADMIN') {
    router.push('/bg/admin')
    return
  }
}, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Зареждане...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href={`/${locale}/categories`} className="text-gray-300 hover:text-white">Категории</Link>
            <Link href={`/${locale}/how-it-works`} className="text-gray-300 hover:text-white">Как работи</Link>
            <Link href={`/${locale}/for-specialists`} className="text-gray-300 hover:text-white">За специалисти</Link>
          </nav>
          
          <div className="flex gap-3 items-center">
            <span className="text-white hidden md:inline">
              Здравей, {session.user?.name}
            </span>
            <Link 
              href={`/${locale}/become-specialist`} 
              className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors text-sm"
            >
              Предлагай услуги
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Link href={`/${locale}`} className="hover:text-[#1DB954]">Начало</Link>
          <span>/</span>
          <span className="text-white">Моето табло</span>
        </div>
      </div>

      {/* Основно съдържание */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Моето табло</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Карта с профил */}
          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Моят профил</h2>
            <p className="text-gray-400 mb-2">{session.user?.email}</p>
            {session.user?.role === 'ADMIN' ? 'Администратор' : session.user?.role === 'SPECIALIST' ? 'Специалист' : 'Клиент'}
            <Link 
              href={`/${locale}/specialist/profile/edit`} 
              className="text-[#1DB954] hover:underline inline-flex items-center gap-1"
            >
              Редактирай
              <span>→</span>
            </Link>
          </div>

          {/* Карта със запитвания */}
          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Моите запитвания</h2>
            <p className="text-gray-400 mb-4">Прегледай всички ваши запитвания</p>
            <Link 
              href={`/${locale}/dashboard/inquiries`} 
              className="text-[#1DB954] hover:underline inline-flex items-center gap-1"
            >
              Виж всички
              <span>→</span>
            </Link>
          </div>

          {/* Карта с любими */}
          <div className="bg-[#1A1A2E] rounded-lg p-6">
            <div className="w-12 h-12 bg-[#1DB954]/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">❤️</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Любими специалисти</h2>
            <p className="text-gray-400 mb-4">Специалисти, които сте запазили</p>
            <Link 
              href={`/${locale}/dashboard/favorites`} 
              className="text-[#1DB954] hover:underline inline-flex items-center gap-1"
            >
              Виж любими
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* БУТОН ЗА ПРЕДЛАГАНЕ НА УСЛУГИ */}
        <div className="bg-gradient-to-r from-[#1DB954] to-[#169b43] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Имате умения, които предлагате?
          </h2>
          <p className="text-white text-lg mb-6">
            Предложете услугите си на хиляди клиенти във вашия град!
          </p>
          <Link
            href={`/${locale}/become-specialist`}
            className="inline-block px-8 py-4 bg-white text-[#1DB954] font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-lg"
          >
            🚀 Предлагай услуги
          </Link>
          <p className="text-white text-sm mt-4 opacity-90">
            • Безплатен план за начало • 5 снимки • Видимост в търсачката
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PZ</span>
                </div>
                <span className="text-white font-semibold">ProZona</span>
              </div>
              <p className="text-gray-400 text-sm">Намери надежден специалист близо до теб</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Категории</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/categories/construction" className="hover:text-[#1DB954]">Строителство</Link></li>
                <li><Link href="/categories/home" className="hover:text-[#1DB954]">Домашни услуги</Link></li>
                <li><Link href="/categories/beauty" className="hover:text-[#1DB954]">Красота и здраве</Link></li>
                <li><Link href="/categories/photography" className="hover:text-[#1DB954]">Фотография</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">За нас</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href={`/${locale}/about`} className="hover:text-[#1DB954]">За ProZona</Link></li>
                <li><Link href={`/${locale}/how-it-works`} className="hover:text-[#1DB954]">Как работи</Link></li>
                <li><Link href={`/${locale}/contact`} className="hover:text-[#1DB954]">Контакти</Link></li>
                <li><Link href={`/${locale}/faq`} className="hover:text-[#1DB954]">Често задавани въпроси</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Свържи се</h4>
              <ul className="space-y-2 text-gray-400">
                <li>office@prozona.bg</li>
                <li>+359 888 123 456</li>
                <li>София, България</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 ProZona. Всички права запазени.
          </div>
        </div>
      </footer>
    </main>
  )
}
