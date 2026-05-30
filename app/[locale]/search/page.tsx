
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import SearchFilters from "@/components/SearchFilters"
import SpecialistsList from "@/components/SpecialistsList"

interface Props {
  params: Promise<{ locale: string }>
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

  const [dbCategories, specialists] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        Subcategory: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        }
      }
    }),
    prisma.specialist.findMany({
      where: {
        verified: true,
        ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
        ...(category || subcategory ? {
          SpecialistCategory: {
            some: {
              ...(category ? { Category: { slug: category } } : {}),
              ...(subcategory ? { Subcategory: { slug: subcategory } } : {}),
            }
          }
        } : {}),
        ...(query ? {
          OR: [
            { businessName: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { user: { is: { name: { contains: query, mode: "insensitive" } } } },
            { SpecialistCategory: { some: { Category: { name: { contains: query, mode: "insensitive" } } } } },
            { SpecialistCategory: { some: { Subcategory: { name: { contains: query, mode: "insensitive" } } } } },
          ]
        } : {}),
      },
      include: {
        user: true,
        SpecialistCategory: {
          include: { Category: true, Subcategory: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    })
  ])

  const hasFilters = query || city || category

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-10">

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">
            {query ? `Резултати за „${query}"` : category ? `Специалисти` : "Намери специалист"}
          </h1>
          <p className="text-sm text-gray-400">
            {specialists.length} специалиста намерени{city ? ` в ${city}` : ""}
            {specialists.length > 0 && (
              <span className="ml-2 text-[#1DB954]">— избери до 3 и изпрати едно запитване</span>
            )}
          </p>
        </div>

        {/* Филтри */}
        <SearchFilters
          locale={locale}
          initialQ={query}
          initialCity={city}
          initialCategory={category}
          categories={dbCategories}
        />

        {/* Активни филтри */}
        {hasFilters && (
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
                📂 {dbCategories.find(c => c.slug === category)?.name || category}
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
            <div className="text-4xl mb-3">🔍</div>
            <p className="mb-2 text-lg text-gray-300">Няма намерени специалисти.</p>
            <p className="text-sm text-gray-500 mb-6">Опитай с различна услуга или град.</p>
            <Link
              href={`/${locale}/request`}
              className="inline-block rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black hover:bg-[#1ed760] transition"
            >
              📩 Публикувай безплатно запитване
            </Link>
          </div>
        ) : (
          <SpecialistsList specialists={specialists} locale={locale} />
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-[#1DB954]/20 bg-[#1DB954]/5 p-6 text-center">
          <p className="text-gray-300 mb-3">Не намери подходящ специалист?</p>
          <Link
            href={`/${locale}/request`}
            className="inline-block rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black hover:bg-[#1ed760] transition"
          >
            📩 Публикувай безплатно запитване
          </Link>
        </div>

      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}