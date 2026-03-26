import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import InquiryButton from "@/components/InquiryButton"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!specialist) {
    return { title: "Специалист не е намерен" }
  }

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const city = specialist.city || "България"
  const description = specialist.description
    ? `${specialist.description.slice(0, 150)}...`
    : `${name} – верифициран специалист в ${city}. Намери го на ProZona.bg`

  return {
    title: `${name} – специалист в ${city}`,
    description,
    openGraph: {
      title: `${name} – специалист в ${city} | ProZona`,
      description,
      url: `https://www.prozona.bg/bg/specialist/${id}`,
      siteName: "ProZona",
      images: specialist.user?.image
        ? [{ url: specialist.user.image }]
        : [{ url: "https://www.prozona.bg/og-image.png" }],
    },
  }
}

export default async function SpecialistPage({ params }: Props) {
  const { locale, id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      GalleryImage: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      PriceListItem: true,
    },
  })

  if (!specialist) notFound()

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const image = specialist.user?.image || null
  const avgRating = specialist.reviews.length > 0
    ? specialist.reviews.reduce((sum, r) => sum + r.rating, 0) / specialist.reviews.length
    : null

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/specialists`} className="text-[#1DB954] hover:underline">Специалисти</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{name}</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151528]">
          <div className="p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[320px_1fr]">
              <div>
                {image ? (
                  <img src={image} alt={name} className="h-72 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-[#23233A] text-6xl font-bold text-[#1DB954]">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                {avgRating && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0D0D1A] px-4 py-3">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-400">({specialist.reviews.length} отзива)</span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="mb-4 text-3xl font-bold">{name}</h1>
                {specialist.city && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">📍 Град:</span> {specialist.city}
                  </p>
                )}
                {specialist.experienceYears && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">⏳ Опит:</span> {specialist.experienceYears} години
                  </p>
                )}
                {specialist.serviceAreas && specialist.serviceAreas.length > 0 && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">🗺️ Обслужва:</span> {specialist.serviceAreas.join(", ")}
                  </p>
                )}
                <InquiryButton specialistId={specialist.id} specialistName={name} />
                <div className="mt-6">
                  <h2 className="mb-3 text-xl font-semibold">Описание</h2>
                  <p className="leading-7 text-gray-300">
                    {specialist.description || "Няма добавено описание."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {specialist.GalleryImage.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">Галерия</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {specialist.GalleryImage.map((img) => (
                  <img key={img.id} src={img.imageUrl} alt="Галерия" className="h-32 w-full rounded-xl object-cover" />
                ))}
              </div>
            </div>
          )}

          {specialist.PriceListItem.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">Ценова листа</h2>
              <div className="space-y-2">
                {specialist.PriceListItem.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                    <span className="text-gray-300">{item.name}</span>
                    <span className="font-semibold text-[#1DB954]">{item.price} лв.</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {specialist.reviews.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">Отзиви</h2>
              <div className="space-y-4">
                {specialist.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-yellow-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                      <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString("bg-BG")}</span>
                    </div>
                    <p className="text-sm text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}