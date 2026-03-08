import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    id: string
    locale: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
        },
        take: 1,
      },
    },
  })

  if (!specialist) {
    return { title: "Специалист не е намерен" }
  }

  const name = specialist.businessName || specialist.user?.name || "Специалист"

  const primaryCategorySlug =
    specialist.SpecialistCategory?.[0]?.Category?.slug || null

  const category =
    categories.find((c) => c.slug === primaryCategorySlug)?.name || "Специалист"

  const desc =
    specialist.description?.slice(0, 160) ||
    `${name} - ${category} в ${specialist.city || "България"}`

  return {
    title: `${name} | ProZona`,
    description: desc,
  }
}

export default async function SpecialistPage({ params }: Props) {
  const { id, locale } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
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
  })

  if (!specialist) notFound()

  const displayName =
    specialist.businessName || specialist.user?.name || "Специалист"

  const averageRating =
    specialist.reviews.length > 0
      ? specialist.reviews.reduce((acc, r) => acc + r.rating, 0) /
        specialist.reviews.length
      : 0

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4 py-10">
        <Link
          href={`/${locale}/categories`}
          className="mb-6 inline-block text-[#1DB954] hover:underline"
        >
          ← Назад към категориите
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#151528] p-8">
          <div className="mb-6 flex flex-col gap-6 md:flex-row">
            <div className="flex-shrink-0">
              {specialist.GalleryImage?.[0]?.imageUrl || specialist.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={specialist.GalleryImage?.[0]?.imageUrl || specialist.user?.image || ""}
                  alt={displayName}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#25253a] text-4xl font-bold text-[#1DB954]">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="mb-2 text-3xl font-bold text-white">
                {displayName}
              </h1>

              <p className="mb-3 text-gray-400">
                {specialist.city || "Не е посочен град"}
              </p>

              {specialist.SpecialistCategory.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {specialist.SpecialistCategory.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-[#1DB954]/15 px-3 py-1 text-sm text-[#1DB954]"
                    >
                      {item.Subcategory?.name || item.Category?.name || "Услуга"}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-yellow-400">
                {averageRating > 0
                  ? `★ ${averageRating.toFixed(1)} (${specialist.reviews.length} отзива)`
                  : "★ Няма рейтинг"}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-semibold text-white">Описание</h2>
            <p className="leading-7 text-gray-300">
              {specialist.description || "Все още няма описание."}
            </p>
          </div>

          {specialist.phone && (
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-white">Контакт</h2>
              <p className="text-gray-300">{specialist.phone}</p>
            </div>
          )}

          {specialist.GalleryImage.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white">Галерия</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {specialist.GalleryImage.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border border-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.imageUrl}
                      alt={image.title || image.description || displayName}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${locale}/specialist/${specialist.id}/review`}
              className="rounded-lg bg-[#1DB954] px-5 py-3 font-medium text-white transition hover:bg-[#169b43]"
            >
              Остави отзив
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}