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
  const [menuOpen, setMenuOpen] = useState(false)

  const currentLocale = locale || pathname?.split('/')[1] || 'bg'
  const isSpecialist = (session?.user as any)?.role === 'SPECIALIST'

  const navLinks = [
    { href: `/${currentLocale}/categories`, label: "Категории" },
    { href: `/${currentLocale}/how-it-works`, label: "Как работи" },
    { href: `/${currentLocale}/for-specialists`, label: "За специалисти" },
    { href: `/${currentLocale}/pricing`, label: "Цени" },
  ]

  return (
    <header className="border-b border-gray-800 bg-[#0D0D1A]">
      <div className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-3">

          {/* Лого */}
          <Link href={`/${currentLocale}`} className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="text-xl font-bold text-white">PZ</span>
            </div>
            <span className="text-xl font-semibold text-white">ProZona</span>
          </Link>

          {/* Десктоп навигация */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-300 transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Десктоп бутони */}
          <div className="hidden md:flex items-center gap-2">
            {status === 'loading' ? (
              <span className="text-sm text-gray-400">Зареждане...</span>
            ) : session ? (
              <>
                {isSpecialist && <NotificationBell locale={currentLocale} />}
                <Link href={`/${currentLocale}/dashboard`} className="px-4 py-2 text-sm text-white hover:text-[#1DB954]">
                  Моето табло
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link href={`/${currentLocale}/login`} className="px-4 py-2 text-sm text-white hover:text-[#1DB954]">
                  Вход
                </Link>
                <Link href={`/${currentLocale}/register`} className="rounded-lg bg-[#1DB954] px-4 py-2 text-sm text-white hover:bg-[#169b43]">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Мобилни бутони + хамбургер */}
          <div className="flex md:hidden items-center gap-2">
            {session ? (
              <>
                {isSpecialist && <NotificationBell locale={currentLocale} />}
                <Link href={`/${currentLocale}/dashboard`} className="px-3 py-2 text-sm text-white hover:text-[#1DB954]">
                  Табло
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link href={`/${currentLocale}/login`} className="px-3 py-2 text-sm text-white">
                  Вход
                </Link>
                <Link href={`/${currentLocale}/register`} className="rounded-lg bg-[#1DB954] px-3 py-2 text-sm text-white">
                  Регистрация
                </Link>
              </>
            )}

            {/* Хамбургер бутон */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-1 flex flex-col gap-1.5 p-2"
              aria-label="Меню"
            >
              <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Мобилно меню */}
        {menuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-1 border-t border-gray-800 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}