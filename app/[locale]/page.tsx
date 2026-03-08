import SearchBar from "@/components/SearchBar"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function Home({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <div className="bg-[#1A1A2E] px-4 py-2 text-center text-white">
        <p className="text-sm">
          Стартов период: до 20 безплатни специалисти в категория.
          <Link
            href={`/${locale}/how-it-works`}
            className="ml-2 font-semibold text-[#1DB954] hover:underline"
          >
            Виж как работи →
          </Link>
        </p>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#16162A] to-[#0D0D1A]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1 text-sm text-[#86efac]">
            ProZona.bg
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Намери специалист
            <span className="block text-[#1DB954]">за всяка услуга</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-gray-300 md:text-lg">
            Строителство, ремонти, авто услуги, красота, почистване,
            климатична техника и още много категории на едно място.
          </p>

          <div className="flex justify-center">
            <SearchBar locale={locale} />
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Пример: строителство, климатици, София, Видин, красота
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">
          Популярни категории
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            href={`/${locale}/categories/stroitelstvo-i-remonti`}
            className="rounded-xl bg-[#1A1A2E] p-6 text-center transition hover:bg-[#25253a]"
          >
            🏗 Строителство и ремонти
          </Link>

          <Link
            href={`/${locale}/categories/avto-uslugi-i-transport`}
            className="rounded-xl bg-[#1A1A2E] p-6 text-center transition hover:bg-[#25253a]"
          >
            🚗 Авто услуги и транспорт
          </Link>

          <Link
            href={`/${locale}/categories/krasota-i-grizha`}
            className="rounded-xl bg-[#1A1A2E] p-6 text-center transition hover:bg-[#25253a]"
          >
            💄 Красота и грижа
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/categories`}
            className="font-semibold text-[#1DB954] hover:underline"
          >
            Всички категории →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          Ти си професионалист?
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-gray-400">
          Започни да получаваш клиенти още днес чрез ProZona или предложи нова услуга,
          която все още не присъства в платформата.
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

      <ProZonaFooter />
    </main>
  )
}