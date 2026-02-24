// components/header/ProZonaHeader.jsx
'use client'

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function ProZonaHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-800 bg-[#0D0D1A]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
              Категории
            </Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">
              Как работи
            </Link>
            <Link href="/for-specialists" className="text-gray-300 hover:text-white transition-colors">
              За професионалисти
            </Link>
          </nav>

          {/* User menu */}
          <div className="flex gap-3 items-center">
            {status === 'loading' ? (
              <span className="text-gray-400">Зареждане...</span>
            ) : session ? (
              <>
                <Link href="/dashboard" className="text-white hover:text-[#1DB954] transition-colors">
                  Моето табло
                </Link>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })} 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-white hover:text-[#1DB954] transition-colors">
                  Вход
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}