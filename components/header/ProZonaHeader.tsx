'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

interface HeaderProps {
  locale?: string
}

function NotificationBell({ locale }: { locale: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/specialist/inquiries/count')
        if (res.ok) {
          const data = await res.json()
          setCount(data.count || 0)
        }
      } catch {}
    }

    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  if (count === 0) return null

  return (
    <Link
      href={`/${locale}/specialist/inquiries`}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#1A1A2E] border border-white/10 hover:border-[#1DB954]/50 transition-colors"
      title="Нови запитвания"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#1DB954] text-black text-xs font-bold">
        {count > 9 ? '9+' : count}
      </span>
    </Link>
  )
}

export default function ProZonaHeader({ locale = 'bg' }: HeaderProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const currentLocale = locale || pathname?.split('/')[1] || 'bg'
  const isSpecialist = (session?.user as any)?.role === 'SPECIALIST'

  const translations = {
    bg: {
      categories: "Категории",
      howItWorks: "Как работи",
      forSpecialists: "За специалисти",
      pricing: "Цени",
      dashboard: "Моето табло",
      login: "Вход",
      register: "Регистрация",
      logout: "Изход"
    }
  }

  const t = translations.bg

  return (
    <header className="border-b border-gray-800 bg-[#0D0D1A] overflow-x-clip">
      <div className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`/${currentLocale}`} className="flex min-w-0 items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="text-xl font-bold text-white">PZ</span>
            </div>
            <span className="truncate text-xl font-semibold text-white">ProZona</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href={`/${currentLocale}/categories`} className="text-gray-300 transition-colors hover:text-white">
              {t.categories}
            </Link>
            <Link href={`/${currentLocale}/how-it-works`} className="text-gray-300 transition-colors hover:text-white">
              {t.howItWorks}
            </Link>
            <Link href={`/${currentLocale}/for-specialists`} className="text-gray-300 transition-colors hover:text-white">
              {t.forSpecialists}
            </Link>
            <Link href={`/${currentLocale}/pricing`} className="text-gray-300 transition-colors hover:text-white">
              {t.pricing}
            </Link>
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-2 sm:ml-0">
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {status === 'loading' ? (
                <span className="text-sm text-gray-400">Зареждане...</span>
              ) : session ? (
                <>
                  {isSpecialist && <NotificationBell locale={currentLocale} />}
                  <Link
                    href={`/${currentLocale}/dashboard`}
                    className="px-2 py-2 text-sm text-white transition-colors hover:text-[#1DB954] sm:px-4"
                  >
                    {t.dashboard}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white transition-colors hover:bg-red-700 sm:px-4"
                  >
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link href={`/${currentLocale}/login`} className="px-2 py-2 text-sm text-white transition-colors hover:text-[#1DB954] sm:px-4">
                    {t.login}
                  </Link>
                  <Link href={`/${currentLocale}/register`} className="rounded-lg bg-[#1DB954] px-3 py-2 text-sm text-white transition-colors hover:bg-[#169b43] sm:px-4">
                    {t.register}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
