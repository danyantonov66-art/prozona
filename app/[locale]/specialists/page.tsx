import Link from "next/link"
import ProZonaHeader from "../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../components/footer/ProZonaFooter"
import { prisma } from "../../../lib/prisma"
import SpecialistsMapWrapper from "../../../components/SpecialistsMapWrapper"

const CITY_COORDS: Record<string, [number, number]> = {
  "София": [42.6977, 23.3219],
  "Пловдив": [42.1354, 24.7453],
  "Варна": [43.2141, 27.9147],
  "Бургас": [42.5048, 27.4626],
  "Русе": [43.8356, 25.9657],
  "Стара Загора": [42.4257, 25.6345],
  "Плевен": [43.4170, 24.6069],
  "Велико Търново": [43.0757, 25.6172],
  "Благоевград": [42.0135, 23.0942],
  "Пазарджик": [42.1928, 24.3317],
  "Хасково": [41.9345, 25.5554],
  "Шумен": [43.2707, 26.9220],
  "Перник": [42.6046, 23.0376],
  "Добрич": [43.5703, 27.8272],
  "Сливен": [42.6868, 26.3259],
  "Враца": [43.2057, 23.5504],
  "Габрово": [42.8744, 25.3169],
  "Ямбол": [42.4838, 26.5036],
  "България": [42.7, 25.5],
  "Самоков": [42.3369, 23.5530],
  "Varna": [43.2141, 27.9147],
}

interface Props {
  params: Promise<{ locale: string }>
}

export const metadata = {
  title: "Специалисти",
  description: "Разгледай верифицирани специалисти и майстори близо до теб.",
}

export const dynamic = "force-dynamic"

export default async function SpecialistsPage({ params }: Props) {
  const { locale } = await params

  const specialists = await prisma.specialist.findMany({
    where: { verified: true },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  const mapSpecialists = specialists
    .map((s) => {
      const coords = s.city ? CITY_COORDS[s.city] : null
      if (!coords) return null
      return {
        id: s.id,
        name: s.businessName || s.user?.name || "Специалист",
        city: s.city,
        lat: coords[0],
        lng: coords[1],
      }
    })
    .filter(Boolean) as any[]

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Специалисти</h1>

        {mapSpecialists.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              📍 Специалисти на картата
            </h2>
            <SpecialistsMapWrapper specialists={mapSpecialists} locale={locale} />
          </div>
        )}

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-6 text-gray-300">
            Няма намерени специалисти.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"

              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialist/${specialist.id}`}
                  className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40"
                >
                  <div className="mb-4">
                    {image ? (
                      <img src={image} alt={name} className="h-40 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-xl bg-[#23233A] text-4xl font-bold text-[#1DB954]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h2 className="mb-2 text-xl font-semibold">{name}</h2>
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
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}