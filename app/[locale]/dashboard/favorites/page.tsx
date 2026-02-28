'use client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const locale = params?.locale || 'bg'
  const router = useRouter()

  if (status === 'unauthenticated') router.push(`/${locale}/login`)

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-white"> Назад</Link>
          <h1 className="text-3xl font-bold text-white">Любими специалисти</h1>
        </div>
        <div className="bg-[#1A1A2E] rounded-xl p-8 text-center">
          <p className="text-gray-400 mb-4">Нямате запазени специалисти</p>
          <Link href={`/${locale}/specialists`} className="px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]">
            Разгледай специалисти
          </Link>
        </div>
      </div>
    </div>
  )
}
