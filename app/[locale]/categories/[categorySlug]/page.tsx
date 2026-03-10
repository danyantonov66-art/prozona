import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
    categorySlug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { locale, categorySlug } = await params

  const category = categories.find((c) => c.slug === categorySlug)

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

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">{category.name}</span>
        </div>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {category.name}
          </h1>

          <p className="max-w-3xl text-lg text-gray-400">
            {category.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/${locale}/categories/${category.slug}/${sub.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#151528] p-6 transition hover:border-[#1DB954]/40"
            >
              <div className="mb-4 text-3xl">{sub.icon}</div>

              <h2 className="mb-2 text-xl font-bold text-white">
                {sub.name}
              </h2>

              <span className="inline-flex items-center text-sm font-medium text-[#1DB954]">
                Виж специалисти →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}