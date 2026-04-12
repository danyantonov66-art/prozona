import Link from "next/link"
import ProZonaHeader from "../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../components/footer/ProZonaFooter"
import { prisma } from "../../../../lib/prisma"

interface Props {
  params: Promise<{
    locale: string
    categorySlug: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  return {
    title: category?.name || "Категория",
    description: `Намери верифицирани специалисти в категория ${category?.name}. Безплатна заявка в ProZona.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { locale, categorySlug } = await params

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      Subcategory: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }
    }
  })

  if (!category) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white">
        <ProZonaHeader locale={locale} />
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">Категорията не е намерена</h1>
        </section>
        <ProZonaFooter locale={locale} />
      </main>
    )
  }

  // Брой специалисти за всяка подкатегория
  const specialistCounts = await prisma.specialistCategory.groupBy({
    by: ['subcategoryId'],
    where: {
      subcategoryId: { in: category.Subcategory.map(s => s.id) },
      Specialist: { verified: true }
    },
    _count: { specialistId: true }
  })

  const countMap = Object.fromEntries(
    specialistCounts.map(c => [c.subcategoryId, c._count.specialistId])
  )

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">Категории</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{category.name}</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mb-12 max-w-3xl text-lg text-gray-400">{category.description}</p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {category.Subcategory.map((sub) => {
            const count = countMap[sub.id] || 0
            return (
              <Link
                key={sub.slug}
                href={`/${locale}/categories/${category.slug}/${sub.slug}`}
                className={`group relative overflow-hidden rounded-2xl border p-6 transition ${
                  count > 0
                    ? "border-white/10 bg-[#151528] hover:border-[#1DB954]/40"
                    : "border-white/5 bg-[#0F0F1E] opacity-60"
                }`}
              >
                <div className="mb-3 text-2xl">🔧</div>
                <h2 className="mb-1 text-lg font-bold text-white">{sub.name}</h2>
                {count > 0 ? (
                  <p className="text-sm text-[#1DB954] font-medium">{count} специалист{count === 1 ? "" : "а"}</p>
                ) : (
                  <p className="text-sm text-gray-500">Няма специалисти</p>
                )}
                <span className="mt-3 inline-flex items-center text-sm font-medium text-[#1DB954]">
                  Виж специалисти →
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}