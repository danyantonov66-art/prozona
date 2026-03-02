import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'
import ProZonaCategoryCard from '@/components/category/ProZonaCategoryCard'
import Hero from '@/components/hero'
import Image from 'next/image'
import { categories } from '@/lib/constants'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params

  const specialists = await prisma.specialist.findMany({
    take: 4,
    orderBy: { rating: 'desc' },
    include: { user: true, categories: { include: { category: true } } }
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      <ProZonaHeader locale={locale} />

      {/* Безплатен банер */}
      <div className="bg-[#1DB954] text-white text-center py-3 px-4">
        <p className="text-sm font-medium">
          🎉 ProZona е напълно безплатна за първите 3 месеца — за специалисти и клиенти! След това ще има завинаги безплатен план.
        </p>
      </div>

      <Hero />

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/${locale}/categories/stroitelstvo`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">🔨 Строителство</Link>
          <Link href={`/${locale}/categories/domashni-uslugi`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">🧹 Домашни услуги</Link>
          <Link href={`/${locale}/categories/krasota-zdrave`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">💅 Красота</Link>
          <Link href={`/${locale}/categories/fotografiya`} className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full hover:bg-[#25253a] transition-colors">📸 Фотография</Link>
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
          {specialists.map((specialist) => {
            const photo = specialist.user.image || specialist.user.avatar || null
            return (
              <Link key={specialist.id} href={`/${locale}/specialist/${specialist.id}`} className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors group">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full mx-auto mb-4 relative overflow-hidden bg-[#0D0D1A] flex items-center justify-center">
                    {photo ? <Image src={photo} alt={specialist.user.name} fill className="object-cover" /> : <span className="text-3xl text-gray-600">👤</span>}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#1DB954] transition-colors">{specialist.user.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{specialist.categories[0]?.category?.name || 'Специалист'}</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-white text-sm">{specialist.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({specialist.reviewCount})</span>
                  </div>
                  <p className="text-gray-400 text-sm">📍 {specialist.city}</p>
                </div>
              </Link>
            )
          })}
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
          <p className="text-xl text-white mb-2">Присъедини се към нас и намери нови клиенти</p>
          <p className="text-white/80 mb-8">Безплатно за първите 3 месеца — без скрити такси!</p>
          <Link href={`/${locale}/register/specialist`} className="inline-block px-8 py-4 bg-white text-[#1DB954] font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg">Регистрирай се безплатно</Link>
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}