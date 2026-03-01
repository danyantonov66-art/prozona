'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'
import ProZonaFreelancerCard from '@/components/freelancer/ProZonaFreelancerCard'
import ProZonaCategoryCard from '@/components/category/ProZonaCategoryCard'
import Hero from '@/components/hero'
import { categories } from '@/lib/constants'

export default function Home() {
  const params = useParams()
  const locale = params.locale as string
  const { data: session, status } = useSession()

  const freelancers = [
    { id: 1, name: "Иван Иванов", profession: "Електротехник", rating: 4.8, reviews: 12, location: "София", hourlyRate: 25, jobSuccess: 98 },
    { id: 2, name: "Петър Петров", profession: "Водопроводчик", rating: 4.9, reviews: 24, location: "Пловдив", hourlyRate: 30, jobSuccess: 99 },
    { id: 3, name: "Мария Иванова", profession: "Фризьор", rating: 5.0, reviews: 36, location: "Варна", hourlyRate: 20, jobSuccess: 100 },
    { id: 4, name: "Георги Георгиев", profession: "Фотограф", rating: 4.7, reviews: 18, location: "Бургас", hourlyRate: 50, jobSuccess: 95 }
  ]

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      <ProZonaHeader locale={locale} />
      <Hero />

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/${locale}/categories/construction`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">🔨 Строителство</Link>
          <Link href={`/${locale}/categories/home`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">🧹 Домашни услуги</Link>
          <Link href={`/${locale}/categories/beauty`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">💅 Красота</Link>
          <Link href={`/${locale}/categories/photography`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">📸 Фотография</Link>
          <Link href={`/${locale}/categories`} className="px-6 py-3 bg-[#1DB954] text-white rounded-full hover:bg-[#169b43] transition-colors">Всички категории →</Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Категории услуги</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <ProZonaCategoryCard key={category.id} data={{...category, locale}} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">Популярни специалисти</h2>
          <Link href={`/${locale}/specialists`} className="text-[#1DB954] hover:underline text-lg">Виж всички →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freelancers.map((freelancer) => (
            <ProZonaFreelancerCard key={freelancer.id} data={freelancer} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Как работи ProZona?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#1A1A2E] rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-white text-2xl font-bold">1</span></div>
            <h3 className="text-xl font-bold text-white mb-3">Намери специалист</h3>
            <p className="text-gray-400">Търси по категория, град и рейтинг</p>
          </div>
          <div className="bg-[#1A1A2E] rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-white text-2xl font-bold">2</span></div>
            <h3 className="text-xl font-bold text-white mb-3">Свържи се</h3>
            <p className="text-gray-400">Изпрати запитване и получи оферта</p>
          </div>
          <div className="bg-[#1A1A2E] rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-white text-2xl font-bold">3</span></div>
            <h3 className="text-xl font-bold text-white mb-3">Остави отзив</h3>
            <p className="text-gray-400">Помогни на другите с твоя опит</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-[#1DB954] to-[#169b43] rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ти си професионалист?</h2>
          <p className="text-xl text-white mb-8">Присъедини се към нас и намери нови клиенти</p>
          <Link href={`/${locale}/register/specialist`} className="inline-block px-8 py-4 bg-white text-[#1DB954] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">Започни да печелиш</Link>
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}
