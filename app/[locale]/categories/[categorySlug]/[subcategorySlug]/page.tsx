import Link from "next/link"
import { prisma } from "../../../../../lib/prisma"
import { categories } from "../../../../../lib/constants"
import ProZonaHeader from "../../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
    categorySlug: string
    subcategorySlug: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug, subcategorySlug } = await params
  const category = categories.find((c) => c.slug === categorySlug)
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug)
  const name = subcategory?.name || "Подкатегория"
  const catName = category?.name || "Услуги"

  const title = `${name} в София | Намери специалист | ProZona`
  const description = `Търсиш специалист за ${name} в София? Публикувай безплатна заявка в ProZona и получи оферти от верифицирани майстори до часове. Без посредници.`

  return {
    title,
    description,
    keywords: [
      `${name} София`,
      `${name} майстор`,
      `${name} специалист`,
      `${catName} София`,
      `намери майстор ${name}`,
      `ProZona ${name}`,
    ],
    openGraph: {
      title,
      description,
      url: `https://www.prozona.bg/bg/categories/${categorySlug}/${subcategorySlug}`,
      siteName: "ProZona",
      locale: "bg_BG",
      type: "website",
    },
    alternates: {
      canonical: `https://www.prozona.bg/bg/categories/${categorySlug}/${subcategorySlug}`,
    },
  }
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug } = await params

  const category = categories.find((c) => c.slug === categorySlug)
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug)
  const categoryName = category?.name || categorySlug
  const subcategoryName = subcategory?.name || subcategorySlug

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      SpecialistCategory: {
        some: {
          Category: { slug: categorySlug },
          Subcategory: { slug: subcategorySlug },
        },
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span>/</span>
          <Link href={`/${locale}/categories/${categorySlug}`} className="text-[#1DB954] hover:underline">{categoryName}</Link>
          <span>/</span>
          <span className="text-white">{subcategoryName}</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold">{subcategoryName} в София</h1>
        <p className="mb-8 text-gray-400">Верифицирани специалисти в категория „{subcategoryName}"</p>

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
            <p className="mb-4 text-gray-300">Няма намерени специалисти в тази категория все още.</p>
            <Link
              href={`/${locale}/become-specialist`}
              className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-2 font-semibold text-black transition hover:bg-[#1ed760]"
            >
              Стани първият специалист →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"
              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialists/${specialist.id}`}
                  className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40"
                >
                  <div className="mb-4">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-xl bg-[#23233A] text-4xl font-bold text-[#1DB954]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h2 className="mb-1 text-xl font-semibold">{name}</h2>
                  {specialist.city && (
                    <p className="mb-2 text-sm text-gray-400">📍 {specialist.city}</p>
                  )}
                  <p className="line-clamp-3 text-sm text-gray-300">
                    {specialist.description || "Няма добавено описание."}
                  </p>
                </Link>
              )
            })}
          </div>
        )}

        {/* SEO текст блок */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-[#151528] p-8">
          <h2 className="mb-4 text-xl font-bold">
            Намери специалист за {subcategoryName} в София
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            ProZona е платформата, която свързва хора, нуждаещи се от {subcategoryName}, с верифицирани специалисти в София и цяла България.
            Публикувай безплатна заявка, получи оферти от майстори и избери най-подходящия за теб.
            Без посредници, без чакане — директна комуникация със специалиста.
          </p>
          <Link
            href={`/${locale}/inquiry/new`}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760]"
          >
            Публикувай безплатна заявка →
          </Link>
        </div>

      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}