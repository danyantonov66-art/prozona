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

      <div className="bg-[#1DB954] text-white text-center py-3 px-4">
        <p className="text-sm font-medium">
          🎉 ProZona е напълно безплатна за първите 3 месеца — за специалисти и клиенти! След това ще има завинаги безплатен план.
        </p>
      </div>

      <Hero />

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Категории услуги</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Строителство */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
            <div className="text-4xl mb-4">🔨</div>
            <h3 className="text-xl font-bold text-white mb-2">Строителство и ремонти</h3>
            <p className="text-gray-400 mb-4">Майстори, ВиК, електро, бояджии</p>
            <Link href="/bg/categories/stroitelstvo" className="text-[#1DB954] hover:underline inline-flex items-center">
              Виж услугите →
            </Link>
          </div>
          
          {/* Авто услуги */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-white mb-2">Авто услуги и транспорт</h3>
            <p className="text-gray-400 mb-4">Автосервизи, тенекеджии, смяна на гуми</p>
            <Link href="/bg/categories/avto-uslugi" className="text-[#1DB954] hover:underline inline-flex items-center">
              Виж услугите →
            </Link>
          </div>
          
          {/* Домашни услуги */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-white mb-2">Домашни услуги</h3>
            <p className="text-gray-400 mb-4">Почистване, хамали, градинари</p>
            <Link href="/bg/categories/domashni-uslugi" className="text-[#1DB954] hover:underline inline-flex items-center">
              Виж услугите →
            </Link>
          </div>
          
          {/* Красота */}
          <div className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
            <div className="text-4xl mb-4">💅</div>
            <h3 className="text-xl font-bold text-white mb-2">Красота и грижа за тялото</h3>
            <p className="text-gray-400 mb-4">Фризьори, маникюр, масажи, козметика</p>
            <Link href="/bg/categories/krasota" className="text-[#1DB954] hover:underline inline-flex items-center">
              Виж услугите →
            </Link>
          </div>
          
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}