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
  const { categorySlug, locale } = await params
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  const name = category?.name || "Категория"

  return {
    title: `${name} специалисти в България | Намери майстор | ProZona`,
    description: `Намери верифицирани ${name} специалисти в ProZona. Сравни цени, прочети отзиви и заяви безплатна оферта. Бърза връзка с проверени майстори в твоя град.`,
    keywords: `${name}, специалисти, майстори, България, оферта, цени`,
    alternates: {
      canonical: `https://prozona.bg/bg/categories/${categorySlug}`,
    },
    ...(locale !== "bg" && { robots: { index: false, follow: false } }),
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
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>
          {" / "}
          <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">
            Категории
          </Link>
          {" / "}
          <span>{category.name}</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          {category.name} специалисти в България
        </h1>

        <p className="mb-10 max-w-2xl text-gray-400 text-base leading-relaxed">
          Намери верифицирани {category.name.toLowerCase()} специалисти в ProZona.
          Сравни услуги, прочети реални отзиви и получи безплатна оферта от проверени майстори в твоя град.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.Subcategory.map((sub) => {
            const count = countMap[sub.id] ?? 0
            return (
              <Link
                key={sub.id}
                href={`/${locale}/categories/${categorySlug}/${sub.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1DB954]/50 hover:bg-white/10"
              >
                <h2 className="mb-2 text-lg font-semibold">{sub.name}</h2>
                {count > 0 ? (
                  <p className="text-sm text-gray-400">
                    {count} специалист{count === 1 ? "" : "а"}
                  </p>
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