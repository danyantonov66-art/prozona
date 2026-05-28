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

export async function generateMetadata({ params }: Props) {
  const { categorySlug, subcategorySlug, locale } = await params

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  const subcategory = await prisma.subcategory.findFirst({
    where: { slug: subcategorySlug, categoryId: category?.id },
  })

  const catName = category?.name || "Категория"
  const subName = subcategory?.name || "Услуга"

  return {
    title: `${subName} специалисти в България | ${catName} | ProZona`,
    description: `Намери верифицирани ${subName} специалисти в ProZona. Сравни профили, виж отзиви и изпрати безплатна заявка.`,
    alternates: {
      canonical: `https://prozona.bg/bg/categories/${categorySlug}/${subcategorySlug}`,
    },
    ...(locale !== "bg" && { robots: { index: false, follow: false } }),
    openGraph: {
      title: `${subName} специалисти | ProZona`,
      description: `Намери верифицирани ${subName} специалисти в ProZona. Безплатна заявка.`,
      url: `https://prozona.bg/bg/categories/${categorySlug}/${subcategorySlug}`,
      siteName: "ProZona",
      locale: "bg_BG",
      type: "website",
    },
  }
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
    orderBy: {
      Specialist: { verified: "desc" }
    },
    take: 50,
  })

  const specialists = specialistCategories.map(sc => sc.Specialist).filter(Boolean)

  // Уникални градове от специалистите за филтър
  const cities = [...new Set(specialists.map(s => s.city).filter(Boolean))].sort()

  // JSON-LD за подкатегория
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": subcategory.name,
    "description": `Намери верифицирани ${subcategory.name} специалисти в ProZona`,
    "provider": {
      "@type": "Organization",
      "name": "ProZona",
      "url": "https://prozona.bg"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Bulgaria"
    },
    "url": `https://prozona.bg/bg/categories/${categorySlug}/${subcategorySlug}`,
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">Категории</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/categories/${categorySlug}`} className="text-[#1DB954] hover:underline">{category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{subcategory.name}</span>
        </div>

        {/* H1 с ключови думи */}
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          {subcategory.name} специалисти в България
        </h1>
        <p className="mb-8 text-gray-400">
          {specialists.length > 0
            ? `${specialists.length} верифицирани специалист${specialists.length === 1 ? "" : "а"} · Безплатна заявка`
            : "Намери верифицирани специалисти · Безплатна заявка"}
        </p>

        {/* Филтър по град */}
        {cities.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 self-center mr-1">Филтрирай по град:</span>
            {cities.map(city => (
              <a
                key={city}
                href={`?city=${encodeURIComponent(city)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300 hover:border-[#1DB954]/50 hover:text-white transition"
              >
                {city}
              </a>
            ))}
          </div>
        )}

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-12 text-center">
            <p className="text-gray-400 mb-4">Все още няма специалисти в тази категория.</p>
            <Link
              href={`/${locale}/register/specialist`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1DB954] px-6 py-3 text-black font-semibold hover:bg-[#1ed760] transition"
            >
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

        {/* SEO текст в дъното */}
        <div className="mt-16 rounded-2xl border border-white/5 bg-[#151528] p-6">
          <h2 className="mb-3 text-lg font-semibold">Как да намериш {subcategory.name} специалист?</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            В ProZona всички {subcategory.name.toLowerCase()} специалисти са верифицирани и проверени.
            Разгледай профилите, виж снимки от реални обекти и изпрати безплатна заявка директно към специалиста.
            Не плащаш комисиона — свързваш се директно.
          </p>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}