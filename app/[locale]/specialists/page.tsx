// app/specialists/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SpecialistsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const specialists = await prisma.specialist.findMany({
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      }
    },
    orderBy: {
      rating: 'desc'
    },
    take: 20
  })

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">
          Всички специалисти
        </h1>
        <p className="text-xl text-gray-400 mb-12 text-center">
          Намери най-добрия професионалист за твоята услуга
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((specialist) => (
            <Link 
              key={specialist.id}
              href={`/${locale}/specialist/${specialist.id}`}
              className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors group"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-[#0D0D1A] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <span className="text-4xl text-gray-600">👤</span>
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
                      <svg 
                        key={star} 
                        className={`w-4 h-4 ${
                          star <= Math.round(specialist.rating) 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-600'
                        }`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">({specialist.reviewCount})</span>
                </div>
                
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {specialist.city}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
