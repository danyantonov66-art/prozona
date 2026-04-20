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
  "Самоков": [42.3369, 23.5530],
  "Видин": [43.9906, 22.8779],
  "Монтана": [43.4083, 23.2256],
  "Кюстендил": [42.2833, 22.6833],
  "Елин Пелин": [42.6667, 23.6],
  "Карнобат": [42.6500, 26.9833],
  "Банановци": [42.8, 23.5],
  "Varna": [43.2141, 27.9147],
  "Sofia": [42.6977, 23.3219],
  "Burgas": [42.5048, 27.4626],
  "Sofiq": [42.6977, 23.3219],
}

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ city?: string; category?: string }>
}

export const metadata = {
  title: "Специалисти | ProZona",
  description: "Разгледай верифицирани специалисти и майстори близо до теб.",
}

export const dynamic = "force-dynamic"

export default async function SpecialistsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { city, category } = await searchParams

  // Вземи само верифицирани специалисти с попълнено описание
  const allSpecialists = await prisma.specialist.findMany({
    where: { verified: true },
    include: {
      user: true,
      SpecialistCategory: {
        include: { Category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Скрий непопълнени профили — трябва описание и град
  const filledSpecialists = allSpecialists.filter(s =>
    s.description &&
    s.description.trim().length > 20 &&
    s.description !== "Профилът предстои да бъде попълнен."
  )

  // Уникални градове за филтъра
  const cities = Array.from(
    new Set(filledSpecialists.map(s => s.city).filter(Boolean))
  ).sort() as string[]

  // Уникални категории за филтъра
  const categories = Array.from(
    new Set(
      filledSpecialists.flatMap(s =>
        s.SpecialistCategory.map(sc => sc.Category?.name).filter(Boolean)
      )
    )
  ).sort() as string[]

  // Приложи филтри
  const specialists = filledSpecialists.filter(s => {
    if (city && s.city !== city) return false
    if (category) {
      const hasCat = s.SpecialistCategory.some(sc => sc.Category?.name === category)
      if (!hasCat) return false
    }
    return true
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
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-3xl font-bold">
            Специалисти
            <span className="ml-3 text-lg font-normal text-gray-400">({specialists.length})</span>
          </h1>
          <Link
            href={`/${locale}/become-specialist`}
            className="rounded-xl bg-[#1DB954] px-4 py-2 text-sm font-semibold text-black hover:bg-[#1ed760] transition"
          >
            + Стани специалист
          </Link>
        </div>

        {/* Филтри */}
        <div className="mb-8 flex flex-wrap gap-3">
          {/* Филтър по град */}
          <form method="GET" className="flex gap-3 flex-wrap">
            <select
              name="city"
              defaultValue={city || ""}
              onChange={(e) => {
                const url = new URL(window.location.href)
                if (e.target.value) url.searchParams.set("city", e.target.value)
                else url.searchParams.delete("city")
                window.location.href = url.toString()
              }}
              className="rounded-xl border border-white/10 bg-[#151528] px-4 py-2 text-sm text-white focus:border-[#1DB954] focus:outline-none"
            >
              <option value="">📍 Всички градове</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              name="category"
              defaultValue={category || ""}
              onChange={(e) => {
                const url = new URL(window.location.href)
                if (e.target.value) url.searchParams.set("category", e.target.value)
                else url.searchParams.delete("category")
                window.location.href = url.toString()
              }}
              className="rounded-xl border border-white/10 bg-[#151528] px-4 py-2 text-sm text-white focus:border-[#1DB954] focus:outline-none"
            >
              <option value="">🔧 Всички категории</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {(city || category) && (
              <a
                href={`/${locale}/specialists`}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                ✕ Изчисти филтрите
              </a>
            )}
          </form>
        </div>

        {mapSpecialists.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              📍 Специалисти на картата
            </h2>
            <SpecialistsMapWrapper specialists={mapSpecialists} locale={locale} />
          </div>
        )}

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-10 text-center text-gray-300">
            <p className="text-lg mb-2">Няма намерени специалисти</p>
            <p className="text-sm text-gray-500">Опитай с различни филтри или разгледай всички специалисти.</p>
            {(city || category) && (
              <a href={`/${locale}/specialists`} className="mt-4 inline-block text-[#1DB954] hover:underline text-sm">
                Виж всички специалисти →
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"
              const cats = specialist.SpecialistCategory
                .map(sc => sc.Category?.name)
                .filter(Boolean)
                .slice(0, 2)

              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialist/${specialist.id}`}
                  className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40 flex flex-col"
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
                  <h2 className="mb-1 text-xl font-semibold">{name}</h2>
                  {specialist.city && (
                    <p className="mb-2 text-sm text-gray-400">📍 {specialist.city}</p>
                  )}
                  {cats.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {cats.map(c => (
                        <span key={c} className="rounded-full bg-[#1DB954]/10 px-2 py-0.5 text-xs text-[#1DB954]">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="line-clamp-3 text-sm text-gray-300 flex-1">
                    {specialist.description}
                  </p>
                  <div className="mt-3 text-xs text-[#1DB954] font-medium">
                    Виж профил →
                  </div>
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