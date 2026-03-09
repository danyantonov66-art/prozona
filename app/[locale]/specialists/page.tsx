import Link from "next/link"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function SpecialistsPage({ params }: Props) {
  const { locale } = await params

  try {
    const specialists = await prisma.specialist.findMany({
      where: {
        verified: true,
      },
      select: {
        id: true,
        businessName: true,
        description: true,
        city: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        GalleryImage: {
          select: {
            imageUrl: true,
            sortOrder: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        SpecialistCategory: {
          select: {
            categoryId: true,
            subcategoryId: true,
            Category: {
              select: {
                name: true,
              },
            },
            Subcategory: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return (
      <main className="min-h-screen bg-[#0D0D1A] pt-24">
        <div className="container mx-auto px-4 py-10">
          <div className="mb-6 text-sm text-gray-400">
            <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
              Начало
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Специалисти</span>
          </div>

          <h1 className="mb-8 text-4xl font-bold text-white">
            Всички специалисти
          </h1>

          {specialists.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
              <h2 className="mb-3 text-2xl font-semibold text-white">
                Все още няма специалисти
              </h2>
              <p className="text-gray-400">
                В момента няма верифицирани специалисти.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {specialists.map((specialist) => {
                const displayName =
                  specialist.businessName || specialist.user?.name || "Специалист"

                const photo =
                  specialist.GalleryImage?.[0]?.imageUrl ||
                  specialist.user?.image ||
                  null

                const averageRating =
                  specialist.reviews.length > 0
                    ? specialist.reviews.reduce((acc, r) => acc + r.rating, 0) /
                      specialist.reviews.length
                    : 0

                const primaryRelation = specialist.SpecialistCategory[0]
                const categoryName = primaryRelation?.Category?.name || null
                const subcategoryName = primaryRelation?.Subcategory?.name || null

                return (
                  <Link
                    key={specialist.id}
                    href={`/${locale}/specialist/${specialist.id}`}
                    className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40 hover:bg-[#1b1b31]"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photo}
                          alt={displayName}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#25253a] text-2xl font-bold text-[#1DB954]">
                          {displayName.charAt(0)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="truncate text-xl font-semibold text-white">
                          {displayName}
                        </h2>
                        <p className="text-sm text-gray-400">
                          {specialist.city || "Не е посочен град"}
                        </p>
                      </div>
                    </div>

                    {(subcategoryName || categoryName) && (
                      <p className="mb-3 text-sm text-[#1DB954]">
                        {subcategoryName || categoryName}
                      </p>
                    )}

                    <p className="mb-4 line-clamp-3 text-sm text-gray-300">
                      {specialist.description || "Все още няма описание."}
                    </p>

                    <div className="mb-4 flex items-center justify-between text-sm">
                      <span className="text-yellow-400">
                        {averageRating > 0
                          ? `★ ${averageRating.toFixed(1)}`
                          : "★ Няма рейтинг"}
                      </span>
                      <span className="text-gray-400">
                        {specialist.reviews.length} отзива
                      </span>
                    </div>

                    <div className="inline-flex items-center text-sm font-medium text-[#1DB954]">
                      Виж профила →
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    )
  } catch (error) {
    console.error("Specialists page error:", error)

    return (
      <main className="min-h-screen bg-[#0D0D1A] pt-24">
        <div className="container mx-auto px-4 py-10">
          <div className="mb-6 text-sm text-gray-400">
            <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
              Начало
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Специалисти</span>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-[#151528] p-6">
            <h1 className="mb-3 text-2xl font-semibold text-white">
              Грешка при зареждане
            </h1>
            <p className="text-gray-400">
              Възникна проблем при зареждане на специалистите. Опитайте отново след малко.
            </p>
          </div>
        </div>
      </main>
    )
  }
}