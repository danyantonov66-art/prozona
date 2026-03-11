import Link from "next/link"
import ProZonaHeader from "../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../components/footer/ProZonaFooter"
import { prisma } from "../../../lib/prisma"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function SpecialistsPage({ params }: Props) {
  const { locale } = await params

  const specialists = await prisma.specialist.findMany({
    where: {
      isVerified: true,
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
        <h1 className="mb-8 text-3xl font-bold">Специалисти</h1>

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-6 text-gray-300">
            Няма намерени специалисти.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image =
                specialist.images?.[0] || specialist.user?.image || null

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