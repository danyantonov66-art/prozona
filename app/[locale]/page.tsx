import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import Hero from "@/components/hero"

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

      {/* Top info bar */}
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

      {/* Hero section */}
      <Hero />

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Популярни категории
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

          <Link
            href={`/${locale}/categories/stroitelstvo`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition"
          >
            🏗️ Строителство
          </Link>

          <Link
            href={`/${locale}/categories/remonti`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition"
          >
            🔧 Ремонти
          </Link>

          <Link
            href={`/${locale}/categories/fotografiya`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition"
          >
            📸 Фотография
          </Link>

          <Link
            href={`/${locale}/categories/transport`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition"
          >
            🚚 Транспорт
          </Link>

          <Link
            href={`/${locale}/categories/beauty`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition"
          >
            💄 Красота
          </Link>

          <Link
            href={`/${locale}/categories/it`}
            className="bg-[#1A1A2E] p-6 rounded-xl hover:bg-[#25253a] transition"
          >
            💻 IT услуги
          </Link>

        </div>
      </section>

      <ProZonaFooter />

    </main>
  )
}