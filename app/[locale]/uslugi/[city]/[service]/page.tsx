import Link from "next/link"
import { prisma } from "../../../../../lib/prisma"
import ProZonaHeader from "../../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../../components/footer/ProZonaFooter"
import { categories, cities } from "../../../../../lib/constants"

interface Props {
  params: Promise<{
    locale: string
    city: string
    service: string
  }>
}

export default async function ServiceCityPage({ params }: Props) {
  const { locale, city, service } = await params

  const decodedCity = decodeURIComponent(city)
  const decodedService = decodeURIComponent(service)

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      city: decodedCity,
      OR: [
        {
          businessName: {
            contains: decodedService,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: decodedService,
            mode: "insensitive",
          },
        },
        {
          user: {
            is: {
              name: {
                contains: decodedService,
                mode: "insensitive",
              },
            },
          },
        },
      ],
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
        <div className="mb-8">
          <Link
            href={`/${locale}/categories`}
            className="text-sm text-[#1DB954] hover:underline"
          >
            ← Назад
          </Link>
        </div>

        <h1 className="mb-3 text-3xl font-bold">
          {decodedService} в {decodedCity}
        </h1>

        <p className="mb-8 text-gray-400">
          Намерени специалисти: {specialists.length}
        </p>

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-6 text-gray-300">
            Няма намерени специалисти за тази услуга в този град.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image =
                specialist.user?.image || null

              const name =
                specialist.businessName ||
                specialist.user?.name ||
                "Специалист"

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

                  <h2 className="mb-2 text-xl font-semibold">{name}</h2>

                  {specialist.city && (
                    <p className="mb-2 text-sm text-gray-400">
                      {specialist.city}
                    </p>
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