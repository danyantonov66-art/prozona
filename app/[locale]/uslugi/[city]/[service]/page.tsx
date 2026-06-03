import Link from "next/link"
import { prisma } from "../../../../../lib/prisma"
import ProZonaHeader from "../../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../../components/footer/ProZonaFooter"
import type { Metadata } from "next"
import { redirect } from 'next/navigation'

const SERVICE_MAP: Record<string, {
  name: string
  categoryName: string
  description: (city: string) => string
  keywords: string[]
  seoText: (city: string) => string
}> = {
  "vik": {
    name: "ВиК майстор",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш ВиК майстор в ${city}? ProZona свързва клиенти с верифицирани водопроводчии за ремонт на тръби, смяна на батерии, отпушване на канализация и монтаж на санитария. Намери ВиК специалист в ${city} сега.`,
    keywords: ["ВиК", "водопроводчия", "тръби", "батерия", "канализация", "вик майстор", "вик майстори", "водопроводчик"],
    seoText: (city) => `ВиК майсторите в ${city} регистрирани в ProZona са верифицирани и проверени. Услугите включват: ремонт на спукани тръби, смяна на смесители и батерии, отпушване на мивки и тоалетни, монтаж на бойлери, монтаж на санитарни възли и цялостна ВиК инсталация. При авария в ${city} — намери майстор бързо и без посредници.`,
  },
  "elektrotehnik": {
    name: "Електротехник",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш електротехник в ${city}? В ProZona ще намериш проверени специалисти за ремонт на електроинсталации, аварии, смяна на табло и монтаж на осветление. Разгледай профилите, сравни услуги и изпрати запитване директно към майстор в ${city}.`,
    keywords: ["електротехник", "ел инсталация", "авария", "табло", "осветление", "електро"],
    seoText: (city) => `Електротехниците в ${city} в ProZona са верифицирани специалисти за всички видове електро услуги — от смяна на контакт до цялостна инсталация. Намери надежден майстор без посредници.`,
  },
  "elektro": {
    name: "Електроинсталации",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш електротехник за инсталации в ${city}? В ProZona ще намериш проверени специалисти за електроинсталации, аварии и монтаж на осветление в ${city}.`,
    keywords: ["електроинсталации", "електротехник", "ел инсталация", "табло"],
    seoText: (city) => `Намери верифициран електротехник в ${city} за монтаж на електроинсталации, осветление и аварийни ремонти.`,
  },
  "pochistvane": {
    name: "Почистване",
    categoryName: "Почистване",
    description: (city) => `Нуждаеш се от почистване в ${city}? В ProZona ще намериш фирми и специалисти за генерално почистване на апартаменти, офиси, след ремонт и редовна поддръжка. Изпрати запитване и получи оферта от проверен специалист в ${city}.`,
    keywords: ["почистване", "генерално почистване", "почистване апартамент", "почистване офис", "след ремонт"],
    seoText: (city) => `Фирмите за почистване в ${city} в ProZona предлагат генерално, основно и офис почистване. Намери надежден специалист без посредници.`,
  },
  "domashno": {
    name: "Домашно почистване",
    categoryName: "Почистване",
    description: (city) => `Търсиш домашно почистване в ${city}? В ProZona ще намериш фирми и специалисти за редовно и генерално почистване на апартаменти и домове в ${city}.`,
    keywords: ["домашно почистване", "почистване апартамент", "почистване вкъщи", "почистване"],
    seoText: (city) => `Намери верифицирана фирма за домашно почистване в ${city}. Редовна и еднократна услуга без посредници.`,
  },
  "pokrivi": {
    name: "Ремонт на покриви",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш майстор за ремонт на покрив в ${city}? ProZona свързва теб с опитни специалисти за пренареждане на керемиди, хидроизолация, ремонт на улуци и цялостно обновяване на покриви. Безплатен оглед и оферта от майстор в ${city}.`,
    keywords: ["ремонт покрив", "керемиди", "хидроизолация", "улуци"],
    seoText: (city) => `Намери верифициран майстор за ремонт на покриви в ${city}. Хидроизолация, керемиди и улуци без посредници.`,
  },
  "hamali": {
    name: "Хамалски услуги",
    categoryName: "Монтаж и дребни услуги",
    description: (city) => `Търсиш хамали в ${city}? Намери надеждни специалисти за преместване на мебели, офис или домакинство в ${city}. Проверени профили, реални цени и директен контакт с изпълнителя.`,
    keywords: ["хамали", "преместване", "транспорт", "местене на мебели"],
    seoText: (city) => `Намери верифицирани хамали в ${city} за преместване на мебели и домакинство. Директен контакт без посредници.`,
  },
  "klimatik": {
    name: "Монтаж на климатик",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш монтаж на климатик в ${city}? В ProZona ще намериш специалисти за монтаж, демонтаж и профилактика на климатици в ${city}. Сравни оферти и избери най-добрия майстор.`,
    keywords: ["климатик", "монтаж климатик", "профилактика климатик", "демонтаж климатик"],
    seoText: (city) => `Намери верифициран техник за монтаж на климатик в ${city}. Профилактика и смяна на фреон без посредници.`,
  },
  "klimatici": {
    name: "Климатици",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш монтаж или ремонт на климатик в ${city}? ProZona свързва теб с верифицирани техници за монтаж, демонтаж и профилактика на климатици в ${city}.`,
    keywords: ["климатик", "монтаж климатик", "ремонт климатик", "профилактика"],
    seoText: (city) => `Намери верифициран техник за климатик в ${city}. Монтаж, ремонт и профилактика без посредници.`,
  },
  "shpaklovka": {
    name: "Шпакловка и боя",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш майстор за шпакловка и боя в ${city}? ProZona свързва теб с опитни специалисти за шпакловане, боядисване и декоративни мазилки в ${city}. Виж профилите и изпрати запитване.`,
    keywords: ["шпакловка", "боя", "боядисване", "декоративна мазилка"],
    seoText: (city) => `Намери верифициран майстор за шпакловка и боя в ${city}. Боядисване и декоративни мазилки без посредници.`,
  },
  "shpaklovka-zidariya": {
    name: "Шпакловка и зидария",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш майстор за шпакловка и зидария в ${city}? ProZona свързва теб с опитни специалисти за шпакловане, зидария и мазилки в ${city}.`,
    keywords: ["шпакловка", "зидария", "мазилка", "боя"],
    seoText: (city) => `Намери верифициран майстор за шпакловка и зидария в ${city}. Директен контакт без посредници.`,
  },
  "boyadisvane": {
    name: "Боядисване",
    categoryName: "Ремонти и майстори",
    description: (city) => `Търсиш майстор за боядисване в ${city}? ProZona свързва теб с опитни специалисти за боядисване на стаи, апартаменти и фасади в ${city}.`,
    keywords: ["боядисване", "боя", "шпакловка", "декоративна мазилка"],
    seoText: (city) => `Намери верифициран бояджия в ${city}. Боядисване на стаи, апартаменти и фасади без посредници.`,
  },
  "gradina": {
    name: "Градинарство",
    categoryName: "Градина и двор",
    description: (city) => `Търсиш градинар в ${city}? В ProZona ще намериш специалисти за косене на трева, озеленяване, поливни системи и поддръжка на двор в ${city}. Намери своя градинар сега.`,
    keywords: ["градинар", "косене трева", "озеленяване", "поливна система"],
    seoText: (city) => `Намери верифициран градинар в ${city}. Косене, озеленяване и поддръжка на двор без посредници.`,
  },
  "gipsokarton": {
    name: "Гипсокартон",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш специалист по гипсокартон в ${city}? В ProZona ще намериш майстори за окачени тавани, преградни стени и декоративни елементи в ${city}. Сравни оферти и изпрати запитване директно.`,
    keywords: ["гипсокартон", "окачен таван", "преградна стена", "суха стена"],
    seoText: (city) => `Намери верифициран майстор по гипсокартон в ${city}. Окачени тавани и преградни стени без посредници.`,
  },
  "drebni-remonti": {
    name: "Дребни ремонти",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш майстор за дребни ремонти в ${city}? ProZona свързва теб с опитни специалисти за монтаж, смяна на брави, запълване на пукнатини и други дребни задачи в дома в ${city}.`,
    keywords: ["дребни ремонти", "домашни ремонти", "майстор", "монтаж"],
    seoText: (city) => `Намери верифициран майстор за дребни ремонти в ${city}. Бързи и качествени решения без посредници.`,
  },
  "dovarshitelni-remonti": {
    name: "Довършителни ремонти",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш майстор за довършителни ремонти в ${city}? Намери верифицирани специалисти за шпакловка, боя, подови настилки и довършителни работи в ${city}.`,
    keywords: ["довършителни ремонти", "шпакловка", "боя", "подови настилки"],
    seoText: (city) => `Намери верифициран майстор за довършителни ремонти в ${city}. Качествена работа без посредници.`,
  },
  "remont-banya": {
    name: "Ремонт на баня",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш майстор за ремонт на баня в ${city}? ProZona свързва теб с верифицирани специалисти за цялостен и частичен ремонт на баня в ${city}.`,
    keywords: ["ремонт баня", "баня", "плочки", "ВиК", "санитария"],
    seoText: (city) => `Намери верифициран майстор за ремонт на баня в ${city}. Цялостен и частичен ремонт без посредници.`,
  },
  "remont-pokrivi": {
    name: "Ремонт на покриви",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш майстор за ремонт на покрив в ${city}? В ProZona ще намериш специалисти за пренареждане на керемиди, хидроизолация и ремонт на улуци в ${city}.`,
    keywords: ["покрив", "керемиди", "хидроизолация", "улуци", "ремонт покрив"],
    seoText: (city) => `Намери верифициран майстор за ремонт на покриви в ${city}. Хидроизолация и керемиди без посредници.`,
  },
  "podovi-nastilki": {
    name: "Подови настилки",
    categoryName: "Ремонти и строителство",
    description: (city) => `Търсиш майстор за подови настилки в ${city}? В ProZona ще намериш специалисти за монтаж на паркет, ламинат, теракот и винил в ${city}.`,
    keywords: ["подови настилки", "паркет", "ламинат", "теракот", "винил"],
    seoText: (city) => `Намери верифициран майстор за подови настилки в ${city}. Паркет, ламинат и теракот без посредници.`,
  },
  "kosene": {
    name: "Косене на трева",
    categoryName: "Градина и двор",
    description: (city) => `Търсиш майстор за косене на трева в ${city}? В ProZona ще намериш специалисти за косене и поддръжка на трева и двор в ${city}.`,
    keywords: ["косене трева", "градинар", "поддръжка двор", "косене"],
    seoText: (city) => `Намери верифициран градинар за косене на трева в ${city}. Бързо и качествено без посредници.`,
  },
  "avtoserviz": {
    name: "Автосервиз",
    categoryName: "Авто услуги",
    description: (city) => `Търсиш автосервиз в ${city}? В ProZona ще намериш верифицирани автосервизи за ремонт, диагностика и поддръжка на автомобили в ${city}.`,
    keywords: ["автосервиз", "ремонт кола", "диагностика", "масло", "спирачки"],
    seoText: (city) => `Намери верифициран автосервиз в ${city}. Ремонт и диагностика без посредници.`,
  },
  "gumi": {
    name: "Смяна на гуми",
    categoryName: "Авто услуги",
    description: (city) => `Търсиш смяна на гуми в ${city}? В ProZona ще намериш верифицирани специалисти за монтаж, демонтаж и балансиране на гуми в ${city}.`,
    keywords: ["гуми", "смяна гуми", "балансиране", "монтаж гуми"],
    seoText: (city) => `Намери верифициран специалист за смяна на гуми в ${city}. Монтаж и балансиране без посредници.`,
  },
}

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

interface Props {
  params: Promise<{ locale: string; city: string; service: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, service, locale } = await params
  const cityBg = CITY_MAP[city] || city
  const svc = SERVICE_MAP[service]
  if (!svc) return { title: "ProZona" }

  return {
    title: `${svc.name} в ${cityBg} | ProZona`,
    description: `Намери ${svc.name.toLowerCase()} в ${cityBg}. Проверени специалисти, реални оферти и бърз контакт. ProZona.bg`,
    alternates: {
      canonical: `https://prozona.bg/bg/uslugi/${city}/${service}`,
    },
    ...(locale !== "bg" && { robots: { index: false, follow: false } }),
  }
}

export const dynamic = "force-dynamic"

export default async function ServiceCityPage({ params }: Props) {
  const { locale, city, service } = await params
  // Redirect кирилски градове към latin slug
const cityLower = city.toLowerCase()
if (city !== cityLower || /[а-яё]/i.test(city)) {
  const latinCity = Object.entries(CITY_MAP).find(([, bg]) => 
    bg.toLowerCase() === decodeURIComponent(city).toLowerCase()
  )?.[0]
  if (latinCity) {
    redirect(`/${locale}/uslugi/${latinCity}/${service}`)
  }
}

  const cityBg = CITY_MAP[city] || decodeURIComponent(city)
  const svc = SERVICE_MAP[service]
  const serviceName = svc?.name || decodeURIComponent(service)
  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      city: { equals: cityBg, mode: "insensitive" },
      ...(svc ? {
        OR: svc.keywords.map(k => ({
          description: { contains: k, mode: "insensitive" }
        }))
      } : {}),
    },
    include: {
      user: true,
      SpecialistCategory: { include: { Category: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const filled = specialists.filter(s =>
    s.description && s.description.trim().length > 20
  )

  const relatedServices = Object.entries(SERVICE_MAP)
    .filter(([slug]) => slug !== service)
    .slice(0, 4)
    const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": `${serviceName} в ${cityBg}`,
  "description": svc?.description(cityBg) || `${serviceName} специалисти в ${cityBg}`,
  "provider": {
    "@type": "Organization",
    "name": "ProZona",
    "url": "https://prozona.bg"
  },
  "areaServed": {
    "@type": "City",
    "name": cityBg,
    "addressCountry": "BG"
  },
  "url": `https://prozona.bg/bg/uslugi/${city}/${service}`,
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "BGN",
    "offerCount": filled.length,
  }
}

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10">

        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span>/</span>
          <Link href={`/${locale}/specialists`} className="text-[#1DB954] hover:underline">Специалисти</Link>
          <span>/</span>
          <span className="text-white">{serviceName} в {cityBg}</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold">
          {serviceName} в {cityBg}
        </h1>

        {svc && (
          <p className="mb-8 max-w-2xl text-gray-300 leading-relaxed">
            {svc.description(cityBg)}
          </p>
        )}

        <div className="mb-8 flex items-center gap-4">
          <span className="rounded-full bg-[#1DB954]/10 px-4 py-1.5 text-sm text-[#1DB954] font-medium">
            {filled.length} специалист{filled.length === 1 ? "" : "а"} намерени
          </span>
          <span className="text-sm text-gray-500">в {cityBg}</span>
        </div>

        {filled.length === 0 ? (
          <div className="mb-10 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#151528] p-10 text-center">
              <p className="mb-2 text-lg text-gray-300">
                Няма намерени специалисти за {serviceName} в {cityBg} в момента.
              </p>
              <p className="mb-6 text-sm text-gray-500">
                Публикувай запитване и специалисти ще се свържат с теб.
              </p>
              <Link
                href={`/${locale}/request`}
                className="rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black hover:bg-[#1ed760] transition"
              >
                📩 Публикувай запитване
              </Link>
            </div>

            <div className="rounded-2xl border border-[#1DB954]/30 bg-[#1DB954]/5 p-10 text-center">
              <div className="mb-3 text-4xl">🔧</div>
              <h2 className="mb-3 text-2xl font-bold text-white">
                Търсим {serviceName} в {cityBg}!
              </h2>
              <p className="mb-2 text-gray-300 max-w-xl mx-auto">
                Бъди първият специалист за{" "}
                <strong className="text-[#1DB954]">{serviceName}</strong>{" "}
                в <strong className="text-[#1DB954]">{cityBg}</strong> в ProZona.
              </p>
              <p className="mb-6 text-sm text-gray-400">
                Безплатна регистрация · Първите 200 получават 6 месеца Premium · Без абонамент
              </p>
              <Link
                href={`/${locale}/register/specialist`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1DB954] px-8 py-3 font-semibold text-black hover:bg-[#1ed760] transition text-base"
              >
                ✅ Регистрирай се безплатно →
              </Link>
            </div>
          </div>
        ) : (
          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filled.map((specialist) => {
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"
              const cats = Array.from(new Set(
                specialist.SpecialistCategory.map(sc => sc.Category?.name).filter(Boolean)
              )).slice(0, 2) as string[]

              return (
                <div
                  key={specialist.id}
                  className="rounded-2xl border border-white/10 bg-[#151528] p-5 flex flex-col transition hover:border-[#1DB954]/40"
                >
                 <Link  href={`/${locale}/specialist/${specialist.slug || specialist.id}`} className="mb-4 block">
                    {image ? (
                      <img src={image} alt={name} className="h-40 w-full rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-xl bg-[#23233A] text-4xl font-bold text-[#1DB954]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>

                   <Link href={`/${locale}/specialist/${specialist.slug || specialist.id}`} className="mb-1 block hover:text-[#1DB954] transition">
                    <h2 className="text-xl font-semibold">{name}</h2>
                  </Link>

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

                  <p className="line-clamp-3 text-sm text-gray-300 flex-1 mb-4">
                    {specialist.description}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
  href={`/${locale}/specialist/${specialist.slug || specialist.id}`}
  className="flex-1 rounded-lg bg-[#1DB954] px-3 py-2 text-center text-xs font-semibold text-black hover:bg-[#1ed760] transition"
>
  📩 Изпрати запитване
</Link>
<Link
  href={`/${locale}/specialist/${specialist.slug || specialist.id}`}
  className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-center text-xs font-semibold text-gray-300 hover:border-white/40 hover:text-white transition"
>
  Виж профил →
</Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mb-10 rounded-2xl border border-[#1DB954]/20 bg-[#1DB954]/5 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Не намери подходящ специалист?</h2>
          <p className="mb-6 text-gray-400">
            Публикувай запитване и специалисти от {cityBg} ще се свържат с теб директно.
          </p>
          <Link
            href={`/${locale}/request`}
            className="rounded-xl bg-[#1DB954] px-8 py-3 font-semibold text-black hover:bg-[#1ed760] transition"
          >
            📩 Публикувай запитване безплатно
          </Link>
        </div>

        {/* SEO текст */}
        {svc && (
          <div className="mb-10 rounded-2xl border border-white/5 bg-[#151528] p-6">
            <h2 className="mb-3 text-lg font-semibold">За {serviceName} в {cityBg}</h2>
            <p className="text-sm text-gray-400 leading-relaxed">{svc.seoText(cityBg)}</p>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-300">Други услуги в {cityBg}</h3>
          <div className="flex flex-wrap gap-2">
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
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(CITY_MAP).filter(([slug]) => slug !== city).slice(0, 6).map(([slug, name]) => (
              <Link
                key={slug}
                href={`/${locale}/uslugi/${slug}/${service}`}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 hover:border-[#1DB954]/40 hover:text-[#1DB954] transition"
              >
                {serviceName} в {name}
              </Link>
            ))}
          </div>
        </div>

      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}