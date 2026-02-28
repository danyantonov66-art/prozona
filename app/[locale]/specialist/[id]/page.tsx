import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StarIcon, MapPinIcon, CheckBadgeIcon } from '@heroicons/react/24/solid'

interface Props {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function SpecialistProfilePage({ params }: Props) {
  const { id, locale } = await params
console.log('locale:', locale, 'id:', id)
  const session = await getServerSession(authOptions)

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      categories: {
        include: { category: true }
      },
      reviews: {
        include: { client: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!specialist) {
    notFound()
  }

  const isOwner = session && (session.user as any)?.id === specialist.userId

  const averageRating =
    specialist.reviews.length > 0
      ? specialist.reviews.reduce((acc, review) => acc + review.rating, 0) /
        specialist.reviews.length
      : 0

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="bg-[#1A1A2E] rounded-lg p-8">

              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-[#25253a] rounded-full flex items-center justify-center overflow-hidden">
                  {specialist.user.image ? (
                    <Image
                      src={specialist.user.image}
                      alt={specialist.user.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-[#1DB954]">
                      {specialist.user.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {specialist.user.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-400">
                        ({specialist.reviews.length} отзива)
                      </span>
                    </div>

                    {specialist.verified && (
                      <div className="flex items-center gap-1 text-[#1DB954]">
                        <CheckBadgeIcon className="w-5 h-5" />
                        <span className="text-sm">Проверен</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPinIcon className="w-5 h-5" />
                    <span>{specialist.city || 'Не е посочен'}</span>
                  </div>

                  {isOwner && (
                    <Link
                      href={`/${locale}/specialist/profile/edit`}
                      className="mt-4 inline-block px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] text-sm"
                    >
                      ✏️ Редактирай профила
                    </Link>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h2 className="text-xl font-semibold text-white mb-4">За мен</h2>
                <p className="text-gray-400 whitespace-pre-line">
                  {specialist.description || 'Няма описание'}
                </p>
              </div>

              <div className="border-t border-gray-800 pt-6 mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">Категории</h2>
                <div className="flex flex-wrap gap-2">
                  {specialist.categories.map((sc) => (
                    <Link
                      key={sc.category.id}
                      href={`/${locale}/categories/${sc.category.slug}`}
                      className="px-3 py-1 bg-[#25253a] text-[#1DB954] rounded-full text-sm"
                    >
                      {sc.category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 mt-6">
                <h2 className="text-xl font-semibold text-white mb-4">Отзиви</h2>

                {specialist.reviews.length === 0 ? (
                  <p className="text-gray-400">Все още няма отзиви</p>
                ) : (
                  <div className="space-y-4">
                    {specialist.reviews.map((review) => (
                      <div key={review.id} className="bg-[#25253a] rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-[#1A1A2E] rounded-full flex items-center justify-center overflow-hidden">
                            {review.client?.image ? (
                              <Image
                                src={review.client.image}
                                alt={review.client?.name ?? 'Клиент'}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-[#1DB954] text-sm">
                                {review.client?.name?.charAt(0) || 'C'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {review.client?.name || 'Клиент'}
                            </p>
                          </div>
                          <span className="ml-auto text-gray-400 text-sm">
                            {new Date(review.createdAt).toLocaleDateString('bg-BG')}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1A1A2E] rounded-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-[#1DB954]">По договаряне</p>
                <p className="text-gray-400">цена</p>
              </div>

              <div className="border-t border-gray-800 pt-4 mt-4">
                <h3 className="text-white font-semibold mb-2">Контакти</h3>
                <p className="text-gray-400">{specialist.user.email}</p>
                {specialist.phone && (
                  <p className="text-gray-400 mt-1">{specialist.phone}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
