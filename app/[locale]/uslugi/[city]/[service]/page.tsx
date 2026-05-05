import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// --- SERVICE MAP ---
const SERVICE_MAP: Record<string, { name: string; keywords: string[] }> = {
  elektrotehnik: {
    name: "Електротехник",
    keywords: ["електро", "табло", "инсталация", "осветление", "авария"],
  },
  vik: {
    name: "ВиК майстор",
    keywords: ["вик", "тръби", "канализация", "батерия", "водопровод"],
  },
  pochistvane: {
    name: "Почистване",
    keywords: ["почистване", "мебел", "пране", "офис", "апартамент"],
  },
  pokrivi: {
    name: "Ремонт на покриви",
    keywords: ["покрив", "керемиди", "улуци", "хидроизолация"],
  },
  hamali: {
    name: "Хамалски услуги",
    keywords: ["хамали", "преместване", "транспорт"],
  },
  klimatik: {
    name: "Монтаж на климатик",
    keywords: ["климатик", "монтаж", "демонтаж", "профилактика"],
  },
  shpaklovka: {
    name: "Шпакловка и боя",
    keywords: ["шпакловка", "боя", "боядисване", "мазилка"],
  },
  gradina: {
    name: "Градинарство",
    keywords: ["градина", "косене", "озеленяване", "трева"],
  },
}

// --- CITY MAP ---
const CITY_MAP: Record<string, string> = {
  sofia: "София",
  plovdiv: "Пловдив",
  varna: "Варна",
  burgas: "Бургас",
  ruse: "Русе",
  "stara-zagora": "Стара Загора",
  pleven: "Плевен",
  "veliko-tarnovo": "Велико Търново",
  blagoevgrad: "Благоевград",
  haskovo: "Хасково",
  shumen: "Шумен",
  pernik: "Перник",
  dobrich: "Добрич",
  sliven: "Сливен",
  vratsa: "Враца",
  gabrovo: "Габрово",
  yambol: "Ямбол",
}

interface Props {
  params: Promise<{ locale: string; city: string; service: string }>
}

// --- META ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, service } = await params

  const cityBg = CITY_MAP[city] || city
  const svc = SERVICE_MAP[service]

  if (!svc) return { title: "ProZona" }

  return {
    title: `${svc.name} в ${cityBg} | ProZona`,
    description: `Намери ${svc.name.toLowerCase()} в ${cityBg}. Проверени специалисти и директен контакт. ProZona.bg`,
    alternates: {
      canonical: `https://www.prozona.bg/bg/uslugi/${city}/${service}`,
    },
  }
}

export const dynamic = "force-dynamic"

// --- PAGE ---
export default async function Page({ params }: Props) {
  const { locale, city, service } = await params

  const cityBg = CITY_MAP[city] || city
  const svc = SERVICE_MAP[service]

  if (!svc) return notFound()

  // --- DB QUERY ---
  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      city: { contains: cityBg, mode: "insensitive" },
      description: { not: null },
      OR: svc.keywords.map((k) => ({
        description: { contains: k, mode: "insensitive" },
      })),
    },
    include: { user: true },
    take: 30,
  })

  // --- FILTER ---
  const filtered = specialists.filter(
    (s) =>
      s.description &&
      s.description.length > 30 &&
      s.description !== "Профилът предстои да бъде попълнен."
  )

  // Свързани услуги
  const relatedServices = Object.entries(SERVICE_MAP)
    .filter(([slug]) => slug !== service)
    .slice(0, 4)

  // Свързани градове
  const relatedCities = Object.entries(CITY_MAP)
    .filter(([slug]) => slug !== city)
    .slice(0, 5)

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="max-w-6xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span>/</span>
          <Link href={`/${locale}/specialists`} className="text-[#1DB954] hover:underline">Специалисти</Link>
          <span>/</span>
          <span className="text-white">{svc.name} в {cityBg}</span>
        </div>

        {/* H1 */}
        <h1 className="text-4xl font-bold mb-4">
          {svc.name} в {cityBg}
        </h1>

        {/* TEXT */}
        <p className="text-gray-400 mb-8 max-w-2xl leading-relaxed">
          Намери проверени специалисти за {svc.name.toLowerCase()} в {cityBg}.
          Разгледай профили, сравни услуги и изпрати запитване директно към майстор.
        </p>

        {/* COUNT */}
        <div className="mb-8">
          <span className="rounded-full bg-[#1DB954]/10 px-4 py-1.5 text-sm text-[#1DB954] font-medium">
            {filtered.length} специалиста намерени в {cityBg}
          </span>
        </div>

        {/* LIST */}
        {filtered.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {filtered.map((s) => {
              const name = s.businessName || s.user?.name || "Специалист"
              const image = s.user?.image || null

              return (
                <div
                  key={s.id}
                  className="bg-[#151528] p-5 rounded-2xl border border-white/10 flex flex-col transition hover:border-[#1DB954]/40"
                >
                  <Link href={`/${locale}/specialist/${s.id}`} className="mb-4 block">
                    {image ? (
                      <img src={image} alt={name} className="h-40 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="h-40 bg-[#23233A] flex items-center justify-center text-4xl font-bold text-[#1DB954] rounded-xl">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <Link href={`/${locale}/specialist/${s.id}`} className="hover:text-[#1DB954] transition">
                    <h2 className="font-semibold text-xl mb-1">{name}</h2>
                  </Link>

                  <p className="text-sm text-gray-400 mb-2">📍 {s.city}</p>

                  <p className="text-sm text-gray-300 line-clamp-3 flex-1 mb-4">
                    {s.description}
                  </p>

                  <div className="flex gap-2 mt-auto">
                    <Link
                      href={`/${locale}/specialist/${s.id}#inquiry`}
                      className="flex-1 text-center bg-[#1DB954] text-black text-xs font-semibold py-2 rounded-lg hover:bg-[#1ed760] transition"
                    >
                      📩 Изпрати запитване
                    </Link>
                    <Link
                      href={`/${locale}/specialist/${s.id}`}
                      className="flex-1 text-center border border-white/20 text-xs font-semibold py-2 rounded-lg text-gray-300 hover:border-white/40 hover:text-white transition"
                    >
                      Виж профил →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="text-center py-16 mb-10">
            <p className="text-gray-400 mb-6 text-lg">
              Няма специалисти за {svc.name.toLowerCase()} в {cityBg} в момента.
            </p>
            <Link
              href={`/${locale}/request`}
              className="bg-[#1DB954] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#1ed760] transition"
            >
              📩 Публикувай запитване безплатно
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="rounded-2xl border border-[#1DB954]/20 bg-[#1DB954]/5 p-8 text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Не намери подходящ специалист?</h2>
          <p className="text-gray-400 mb-6">Публикувай запитване и специалисти от {cityBg} ще се свържат с теб.</p>
          <Link
            href={`/${locale}/request`}
            className="bg-[#1DB954] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#1ed760] transition"
          >
            📩 Публикувай запитване безплатно
          </Link>
        </div>

        {/* Вътрешни линкове */}
        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Други услуги в {cityBg}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {relatedServices.map(([slug, info]) => (
              <Link
                key={slug}
                href={`/${locale}/uslugi/${city}/${slug}`}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 hover:border-[#1DB954]/40 hover:text-[#1DB954] transition"
              >
                {info.name} в {cityBg}
              </Link>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-3">{svc.name} в други градове</h3>
          <div className="flex flex-wrap gap-2">
            {relatedCities.map(([slug, name]) => (
              <Link
                key={slug}
                href={`/${locale}/uslugi/${slug}/${service}`}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 hover:border-[#1DB954]/40 hover:text-[#1DB954] transition"
              >
                {svc.name} в {name}
              </Link>
            ))}
          </div>
        </div>

      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}