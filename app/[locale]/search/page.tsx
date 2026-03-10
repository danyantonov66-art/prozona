import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

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
          SpecialistCategory: {
            some: {
              OR: [
                {
                  Category: {
                    name: { contains: q || "", mode: "insensitive" },
                  },
                },
                {
                  Subcategory: {
                    name: { contains: q || "", mode: "insensitive" },
                  },
                },
              ],
            },
          },
        },
      ],
      city: city || undefined,
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
        <h1 className="mb-10 text-4xl font-bold">
          Резултати от търсене
        </h1>

        {specialists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151528] p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">
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
                  <h2 className="text-2xl font-bold mb-2">
                    {displayName}
                  </h2>

                  {category && (
                    <p className="text-[#86efac] text-sm mb-1">
                      {category}
                      {subcategory ? ` • ${subcategory}` : ""}
                    </p>
                  )}

                  {specialist.city && (
                    <p className="text-gray-400 text-sm mb-4">
                      {specialist.city}
                    </p>
                  )}

                  {specialist.description && (
                    <p className="text-gray-300 text-sm mb-6 line-clamp-3">
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