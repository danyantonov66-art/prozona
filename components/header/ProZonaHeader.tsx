// components/header/ProZonaHeader.tsx
'use client'

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface HeaderProps {
  locale?: string;
}

export default function ProZonaHeader({ locale = 'bg' }: HeaderProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const currentLocale = locale || pathname?.split('/')[1] || 'bg';

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
  };

  const t = translations[currentLocale as keyof typeof translations] || translations['bg'];

  return (
    <header className="border-b border-gray-800 bg-[#0D0D1A]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href={`/${currentLocale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link href={`/${currentLocale}/categories`} className="text-gray-300 hover:text-white transition-colors">
              {t.categories}
            </Link>
            <Link href={`/${currentLocale}/how-it-works`} className="text-gray-300 hover:text-white transition-colors">
              {t.howItWorks}
            </Link>
            <Link href={`/${currentLocale}/for-specialists`} className="text-gray-300 hover:text-white transition-colors">
              {t.forSpecialists}
            </Link>
            <Link href={`/${currentLocale}/pricing`} className="text-gray-300 hover:text-white transition-colors">
              {t.pricing}
            </Link>
          </nav>

          <div className="flex items-center gap-2 mr-4">
            <Link 
              href={pathname?.replace(/^\/[a-z]{2}/, '/bg') || '/bg'} 
              className={`px-2 py-1 text-sm rounded ${currentLocale === 'bg' ? 'text-[#1DB954] font-semibold' : 'text-gray-400 hover:text-white'}`}
            >
              BG
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              href={pathname?.replace(/^\/[a-z]{2}/, '/en') || '/en'} 
              className={`px-2 py-1 text-sm rounded ${currentLocale === 'en' ? 'text-[#1DB954] font-semibold' : 'text-gray-400 hover:text-white'}`}
            >
              EN
            </Link>
          </div>

          <div className="flex gap-3 items-center">
            {status === 'loading' ? (
              <span className="text-gray-400">Зареждане...</span>
            ) : session ? (
              <>
                <Link href={`/${currentLocale}/dashboard`} className="text-white hover:text-[#1DB954] transition-colors">
                  {t.dashboard}
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: `/${currentLocale}` })} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${currentLocale}/login`} className="px-4 py-2 text-white hover:text-[#1DB954] transition-colors">
                  {t.login}
                </Link>
                <Link href={`/${currentLocale}/register`} className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors">
                  {t.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
