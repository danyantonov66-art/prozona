import PopularCities from "@/components/PopularCities"
import SearchBar from "@/components/SearchBar"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
  }>
}

const featuredPosts = [
  {
    slug: "kak-da-izberesh-maistor-za-remont",
    title: "Как да избереш майстор за ремонт без излишен риск",
    excerpt: "Най-важните неща, които да провериш преди да наемеш майстор за дома си.",
  },
  {
    slug: "kolko-struva-domashnoto-pochistvane-v-sofia",
    title: "Колко струва домашното почистване в София",
    excerpt: "Ориентировъчни цени и какво влияе върху крайната стойност на услугата.",
  },
  {
    slug: "hamalski-uslugi-koga-si-zasluzhava",
    title: "Хамалски услуги: кога си заслужава да наемеш професионален екип",
    excerpt: "Кога професионалните хамали спестяват време, риск и излишни разходи.",
  },
]

const comparisonRows = [
  {
    feature: "Монетизация за специалисти",
    prozona: "Кредити – плащаш само за реален контакт",
    benefit: "Нисък риск: не плащаш, ако няма клиенти. Плащаш само когато печелиш.",
  },
  {
    feature: "Безплатен план",
    prozona: "Безплатен завинаги (само кредити за контакти)",
    benefit: "Започваш без инвестиция – идеално за нови майстори.",
  },
  {
    feature: "Доказателства за качество",
    prozona: "Галерия на обекти + ценова листа + статистика",
    benefit: "Клиентът вижда реални снимки и цени предварително – по-голямо доверие.",
  },
  {
    feature: "Ранно предимство",
    prozona: "Първите 200: Premium безплатно 6 месеца + TOP позиция",
    benefit: "Регистрирай се сега и изпревари конкуренцията.",
  },
  {
    feature: "Заявки за клиенти",
    prozona: "Безплатни + до 5 специалиста се свързват директно",
    benefit: "Клиентът получава бързи оферти безплатно.",
  },
]

const infographicSteps = [
  { icon: "📋", label: "Заявка от клиент" },
  { icon: "→", label: "" },
  { icon: "🪙", label: "1 кредит" },
  { icon: "→", label: "" },
  { icon: "📞", label: "Директен контакт" },
  { icon: "→", label: "" },
  { icon: "💼", label: "Работа и доход" },
]

export const metadata = {
  title: "Намери верифициран специалист близо до теб",
  description: "Ремонти, почистване, монтаж и градински услуги на едно място. Безплатна заявка. Верифицирани майстори в целия град.",
}

export default async function Home({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <div className="bg-[#1A1A2E] px-4 py-2 text-center text-white">
        <p className="text-sm">
          🎉 Стартова оферта: 3 месеца Premium безплатно за всички нови специалисти! Първите 200 получават 6 месеца!
          <Link href={`/${locale}/how-it-works`} className="ml-2 font-semibold text-[#1DB954] hover:underline">
            Виж как работи →
          </Link>
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#16162A] to-[#0D0D1A]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1 text-sm text-[#86efac]">
            ProZona.bg
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Намери верифициран специалист
            <span className="block text-[#1DB954]">близо до теб</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-300 md:text-lg">
            Ремонти, почистване, монтаж и градински услуги на едно място.
          </p>

          <div className="flex justify-center">
            <SearchBar locale={locale} />
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Пример: ВиК, почистване, хамали, косене, София
          </div>

          {/* CTA бутони */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/request`}
              className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-8 py-3 font-semibold text-black transition hover:bg-[#1ed760] text-base w-full sm:w-auto"
            >
              🚀 Публикувай безплатна заявка
            </Link>
            <Link
              href={`/${locale}/become-specialist`}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-8 py-3 font-semibold text-white transition hover:bg-white/10 text-base w-full sm:w-auto"
            >
              🔧 Регистрирай се като специалист
            </Link>
          </div>

          {/* Кредитна система badge */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-[#1DB954]/20 bg-[#1DB954]/5 px-6 py-3 text-sm text-gray-300">
            <span className="text-xl">🪙</span>
            <span>
              <strong className="text-white">Плащай само за реални клиенти</strong> – 1 кредит = 1 директен контакт. Без абонамент, без скрити такси!
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">Категории услуги</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/categories/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151528] text-center transition hover:border-[#1DB954]/40 w-48"
            >
              <div
                className="h-32 w-full bg-cover bg-center opacity-80 transition group-hover:opacity-100"
                style={{ backgroundImage: `url(${cat.icon})` }}
              />
              <div className="px-2 py-3">
                <span className="text-sm font-medium text-gray-200">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR CITIES */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <PopularCities locale={locale} />
      </section>

      {/* CTA CARDS */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href={`/${locale}/specialists`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151528] p-8 transition hover:border-[#1DB954]/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954]/10 to-transparent opacity-80 transition group-hover:opacity-100" />
            <div className="relative z-10">
              <span className="mb-3 inline-flex rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#1DB954]">
                За клиенти
              </span>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Провери профили на специалисти в твоя район
              </h3>
              <p className="mb-5 max-w-md text-sm text-gray-300">
                Разгледай верифицирани майстори и услуги близо до теб.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-[#1DB954]">
                Виж специалисти →
              </span>
            </div>
          </Link>

          <Link
            href={`/${locale}/become-specialist`}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151528] p-8 transition hover:border-[#1DB954]/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-80 transition group-hover:opacity-100" />
            <div className="relative z-10">
              <span className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                За специалисти
              </span>
              <h3 className="mb-3 text-2xl font-bold text-white">Стани специалист в ProZona</h3>
              <p className="mb-5 max-w-md text-sm text-gray-300">
                Създай профил и започни да получаваш запитвания от клиенти близо до теб.
              </p>
              <span className="inline-flex items-center text-sm font-medium text-[#1DB954]">
                Създай профил →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ЗАЩО PROZONA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1 text-sm text-[#86efac]">
            Защо ProZona?
          </div>
          <h2 className="mb-3 text-3xl font-bold">Какво ни отличава от другите</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Прозрачна система, реални резултати, нулев риск за специалистите.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#151528]">
                <th className="px-6 py-4 text-left font-semibold text-gray-400">Функция</th>
                <th className="px-6 py-4 text-left font-semibold text-[#1DB954]">✓ ProZona.bg</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-400">Защо е по-добре за теб</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/5 transition hover:bg-[#1DB954]/5 ${
                    i % 2 === 0 ? "bg-[#0D0D1A]" : "bg-[#151528]"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-white">{row.feature}</td>
                  <td className="px-6 py-4 text-[#86efac]">
                    <span className="mr-2 text-[#1DB954]">✓</span>
                    {row.prozona}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{row.benefit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-2xl border border-[#1DB954]/20 bg-[#1DB954]/5 p-8">
          <h3 className="mb-6 text-center text-xl font-bold">🪙 Как работи кредитната система</h3>
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
            {infographicSteps.map((step, i) => (
              step.label ? (
                <div key={i} className="flex flex-col items-center rounded-xl border border-white/10 bg-[#151528] px-4 py-3 text-center min-w-[100px]">
                  <span className="text-2xl">{step.icon}</span>
                  <span className="mt-1 text-xs text-gray-300">{step.label}</span>
                </div>
              ) : (
                <span key={i} className="text-2xl text-[#1DB954] hidden md:block">{step.icon}</span>
              )
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-400">
            Плащаш само когато решиш да се свържеш с клиента. <strong className="text-white">Без абонамент. Без скрити такси.</strong>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/become-specialist`}
            className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-8 py-3 font-semibold text-black transition hover:bg-[#1ed760] text-base"
          >
            Регистрирай се сега и тествай безплатно →
          </Link>
        </div>
      </section>

      {/* BLOG TEASER */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold">Полезно от блога</h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Съвети за ремонт, почистване, монтаж и поддръжка на дома.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="rounded-2xl border border-white/10 bg-[#151528] p-6 transition hover:border-[#1DB954]/40 hover:bg-[#1b1b31]"
            >
              <span className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-gray-200">
                Блог
              </span>
              <h3 className="mb-3 line-clamp-2 text-xl font-bold text-white">{post.title}</h3>
              <p className="mb-4 line-clamp-3 text-sm text-gray-300">{post.excerpt}</p>
              <span className="inline-flex items-center text-sm font-medium text-[#1DB954]">
                Прочети →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href={`/${locale}/blog`} className="font-semibold text-[#1DB954] hover:underline">
            Виж всички статии →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ти си професионалист?</h2>
        <p className="mx-auto mb-10 max-w-2xl text-gray-400">
          Започни да получаваш клиенти още днес чрез ProZona или предложи нова услуга, която все още не присъства в платформата.
        </p>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <Link
            href={`/${locale}/become-specialist`}
            className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760]"
          >
            Регистрирай се като специалист
          </Link>
          <Link
            href={`/${locale}/specialist/suggest-category`}
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 text-white transition hover:bg-white/10"
          >
            Предложи нова услуга
          </Link>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}