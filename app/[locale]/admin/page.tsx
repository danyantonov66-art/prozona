import ProZonaHeader from "../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Админ панел</h1>

        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
          <p className="text-gray-300">
            Временна версия на админ панела за стабилен build.
          </p>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}