import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params

  const categories = [
    {
      title: "Строителство и ремонт",
      desc: "Майстори за всякакви ремонти",
      href: `/${locale}/categories/stroitelstvo`,
    },
    {
      title: "Авто услуги и транспорт",
      desc: "Автосервизи, гуми, транспорт",
      href: `/${locale}/categories/auto-transport`,
    },
    {
      title: "Красота и грижа",
      desc: "Фризьори, козметика, маникюр",
      href: `/${locale}/categories/krasota`,
    },
  ]

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Категории услуги
        </h1>
        <p className="text-center text-white/70 mt-4">
          Избери категория и намери най-добрия специалист
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {categories.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group bg-[#151528] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition"
            >
              <div className="p-8">
                <h2 className="text-2xl font-semibold">{c.title}</h2>
                <p className="text-white/70 mt-2">{c.desc}</p>
                <div className="mt-6 text-[#1DB954] font-semibold">
                  Виж услугите →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-[#151528] rounded-2xl p-10 text-center border border-white/5">
          <h3 className="text-2xl font-bold">Не намираш своята специалност?</h3>
          <p className="text-white/70 mt-2">
            Предложи нова категория и ние ще я разгледаме
          </p>
          <Link
            href={`/${locale}/add-service`}
            className="inline-block mt-6 bg-[#1DB954] text-black font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition"
          >
            Предложи категория
          </Link>
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}