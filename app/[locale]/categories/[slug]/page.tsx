import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params

  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      SpecialistCategory: {
        some: {
          Category: {
            slug: category.slug,
          },
        },
      },
    },
    include: {
      user: true,
      reviews: true,
      GalleryImage: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
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
        <Link
          href={`/${locale}/categories`}
          className="mb-6 inline-block text-[#1DB954]"
        >
          ← Назад към категориите
        </Link>

        <h1 className="mb-3 text-4xl font-bold text-white">{category.name}</h1>
        <p className="mb-8 text-gray-400">{category.description}</p>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/${locale}/categories/${category.slug}/${sub.id}`}
              className="rounded-xl border border-white/10 bg-[#151528] p-6 transition hover:border-[#1DB954]/40"
            >
              <div className="mb-3 text-3xl">{sub.icon}</div>

              <h2 className="mb-2 text-xl font-semibold text-white">
                {sub.name}
              </h2>

              <span className="text-sm text-[#1DB954]">Разгледай →</span>
            </Link>
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Специалисти в категорията
          </h2>
        </div>

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
            <h3 className="mb-3 text-2xl font-semibold text-white">
              Все още няма специалисти
            </h3>
            <p className="text-gray-400">
              В тази категория все още няма верифицирани специалисти.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((specialist) => {
              const displayName =
                specialist.businessName || specialist.user?.name || "Специалист"

              const averageRating =
                specialist.reviews.length > 0
                  ? specialist.reviews.reduce((acc, r) => acc + r.rating, 0) /
                    specialist.reviews.length
                  : 0

              const profileImage =
                specialist.GalleryImage.length > 0
                  ? specialist.GalleryImage[0].imageUrl
                  : specialist.user?.image || null

              const matchedCategory = specialist.SpecialistCategory.find(
                (sc) => sc.Category?.slug === category.slug
              )

              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialist/${specialist.id}`}
                  className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40 hover:bg-[#1b1b31]"
                >
                  <div className="mb-4 flex items-center gap-4">
                    {profileImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#25253a] text-2xl font-bold text-[#1DB954]">
                        {displayName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-semibold text-white">
                        {displayName}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {specialist.city || "Не е посочен град"}
                      </p>
                    </div>
                  </div>

                  {matchedCategory?.Subcategory?.name && (
                    <p className="mb-3 text-sm text-[#1DB954]">
                      {matchedCategory.Subcategory.name}
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
}