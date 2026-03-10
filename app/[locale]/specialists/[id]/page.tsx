import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function SpecialistPage({ params }: Props) {
  const { id, locale } = await params

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

  if (!specialist) return notFound()

  const displayName = specialist.businessName || specialist.user?.name || "Специалист"
  const initials = displayName.charAt(0).toUpperCase()

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: displayName,
    description: specialist.description || "",
    url: `https://prozona.bg/${locale}/specialists/${specialist.id}`,
    telephone: specialist.phone || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: specialist.city || "",
      addressCountry: "BG",
    },
    areaServed: {
      "@type": "City",
      name: specialist.city || "",
    },
    serviceType:
      specialist.SpecialistCategory?.map(
        (item) => item.Subcategory?.name || item.Category?.name
      ).filter(Boolean) || [],
    provider: {
      "@type": "Person",
      name: specialist.user?.name || specialist.businessName || "Специалист",
    },
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <Link
          href={`/${locale}/specialists`}
          className="mb-8 inline-flex items-center text-sm font-medium text-[#1DB954] hover:underline"
        >
          ← Назад към специалистите
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#151528] p-8 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-shrink-0">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#23233A] text-5xl font-bold text-[#1DB954]">
                {initials}
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold md:text-5xl">{displayName}</h1>

              {specialist.city && (
                <p className="mt-2 text-lg text-gray-300">{specialist.city}</p>
              )}

              {specialist.SpecialistCategory?.[0] && (
                <div className="mt-4">
                  <span className="inline-flex rounded-full bg-[#1DB954]/15 px-4 py-2 text-sm font-medium text-[#22c55e]">
                    {specialist.SpecialistCategory[0].Subcategory?.name ||
                      specialist.SpecialistCategory[0].Category?.name}
                  </span>
                </div>
              )}

              <div className="mt-6 text-yellow-400">★ Няма рейтинг</div>

              <div className="mt-10">
                <h2 className="mb-4 text-3xl font-bold">Описание</h2>
                <p className="max-w-3xl whitespace-pre-line text-lg leading-8 text-gray-200">
                  {specialist.description || "Няма добавено описание."}
                </p>
              </div>

              <div className="mt-10">
                <h2 className="mb-4 text-3xl font-bold">Контакт</h2>
                <div className="space-y-3 text-xl text-gray-200">
                  {specialist.phone ? (
                    <p>{specialist.phone}</p>
                  ) : (
                    <p className="text-gray-400">Няма добавен телефон.</p>
                  )}
                </div>
              </div>

              {specialist.SpecialistCategory?.length > 0 && (
                <div className="mt-10">
                  <h2 className="mb-4 text-3xl font-bold">Услуги</h2>

                  <ul className="space-y-3 text-lg text-gray-200">
                    {specialist.SpecialistCategory.map((item) => (
                      <li key={item.id}>
                        • {item.Category?.name}
                        {item.Subcategory?.name ? ` • ${item.Subcategory.name}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10">
                <button className="rounded-xl bg-[#1DB954] px-8 py-4 font-semibold text-white transition hover:bg-[#169c45]">
                  Остави отзив
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}