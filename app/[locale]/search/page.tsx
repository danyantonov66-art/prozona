import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { cities } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
  }>
  searchParams: Promise<{
    q?: string
    city?: string
  }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q, city } = await searchParams

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      OR: [
        { businessName: { contains: q || "", mode: "insensitive" } },
        { description: { contains: q || "", mode: "insensitive" } },
        {
         categories: {
          some: {
         OR: [
           {
          category: {
            name: { contains: q || "", mode: "insensitive" }
          }
        },
        {
              subcategory: {
               name: { contains: q || "", mode: "insensitive" }
          }
        }
      ]
    }
  }
}      city: city || undefined,
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
        <h1 className="mb-6 text-4xl font-bold">Резултати от търсене</h1>

        {/* SEARCH FILTER */}
        <form
          method="GET"
          className="mb-10 flex flex-wrap gap-4"
        >
          <input
            type="text"
            name="q"
            defaultValue={q || ""}
            placeholder="Каква услуга търсите?"
            className="rounded-xl border border-white/10 bg-[#151528] px-4 py-2 text-white"
          />

          <select
            name="city"
            defaultValue={city || ""}
            className="rounded-xl border border-white/10 bg-[#151528] px-4 py-2 text-white"
          >
            <option value="">Всички градове</option>

            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-xl bg-[#1DB954] px-6 py-2 font-semibold text-black hover:bg-[#1ed760]"
          >
            Търси
          </button>
        </form>

        {specialists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151528] p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              Няма намерени специалисти
            </h2>

            <p className="text-gray-400">
              Опитай с друга услуга или град.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((specialist) => {
              const displayName =
                specialist.businessName ||
                specialist.user?.name ||
                "Специалист"

              const category =
                specialist.SpecialistCategory[0]?.Category?.name

              const subcategory =
                specialist.SpecialistCategory[0]?.Subcategory?.name

              return (
                <div
                  key={specialist.id}
                  className="rounded-3xl border border-white/10 bg-[#151528] p-6"
                >
                  <h2 className="mb-2 text-2xl font-bold">
                    {displayName}
                  </h2>

                  {category && (
                    <p className="mb-1 text-sm text-[#86efac]">
                      {category}
                      {subcategory ? ` • ${subcategory}` : ""}
                    </p>
                  )}

                  {specialist.city && (
                    <p className="mb-4 text-sm text-gray-400">
                      {specialist.city}
                    </p>
                  )}

                  {specialist.description && (
                    <p className="mb-6 line-clamp-3 text-sm text-gray-300">
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