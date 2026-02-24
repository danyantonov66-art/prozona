// app/specialist/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ReviewList from '@/components/reviews/ReviewList'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function SpecialistProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions)
  const { id } = await params
  
  try {
    let specialist
    
    // Ако ID-то е число, избери първия специалист (за тестване)
    if (!isNaN(Number(id))) {
      specialist = await prisma.specialist.findFirst({
        include: {
          user: true,
          categories: {
            include: {
              category: true,
              subcategory: true
            }
          },
          gallery: true,
          reviews: {
            include: {
              client: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          priceList: true
        }
      })
    } else {
      // Иначе търси по реалното ID
      specialist = await prisma.specialist.findUnique({
        where: { id: id },
        include: {
          user: true,
          categories: {
            include: {
              category: true,
              subcategory: true
            }
          },
          gallery: true,
          reviews: {
            include: {
              client: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          priceList: true
        }
      })
    }

    if (!specialist) {
      return (
        <div className="min-h-screen bg-[#0D0D1A] text-white p-8">
          <h1 className="text-2xl mb-4">Специалистът не е намерен</h1>
          <p className="text-gray-400 mb-4">Търсено ID: {id}</p>
          <Link href="/" className="text-[#1DB954] hover:underline">
            ← Начало
          </Link>
        </div>
      )
    }

    // Изчисли среден рейтинг
    const averageRating = specialist.reviews.length > 0
      ? specialist.reviews.reduce((acc, review) => acc + review.rating, 0) / specialist.reviews.length
      : 0

    return (
      <main className="min-h-screen bg-[#0D0D1A]">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">PZ</span>
              </div>
              <span className="text-white font-semibold text-xl">ProZona</span>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link href="/categories" className="text-gray-300 hover:text-white">Категории</Link>
              <Link href="/how-it-works" className="text-gray-300 hover:text-white">Как работи</Link>
              <Link href="/for-specialists" className="text-gray-300 hover:text-white">За специалисти</Link>
            </nav>
            
            <div className="flex gap-3">
              <Link href="/login" className="px-4 py-2 text-white hover:text-[#1DB954]">Вход</Link>
              <Link href="/register" className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]">Регистрация</Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Link href="/" className="hover:text-[#1DB954]">Начало</Link>
            <span>/</span>
            <Link href="/specialists" className="hover:text-[#1DB954]">Специалисти</Link>
            <span>/</span>
            <span className="text-white">{specialist.user.name}</span>
          </div>
        </div>

        {/* Основна информация */}
        <section className="container mx-auto px-4 py-8">
          <div className="bg-[#1A1A2E] rounded-lg p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Аватар */}
              <div className="w-32 h-32 bg-[#0D0D1A] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-4xl text-gray-600">
                  {specialist.user.avatar ? '📸' : '👤'}
                </span>
              </div>

              {/* Информация */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {specialist.businessName || specialist.user.name}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {/* Рейтинг */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= averageRating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-600'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="text-gray-400 ml-2">
                      ({specialist.reviews.length} отзива)
                    </span>
                  </div>

                  {/* Град */}
                  <div className="flex items-center gap-1 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{specialist.city || 'Не е посочен'}</span>
                  </div>

                  {/* ТЕЛЕФОН - само за логнати */}
                  {session && specialist.phone && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{specialist.phone}</span>
                    </div>
                  )}

                  {/* ИМЕЙЛ - само за логнати */}
                  {session && specialist.user.email && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{specialist.user.email}</span>
                    </div>
                  )}

                  {/* Опит - винаги видим */}
                  {specialist.experienceYears > 0 && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{specialist.experienceYears} год. опит</span>
                    </div>
                  )}
                </div>

                {/* Категории - винаги видими */}
                {specialist.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {specialist.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 bg-[#0D0D1A] text-[#1DB954] rounded-full text-sm"
                      >
                        {cat.subcategory?.name || cat.category.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* БУТОН ЗА ЗАПИТВАНЕ */}
                {session ? (
                  <Link
                    href={`/specialist/${specialist.id}/inquiry`}
                    className="inline-block px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors font-medium"
                  >
                    Изпрати запитване (1 кредит)
                  </Link>
                ) : (
                  <Link
                    href={`/login?callbackUrl=/specialist/${specialist.id}`}
                    className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Влез, за да изпратиш запитване
                  </Link>
                )}
              </div>
            </div>

            {/* Описание - винаги видимо */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">За мен</h2>
              <p className="text-gray-400 whitespace-pre-line">{specialist.description}</p>
            </div>
          </div>
        </section>

        {/* Галерия (ако има снимки) - винаги видима */}
        {specialist.gallery.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-white mb-8">Галерия</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specialist.gallery.map((image) => (
                <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Снимка от специалиста'}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ценова листа (ако има) - винаги видима */}
        {specialist.priceList.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-white mb-8">Цени</h2>
            <div className="bg-[#1A1A2E] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#0D0D1A]">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300">Услуга</th>
                    <th className="px-6 py-3 text-left text-gray-300">Цена</th>
                    <th className="px-6 py-3 text-left text-gray-300">Забележка</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {specialist.priceList.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-white">{item.name}</td>
                      <td className="px-6 py-4 text-white">
                        {item.isNegotiable ? (
                          <span className="text-[#1DB954]">По договаряне</span>
                        ) : item.minPrice && item.maxPrice ? (
                          `${item.minPrice} - ${item.maxPrice} лв.`
                        ) : (
                          `${item.price} лв.`
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {item.description || '-'} / {item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ⭐ ОТЗИВИ ⭐ */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Отзиви от клиенти</h2>
            {/* БУТОН ЗА ОТЗИВ - САМО ЗА КЛИЕНТИ */}
            {session?.user?.role === 'CLIENT' && (
              <Link
                href={`/specialist/${specialist.id}/review`}  // ← ВАЖНО: specialist.id, а не [id]
                className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
              >
                Напиши отзив
              </Link>
            )}
          </div>

          {specialist.reviews.length === 0 ? (
            <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
              <p className="text-gray-400">Все още няма отзиви за този специалист.</p>
            </div>
          ) : (
            <ReviewList
              reviews={specialist.reviews}
              specialistId={specialist.id}
              specialistUserId={specialist.userId}
            />
          )}
        </section>

        {/* Footer */}
        <ProZonaFooter />
      </main>
    )
  } catch (error: any) {
    console.error('Error loading specialist:', error)
    return (
      <div className="min-h-screen bg-[#0D0D1A] text-white p-8">
        <h1 className="text-2xl mb-4 text-red-500">Грешка при зареждане</h1>
        <p className="text-red-400 mb-4">{error?.message || 'Неизвестна грешка'}</p>
        <Link href="/" className="text-[#1DB954] hover:underline mt-4 block">
          ← Начало
        </Link>
      </div>
    )
  }
}