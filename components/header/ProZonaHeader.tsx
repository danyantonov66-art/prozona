'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

interface HeaderProps {
  locale?: string
}

export default function ProZonaHeader({ locale = 'bg' }: HeaderProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const currentLocale = locale || pathname?.split('/')[1] || 'bg'

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
    },
    en: {
      categories: "Categories",
      howItWorks: "How it works",
      forSpecialists: "For specialists",
      pricing: "Pricing",
      dashboard: "My dashboard",
      login: "Log in",
      register: "Sign up",
      logout: "Log out"
    }
  }

  const t =
    translations[currentLocale as keyof typeof translations] || translations.bg

  return (
    <header className="border-b border-gray-800 bg-[#0D0D1A] overflow-x-clip">
      <div className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/${currentLocale}`}
            className="flex min-w-0 items-center gap-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1DB954]">
              <span className="text-xl font-bold text-white">PZ</span>
            </div>
            <span className="truncate text-xl font-semibold text-white">
              ProZona
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href={`/${currentLocale}/categories`}
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t.categories}
            </Link>
            <Link
              href={`/${currentLocale}/how-it-works`}
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t.howItWorks}
            </Link>
            <Link
              href={`/${currentLocale}/for-specialists`}
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t.forSpecialists}
            </Link>
            <Link
              href={`/${currentLocale}/pricing`}
              className="text-gray-300 transition-colors hover:text-white"
            >
              {t.pricing}
            </Link>
          </nav>

          <div className="ml-auto flex min-w-0 items-center gap-2 sm:ml-0">
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={pathname?.replace(/^\/[a-z]{2}/, '/bg') || '/bg'}
                className={`px-2 py-1 text-sm rounded ${
                  currentLocale === 'bg'
                    ? 'text-[#1DB954] font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                BG
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href={pathname?.replace(/^\/[a-z]{2}/, '/en') || '/en'}
                className={`px-2 py-1 text-sm rounded ${
                  currentLocale === 'en'
                    ? 'text-[#1DB954] font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                EN
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {status === 'loading' ? (
                <span className="text-sm text-gray-400">Зареждане...</span>
              ) : session ? (
                <>
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
                  <Link
                    href={`/${currentLocale}/login`}
                    className="px-2 py-2 text-sm text-white transition-colors hover:text-[#1DB954] sm:px-4"
                  >
                    {t.login}
                  </Link>
                  <Link
                    href={`/${currentLocale}/register`}
                    className="rounded-lg bg-[#1DB954] px-3 py-2 text-sm text-white transition-colors hover:bg-[#169b43] sm:px-4"
                  >
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