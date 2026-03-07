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

      <div className="bg-[#1A1A2E] text-white text-center py-2 px-4">
        <p className="text-sm">
          Стартов период: до 20 безплатни специалисти в категория.
          <Link
            href={`/${locale}/how-it-works`}
            className="ml-2 text-[#1DB954] font-semibold hover:underline"
          >
            Виж как работи →
          </Link>
        </p>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#16162A] to-[#0D0D1A]" />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1 text-sm text-[#86efac] mb-6">
            ProZona.bg
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Намери специалист
            <span className="block text-[#1DB954]">за всяка услуга</span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-300 text-base md:text-lg mb-8">
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

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Популярни категории
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href={`/${locale}/categories/stroitelstvo`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition text-center"
          >
            🏗 Строителство и ремонти
          </Link>

          <Link
            href={`/${locale}/categories/auto-transport`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition text-center"
          >
            🚗 Авто услуги и транспорт
          </Link>

          <Link
            href={`/${locale}/categories/krasota`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition text-center"
          >
            💄 Красота и грижа
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${locale}/categories`}
            className="text-[#1DB954] font-semibold hover:underline"
          >
            Всички категории →
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ти си професионалист?
        </h2>

        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Започни да получаваш клиенти още днес чрез ProZona или предложи нова услуга,
          която все още не присъства в платформата.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href={`/${locale}/become-specialist`}
            className="inline-flex items-center justify-center bg-[#1DB954] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#1ed760] transition"
          >
            Регистрирай се като специалист
          </Link>

          <Link
            href={`/${locale}/specialist/suggest-category`}
            className="inline-flex items-center justify-center border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition"
          >
            Предложи нова услуга
          </Link>
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}