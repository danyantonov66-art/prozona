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

export default async function Home({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <div className="bg-[#1A1A2E] px-4 py-2 text-center text-white">
        <p className="text-sm">
          Регистрацията е безплатна — намери майстор или стани специалист. Безплатният план е завинаги!
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

          {/* CTA за клиенти */}
          <div className="mt-6">
            <Link
              href={`/${locale}/request`}
              className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-8 py-3 font-semibold text-black transition hover:bg-[#1ed760] text-base"
            >
              🚀 Публикувай безплатна заявка
            </Link>
            <p className="mt-2 text-xs text-gray-500">До 5 специалисти ще се свържат с теб. Безплатно.</p>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Платформата стартира през 2026 и изгражда мрежа от специалисти в България.
          </p>
        </div>
      </section>

      {/* EARLY SPECIALIST PROGRAM */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="relative overflow-hidden rounded-2xl border border-[#1DB954]/20 bg-gradient-to-r from-[#1DB954]/10 to-[#151528] p-8">
          <div className="absolute right-6 top-6 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-3 py-1 text-xs font-semibold text-[#1DB954]">
            Ограничено
          </div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1DB954]">
            Early Specialist Program
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
            Първите 200 специалисти получават:
          </h2>

          <p className="mb-6 text-sm text-gray-400">
            Регистрирай се сега и се възползвай от предимствата на ранната програма.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#0D0D1A]/60 p-4">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-semibold text-white">Premium профил</p>
                <p className="text-sm text-gray-400">Безплатно за 6 месеца</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#0D0D1A]/60 p-4">
              <span className="text-2xl">🔝</span>
              <div>
                <p className="font-semibold text-white">По-висока позиция</p>
                <p className="text-sm text-gray-400">В резултатите от търсенето</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#0D0D1A]/60 p-4">
              <span className="text-2xl">📩</span>
              <div>
                <p className="font-semibold text-white">Ранни заявки</p>
                <p className="text-sm text-gray-400">От клиенти преди останалите</p>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/become-specialist`}
            className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760]"
          >
            Присъедини се сега →
          </Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-3 text-center text-3xl font-bold">Популярни категории</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
          Избери услуга и разгледай верифицирани специалисти близо до теб.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/categories/${category.slug}`}
              className="group relative h-64 overflow-hidden rounded-2xl border border-white/10"
            >
              <img
                src={category.icon}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              <div className="relative z-10 flex h-full flex-col justify-end p-5">
                <span className="mb-3 inline-flex w-fit rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#86efac]">
                  Категория
                </span>
                <h3 className="mb-2 text-xl font-bold text-white">{category.name}</h3>
                <p className="line-clamp-2 text-sm text-gray-200">{category.description}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-[#1DB954]">
                  Разгледай →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <PopularCities locale={locale} />

        <div className="mt-8 text-center">
          <Link href={`/${locale}/categories`} className="font-semibold text-[#1DB954] hover:underline">
            Всички категории →
          </Link>
        </div>
      </section>

      {/* BANNERS */}
      <section className="mx-auto max-w-6xl px-4 py-6">
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