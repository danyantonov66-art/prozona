import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    q?: string
    city?: string
    category?: string
    subcategory?: string
  }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q, city, category, subcategory } = await searchParams
  const query = q?.trim() || ""

  const where: any = {
    verified: true,
    ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
  }

  // Търсене по категория/подкатегория
  if (category || subcategory) {
    where.SpecialistCategory = {
      some: {
        ...(category ? { Category: { slug: category } } : {}),
        ...(subcategory ? { Subcategory: { slug: subcategory } } : {}),
      },
    }
  }

  // Търсене по текст
  if (query) {
    where.OR = [
      { businessName: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { user: { is: { name: { contains: query, mode: "insensitive" } } } },
      {
        SpecialistCategory: {
          some: {
            Category: { name: { contains: query, mode: "insensitive" } },
          },
        },
      },
      {
        SpecialistCategory: {
          some: {
            Subcategory: { name: { contains: query, mode: "insensitive" } },
          },
        },
      },
    ]
  }

  const specialists = await prisma.specialist.findMany({
    where,
    include: {
      user: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
        },
      },
    },
    orderBy: [
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  })

  const searchTitle = query
    ? `Резултати за „${query}"`
    : category
    ? `Специалисти в категория`
    : "Всички специалисти"

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-10">

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{searchTitle}</h1>
          <p className="text-sm text-gray-400">{specialists.length} намерени</p>
        </div>

        {/* Активни филтри */}
        {(query || city || category) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {query && (
              <span className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-3 py-1 text-sm text-[#1DB954]">
                🔍 {query}
              </span>
            )}
            {city && (
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-gray-300">
                📍 {city}
              </span>
            )}
            {category && (
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-gray-300">
                📂 {category}
              </span>
            )}
            <Link
              href={`/${locale}/search`}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm text-red-400 hover:bg-red-500/20"
            >
              ✕ Изчисти
            </Link>
          </div>
        )}

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
            <p className="mb-4 text-gray-300">Няма намерени специалисти.</p>
            <Link
              href={`/${locale}/specialists`}
              className="text-[#1DB954] hover:underline"
            >
              Виж всички специалисти →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"
              const cats = specialist.SpecialistCategory
                .map((sc) => sc.Subcategory?.name || sc.Category?.name)
                .filter(Boolean)
                .slice(0, 2)

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
                  {cats.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {cats.map((cat, i) => (
                        <span key={i} className="rounded-full bg-[#1DB954]/10 px-2 py-0.5 text-xs text-[#1DB954]">
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="line-clamp-3 text-sm text-gray-300">
                    {specialist.description || "Няма добавено описание."}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}