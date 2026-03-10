import Link from "next/link"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function SpecialistProfile({ params }: Props) {
  const { locale, id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
        },
      },
    },
  })

  if (!specialist) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white">
        <ProZonaHeader locale={locale} />

        <section className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">Специалистът не е намерен</h1>
        </section>

        <ProZonaFooter locale={locale} />
      </main>
    )
  }

  const displayName =
    specialist.businessName || specialist.user?.name || "Специалист"

  const categories = specialist.SpecialistCategory

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>

          <span className="mx-2">/</span>

          <Link
            href={`/${locale}/specialists`}
            className="text-[#1DB954] hover:underline"
          >
            Специалисти
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white">{displayName}</span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#151528] p-8">
          <h1 className="mb-4 text-4xl font-bold">{displayName}</h1>

          {specialist.city && (
            <p className="mb-6 text-gray-400">{specialist.city}</p>
          )}

          {categories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-3">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full bg-[#1DB954]/20 px-3 py-1 text-sm text-[#86efac]"
                >
                  {c.Category?.name}
                  {c.Subcategory ? ` • ${c.Subcategory.name}` : ""}
                </span>
              ))}
            </div>
          )}

          {specialist.description && (
            <p className="mb-8 text-gray-300 leading-relaxed">
              {specialist.description}
            </p>
          )}

          {specialist.phone && (
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${specialist.phone}`}
                className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black hover:bg-[#1ed760]"
              >
                Обади се
              </a>

              <Link
                href={`/${locale}/categories`}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3 hover:bg-white/10"
              >
                Още специалисти
              </Link>
            </div>
          )}
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}