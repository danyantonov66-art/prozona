import Link from 'next/link'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Как работи ProZona?</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Свързваме клиенти с проверени специалисти в цяла България — бързо, лесно и безплатно.
        </p>
      </section>

      {/* За клиенти */}
      <section className="py-16 px-4 bg-[#0D0D1A]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-[#1DB954] font-semibold uppercase tracking-wider text-sm">За клиенти</span>
            <h2 className="text-3xl font-bold mt-2">Намери специалист за минути</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Търси', desc: 'Избери категория и град — виж всички налични специалисти в твоя район.' },
              { n: '2', title: 'Свържи се', desc: 'Изпрати безплатно запитване директно до специалиста.' },
              { n: '3', title: 'Остави отзив', desc: 'След завършена работа помогни на другите с твоя опит.' },
            ].map((s) => (
              <div key={s.n} className="bg-[#1A1A2E] rounded-2xl p-8 text-center border border-white/5">
                <div className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-white text-xl font-bold">{s.n}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={`/${locale}/categories`} className="inline-block px-8 py-3 bg-[#1DB954] text-white rounded-xl hover:bg-[#169b43] font-semibold">
              Намери специалист
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* За специалисти */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-[#1DB954] font-semibold uppercase tracking-wider text-sm">За специалисти</span>
            <h2 className="text-3xl font-bold mt-2">Намирай клиенти лесно</h2>
            <p className="text-gray-400 mt-3">Регистрацията е безплатна — започни да получаваш запитвания още днес.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', title: 'Регистрирай се', desc: 'Създай профил безплатно за 5 минути. Добави снимки, описание и категория.' },
              { n: '2', title: 'Получавай запитвания', desc: 'Клиенти от твоя град ще те намират и изпращат запитвания директно.' },
              { n: '3', title: 'Развивай бизнеса си', desc: 'Събирай отзиви, изграждай репутация и привличай повече клиенти.' },
            ].map((s) => (
              <div key={s.n} className="bg-[#1A1A2E] rounded-2xl p-8 text-center border border-white/5">
                <div className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-white text-xl font-bold">{s.n}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={`/${locale}/register`} className="inline-block px-8 py-3 bg-[#1DB954] text-white rounded-xl hover:bg-[#169b43] font-semibold">
              Стани специалист безплатно
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16 px-4 bg-[#1A1A2E]">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Готов ли си?</h2>
          <p className="text-gray-400 mb-8">Намери майстор или стани специалист — безплатно.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/categories`} className="px-8 py-3 bg-[#1DB954] text-white rounded-xl hover:bg-[#169b43] font-semibold">
              Намери специалист
            </Link>
            <Link href={`/${locale}/register`} className="px-8 py-3 border border-[#1DB954] text-[#1DB954] rounded-xl hover:bg-[#1DB954]/10 font-semibold">
              Регистрирай се като специалист
            </Link>
          </div>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}