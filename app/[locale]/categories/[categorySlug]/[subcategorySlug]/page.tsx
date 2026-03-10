import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { prisma } from "@/lib/prisma"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
    categorySlug: string
    subcategorySlug: string
  }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug } = await params

  const category = categories.find((c) => c.slug === categorySlug)
  const subcategory = category?.subcategories.find(
    (s) => s.slug === subcategorySlug
  )

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      SpecialistCategory: {
        some: {
          Subcategory: {
            slug: subcategorySlug,
          },
        },
      },
    },
    include: {
      user: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
        },
      },
    },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>

          <span className="mx-2">/</span>

          <Link
            href={`/${locale}/categories/${categorySlug}`}
            className="text-[#1DB954] hover:underline"
          >
            {category?.name}
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">{subcategory?.name}</span>
        </div>

        <h1 className="mb-10 text-4xl font-bold">
          {subcategory?.name}
        </h1>

        {specialists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151528] p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              Все още няма специалисти
            </h2>

            <p className="text-gray-400">
              Скоро тук ще се появят специалисти за тази услуга.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((specialist) => {
              const mainCategory =
                specialist.SpecialistCategory[0]?.Category?.name

              const subCategory =
                specialist.SpecialistCategory[0]?.Subcategory?.name

              const displayName =
                specialist.businessName ||
                specialist.user?.name ||
                "Специалист"

              return (
                <div
                  key={specialist.id}
                  className="rounded-3xl border border-white/10 bg-[#151528] p-6"
                >
                  <h2 className="mb-2 text-2xl font-bold">{displayName}</h2>

                  {mainCategory && (
                    <p className="text-sm text-[#86efac] mb-1">
                      {mainCategory}
                      {subCategory ? ` • ${subCategory}` : ""}
                    </p>
                  )}

                  {specialist.city && (
                    <p className="text-sm text-gray-400 mb-4">
                      {specialist.city}
                    </p>
                  )}

                  {specialist.description && (
                    <p className="text-sm text-gray-300 mb-6 line-clamp-3">
                      {specialist.description}
                    </p>
                  )}

                  <Link
                    href={`/${locale}/specialists/${specialist.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-4 py-2 font-semibold text-black hover:bg-[#1ed760]"
                  >
                    Виж профил
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}