import Link from "next/link"
import ProZonaHeader from "../../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../../components/footer/ProZonaFooter"
import { prisma } from "../../../../../lib/prisma"

interface Props {
  params: Promise<{
    locale: string
    categorySlug: string
    subcategorySlug: string
  }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug } = await params

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  })

  const subcategory = await prisma.subcategory.findFirst({
    where: { slug: subcategorySlug, categoryId: category?.id },
  })

  if (!category || !subcategory) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white">
        <ProZonaHeader locale={locale} />
        <section className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">Услугата не е намерена</h1>
          <Link href={`/${locale}/categories`} className="mt-6 inline-block text-[#1DB954] hover:underline">
            ← Към категориите
          </Link>
        </section>
        <ProZonaFooter locale={locale} />
      </main>
    )
  }

  const specialistCategories = await prisma.specialistCategory.findMany({
    where: { subcategoryId: subcategory.id },
    include: {
      Specialist: {
        include: { user: { select: { name: true, image: true } } }
      }
    },
    take: 20,
  })

  const specialists = specialistCategories.map(sc => sc.Specialist).filter(Boolean)

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">Категории</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/categories/${categorySlug}`} className="text-[#1DB954] hover:underline">{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{subcategory.name}</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold">{subcategory.name}</h1>
        {subcategory.description && (
          <p className="mb-8 text-lg text-gray-400">{subcategory.description}</p>
        )}

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-12 text-center">
            <p className="text-gray-400 mb-4">Все още няма специалисти в тази категория.</p>
            <Link href={`/${locale}/register/specialist`} className="inline-flex items-center gap-2 rounded-xl bg-[#1DB954] px-6 py-3 text-black font-semibold hover:bg-[#1ed760] transition">
              Стани първият специалист →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((s) => (
              <Link
                key={s.id}
                href={`/${locale}/specialists/${s.id}`}
                className="rounded-2xl border border-white/10 bg-[#151528] p-6 hover:border-[#1DB954]/40 transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#1DB954]/20 flex items-center justify-center text-xl font-bold text-[#1DB954]">
                    {s.user?.name?.charAt(0) || "С"}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{s.businessName || s.user?.name}</p>
                    <p className="text-sm text-gray-400">📍 {s.city}</p>
                  </div>
                </div>
                {s.description && (
                  <p className="text-sm text-gray-300 line-clamp-2">{s.description}</p>
                )}
                <span className="mt-4 inline-block text-sm text-[#1DB954]">Виж профила →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}