import Link from "next/link"
import { prisma } from "../../../../../lib/prisma"
import ProZonaHeader from "../../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
    city: string
    service: string
  }>
}

const serviceLabels: Record<string, string> = {
  vik: "ВиК майстор",
  elektro: "Електротехник",
  boyadisvane: "Бояджия",
  "shpaklovka-zidariya": "Шпакловка и зидария",
  "remont-banya": "Ремонт на баня",
  gipsokarton: "Гипсокартон",
  "dovarshitelni-remonti": "Довършителни ремонти",
  domashno: "Домашно почистване",
  osnovno: "Основно почистване",
  "sled-remont": "Почистване след ремонт",
  ofis: "Офис почистване",
  naem: "Почистване под наем",
  mebeli: "Монтаж на мебели",
  klimatici: "Монтаж на климатици",
  osvetlenie: "Осветление",
  elektrouredi: "Електроуреди",
  "drebni-remonti": "Дребни ремонти",
  "premestvane-hamali": "Преместване и хамали",
  kosene: "Косене на трева",
  "poddrazhka-dvor": "Поддръжка на двор",
  podryazvane: "Подрязване на дървета",
  ozelenyavane: "Озеленяване",
  "pochistvane-dvor": "Почистване на двор",
}

const cityLabels: Record<string, string> = {
  sofia: "София",
  plovdiv: "Пловдив",
  varna: "Варна",
  burgas: "Бургас",
  ruse: "Русе",
  "stara-zagora": "Стара Загора",
  pleven: "Плевен",
  vidin: "Видин",
  "veliko-tarnovo": "Велико Търново",
  blagoevgrad: "Благоевград",
  pernik: "Перник",
  haskovo: "Хасково",
  yambol: "Ямбол",
  pazardzhik: "Пазарджик",
  dobrich: "Добрич",
  shumen: "Шумен",
  sliven: "Сливен",
  vratsa: "Враца",
  gabrovo: "Габрово",
  kardzhali: "Кърджали",
}

export async function generateMetadata({ params }: Props) {
  const { locale, city, service } = await params

  const cityLabel = cityLabels[city] || city
  const serviceLabel = serviceLabels[service] || service

  const title = `${serviceLabel} ${cityLabel} | ProZona.bg`
  const description = `Намери верифициран ${serviceLabel.toLowerCase()} в ${cityLabel}. Сравни специалисти, виж отзиви и цени на ProZona.bg.`
  const canonicalUrl = `https://prozona.bg/${locale}/uslugi/${city}/${service}`

  return {
    title,
    description,
    keywords: `${serviceLabel}, ${cityLabel}, специалист, майстор, ProZona`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ProZona.bg",
      locale: "bg_BG",
      type: "website",
    },
  }
}

export default async function ServiceCityPage({ params }: Props) {
  const { locale, city, service } = await params

  const cityLabel = cityLabels[city] || city
  const serviceLabel = serviceLabels[service] || service

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      city: { equals: cityLabel, mode: "insensitive" },
      OR: [
        { businessName: { contains: serviceLabel, mode: "insensitive" } },
        { description: { contains: serviceLabel, mode: "insensitive" } },
        { description: { contains: service, mode: "insensitive" } },
      ],
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  })

  const canonicalUrl = `https://prozona.bg/${locale}/uslugi/${city}/${service}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${serviceLabel} в ${cityLabel}`,
    description: `Верифицирани специалисти за ${serviceLabel.toLowerCase()} в ${cityLabel}`,
    url: canonicalUrl,
    numberOfItems: specialists.length,
    itemListElement: specialists.slice(0, 10).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: s.businessName || s.user?.name || "Специалист",
        url: `https://prozona.bg/${locale}/specialists/${s.id}`,
        areaServed: cityLabel,
        "@id": `https://prozona.bg/${locale}/specialists/${s.id}`,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <nav className="text-sm text-gray-400">
            <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">Категории</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{serviceLabel} в {cityLabel}</span>
          </nav>
        </div>

        <h1 className="mb-3 text-3xl font-bold">
          {serviceLabel} в {cityLabel}
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
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"

              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialists/${specialist.id}`}
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
                    <p className="mb-2 text-sm text-gray-400">{specialist.city}</p>
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