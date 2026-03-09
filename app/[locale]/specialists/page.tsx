import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function SpecialistsPage({ params }: Props) {
  const { locale } = await params

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
    },
    include: {
      user: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
        },
      },
      gallery: {
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-white">Специалисти</span>
        </div>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Намери специалист
          </h1>

          <p className="max-w-3xl text-lg text-gray-400">
            Разгледай верифицирани специалисти в ProZona и избери подходящия
            професионалист за твоята услуга.
          </p>
        </div>

        {specialists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151528] p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Все още няма публикувани специалисти
            </h2>

            <p className="mx-auto max-w-2xl text-gray-400">
              Скоро тук ще се появят първите верифицирани специалисти. Ако
              предлагаш услуги, създай профил и кандидатствай.
            </p>

            <div className="mt-6">
              <Link
                href={`/${locale}/become-specialist`}
                className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760]"
              >
                Стани специалист
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((specialist) => {
              const mainCategory = specialist.SpecialistCategory[0]?.Category?.name
              const subcategory = specialist.SpecialistCategory[0]?.Subcategory?.name
              const image = specialist.gallery[0]?.imageUrl
              const displayName =
                specialist.businessName || specialist.user?.name || "Специалист"

              return (
                <div
                  key={specialist.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#151528]"
                >
                  <div className="relative h-52 bg-[#1A1A2E]">
                    {image ? (
                      <img
                        src={image}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A1A2E] to-[#101522] text-gray-500">
                        Без снимка
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#86efac]">
                        Верифициран
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="mb-2 text-2xl font-bold text-white">
                      {displayName}
                    </h2>

                    {mainCategory && (
                      <p className="mb-1 text-sm text-[#86efac]">
                        {mainCategory}
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

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/${locale}/specialists/${specialist.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-4 py-2 font-semibold text-black transition hover:bg-[#1ed760]"
                      >
                        Виж профил
                      </Link>

                      <Link
                        href={`/${locale}/search?q=${encodeURIComponent(displayName)}`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/15 px-4 py-2 text-white transition hover:bg-white/10"
                      >
                        Подобни услуги
                      </Link>
                    </div>
                  </div>
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
