import Link from "next/link"
import ProZonaHeader from "../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../components/footer/ProZonaFooter"
import type { Metadata } from "next"

const CITY_MAP: Record<string, string> = {
  "sofia": "София",
  "plovdiv": "Пловдив",
  "varna": "Варна",
  "burgas": "Бургас",
  "ruse": "Русе",
  "stara-zagora": "Стара Загора",
  "pleven": "Плевен",
  "veliko-tarnovo": "Велико Търново",
  "blagoevgrad": "Благоевград",
  "pazardzhik": "Пазарджик",
  "haskovo": "Хасково",
  "shumen": "Шумен",
  "pernik": "Перник",
  "dobrich": "Добрич",
  "sliven": "Сливен",
  "vratsa": "Враца",
  "gabrovo": "Габрово",
  "yambol": "Ямбол",
  "vidin": "Видин",
  "montana": "Монтана",
  "kardzhali": "Кърджали",
  "razgrad": "Разград",
  "silistra": "Силистра",
  "targovishte": "Търговище",
}

const SERVICES = [
  { slug: "elektrotehnik", name: "Електротехник", icon: "⚡" },
  { slug: "vik", name: "ВиК майстор", icon: "🔧" },
  { slug: "pochistvane", name: "Почистване", icon: "🧹" },
  { slug: "pokrivi", name: "Ремонт на покриви", icon: "🏠" },
  { slug: "klimatik", name: "Монтаж на климатик", icon: "❄️" },
  { slug: "shpaklovka", name: "Шпакловка и боя", icon: "🖌️" },
  { slug: "gipsokarton", name: "Гипсокартон", icon: "🔨" },
  { slug: "remont-banya", name: "Ремонт на баня", icon: "🚿" },
  { slug: "podovi-nastilki", name: "Подови настилки", icon: "🪵" },
  { slug: "dovarshitelni-remonti", name: "Довършителни ремонти", icon: "🏗️" },
  { slug: "drebni-remonti", name: "Дребни ремонти", icon: "🪛" },
  { slug: "hamali", name: "Хамалски услуги", icon: "📦" },
  { slug: "gradina", name: "Градинарство", icon: "🌿" },
  { slug: "kosene", name: "Косене на трева", icon: "🌱" },
  { slug: "avtoserviz", name: "Автосервиз", icon: "🚗" },
  { slug: "gumi", name: "Смяна на гуми", icon: "🔄" },
  { slug: "boyadisvane", name: "Боядисване", icon: "🎨" },
  { slug: "remont-pokrivi", name: "Ремонт покриви", icon: "🏚️" },
]

interface Props {
  params: Promise<{ locale: string; city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, locale } = await params
  const cityBg = CITY_MAP[city] || city

  return {
    title: `Майстори и специалисти в ${cityBg} | ProZona`,
    description: `Намери верифицирани майстори и специалисти в ${cityBg}. Електротехници, ВиК, почистване, ремонти и още. Безплатна заявка в ProZona.`,
    keywords: `майстори ${cityBg}, специалисти ${cityBg}, ремонти ${cityBg}, ProZona`,
    alternates: {
      canonical: `https://prozona.bg/bg/uslugi/${city}`,
    },
    ...(locale !== "bg" && { robots: { index: false, follow: false } }),
  }
}

export default async function CityPage({ params }: Props) {
  const { locale, city } = await params
  const cityBg = CITY_MAP[city] || city

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Услуги в ${cityBg}`,
    "description": `Верифицирани майстори и специалисти в ${cityBg}`,
    "url": `https://prozona.bg/bg/uslugi/${city}`,
    "numberOfItems": SERVICES.length,
    "itemListElement": SERVICES.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${s.name} в ${cityBg}`,
      "url": `https://prozona.bg/bg/uslugi/${city}/${s.slug}`,
    }))
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Услуги в {cityBg}</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          Майстори и специалисти в {cityBg}
        </h1>
        <p className="mb-10 max-w-2xl text-gray-400 text-base leading-relaxed">
          Намери верифицирани майстори за всякакви услуги в {cityBg}. 
          Сравни профили, прочети отзиви и получи безплатна оферта директно от специалиста.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/${locale}/uslugi/${city}/${s.slug}`}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1DB954]/50 hover:bg-white/10"
            >
              <span className="text-2xl mb-3 block">{s.icon}</span>
              <h2 className="text-lg font-semibold mb-1">{s.name}</h2>
              <p className="text-sm text-gray-400">{s.name} в {cityBg}</p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-[#1DB954]">
                Намери специалист →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-white/5 bg-[#151528] p-6">
          <h2 className="mb-3 text-lg font-semibold">Защо ProZona в {cityBg}?</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Всички специалисти в {cityBg} в ProZona са верифицирани и проверени. 
            Изпращаш безплатна заявка, получаваш оферта и се свързваш директно с майстора — без комисиона и без посредници.
          </p>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}