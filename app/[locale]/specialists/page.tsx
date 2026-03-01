import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Всички специалисти',
  description: 'Разгледай всички специалисти в ProZona. Намери най-добрия професионалист за твоята услуга.',
  openGraph: {
    title: 'Всички специалисти | ProZona',
    description: 'Намери най-добрия професионалист за твоята услуга.',
    url: 'https://www.prozona.bg/bg/specialists',
  },
}

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; city?: string }>
}

export default async function SpecialistsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { category, city } = await searchParams

  const [specialists, categories] = await Promise.all([
    prisma.specialist.findMany({
      where: {
        ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
        ...(category ? {
          categories: { some: { category: { slug: category } } }
        } : {}),
      },
      include: {
        user: true,
        categories: { include: { category: true } }
      },
      orderBy: { rating: 'desc' },
      take: 20
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
  ])

  const cities = await prisma.specialist.findMany({
    select: { city: true },
    distinct: ['city'],
    orderBy: { city: 'asc' }
  })

  const buildUrl = (newCategory?: string, newCity?: string) => {
    const params = new URLSearchParams()
    if (newCategory) params.set('category', newCategory)
    if (newCity) params.set('city', newCity)
    const qs = params.toString()
    return `/${locale}/specialists${qs ? '?' + qs : ''}`
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Всички специалисти
        </h1>
        <p className="text-xl text-gray-400 mb-8 text-center">
          Намери най-добрия професионалист за твоята услуга
        </p>

        {/* Филтри */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {/* Категории */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl(undefined, city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category ? 'bg-[#1DB954] text-white' : 'bg-[#1A1A2E] text-gray-300 hover:bg-[#25253a]'
              }`}
            >
              Всички категории
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={buildUrl(cat.slug, city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.slug ? 'bg-[#1DB954] text-white' : 'bg-[#1A1A2E] text-gray-300 hover:bg-[#25253a]'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Градове */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl(category, undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !city ? 'bg-[#25253a] text-gray-300 border border-gray-600' : 'bg-[#1A1A2E] text-gray-300 hover:bg-[#25253a]'
              }`}
            >
              Всички градове
            </Link>
            {cities.map((s) => (
              <Link
                key={s.city}
                href={buildUrl(category, s.city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  city === s.city ? 'bg-[#25253a] text-white border border-[#1DB954]' : 'bg-[#1A1A2E] text-gray-300 hover:bg-[#25253a]'
                }`}
              >
                {s.city}
              </Link>
            ))}
          </div>
        </div>

        {/* Брой резултати */}
        <p className="text-gray-500 text-sm mb-6 text-center">
          {specialists.length} специалист{specialists.length !== 1 ? 'и' : ''}
          {category ? ` в категория "${category}"` : ''}
          {city ? ` в ${city}` : ''}
        </p>

        {/* Карти */}
        {specialists.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Няма намерени специалисти</p>
            <Link href={`/${locale}/specialists`} className="text-[#1DB954] hover:underline mt-4 inline-block">
              Виж всички
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialists.map((specialist) => {
              const photo = specialist.user.image || specialist.user.avatar || null
              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialist/${specialist.id}`}
                  className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors group"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 relative overflow-hidden bg-[#0D0D1A] flex items-center justify-center">
                      {photo ? (
                        <Image src={photo} alt={specialist.user.name} fill className="object-cover" />
                      ) : (
                        <span className="text-4xl text-gray-600">👤</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-[#1DB954] transition-colors">
                      {specialist.user.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {specialist.categories[0]?.category?.name || 'Специалист'}
                    </p>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <svg key={star} className={`w-4 h-4 ${star <= Math.round(specialist.rating) ? 'text-yellow-500 fill-current' : 'text-gray-600'}`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">({specialist.reviewCount})</span>
                    </div>
                    <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {specialist.city}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
