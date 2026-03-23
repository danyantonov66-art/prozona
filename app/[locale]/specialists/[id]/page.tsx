import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import InquiryButton from "@/components/InquiryButton"
import ReviewList from "@/components/reviews/ReviewList"
import TrackViewContent from "@/components/tracking/TrackViewContent"

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, id } = await params
  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!specialist) return {}

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const city = specialist.city || ""
  const description = specialist.description?.slice(0, 160) || `${name} — верифициран специалист в ProZona.`
  const image = specialist.user?.image || null
  const canonicalUrl = `https://prozona.bg/${locale}/specialists/${id}`

  // Build keyword-rich title e.g. "Иван Петров — ремонт на колани, София | ProZona"
  const titleCity = city ? `, ${city}` : ""
  const title = `${name}${titleCity} | ProZona`

  return {
    title,
    description,
    keywords: [
      name,
      city,
      "специалист",
      "ProZona",
      specialist.description?.split(" ").slice(0, 5).join(" ") || "",
    ]
      .filter(Boolean)
      .join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ProZona",
      locale: locale === "bg" ? "bg_BG" : "en_US",
      type: "profile",
      ...(image && {
        images: [
          {
            url: image,
            width: 800,
            height: 600,
            alt: name,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}

export const dynamic = "force-dynamic"

export default async function SpecialistPage({ params }: Props) {
  const { locale, id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      GalleryImage: true,
      reviews: {
        include: { User: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      PriceListItem: true,
    },
  })

  if (!specialist) notFound()

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const image = specialist.user?.image || null
  const avgRating =
    specialist.reviews.length > 0
      ? specialist.reviews.reduce((sum, r) => sum + r.rating, 0) / specialist.reviews.length
      : null

  const canonicalUrl = `https://prozona.bg/${locale}/specialists/${id}`

  // JSON-LD structured data — tells Google this is a LocalBusiness / Person
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url: canonicalUrl,
    ...(image && { image }),
    ...(specialist.city && {
      address: {
        "@type": "PostalAddress",
        addressLocality: specialist.city,
        addressCountry: "BG",
      },
    }),
    ...(specialist.description && { description: specialist.description }),
    ...(avgRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: specialist.reviews.length,
      },
    }),
    ...(specialist.reviews.length > 0 && {
      review: specialist.reviews.map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
        },
        datePublished: r.createdAt.toISOString().split("T")[0],
        reviewBody: r.comment,
      })),
    }),
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      {/* JSON-LD injected into <head> via script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProZonaHeader locale={locale} />
      <TrackViewContent name={name} />
      <section className="mx-auto max-w-5xl px-4 py-10">

        {/* Breadcrumb */}
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
                    <span className="font-semibold text-white">📍 Град:</span>{" "}
                    {specialist.city}
                  </p>
                )}

                {specialist.experienceYears && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">⏳ Опит:</span>{" "}
                    {specialist.experienceYears} години
                  </p>
                )}

                {specialist.serviceAreas && specialist.serviceAreas.length > 0 && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">🗺️ Обслужва:</span>{" "}
                    {specialist.serviceAreas.join(", ")}
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

          {/* Галерия */}
          {specialist.GalleryImage.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">Галерия</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {specialist.GalleryImage.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt={`${name} — галерия`}
                    className="h-32 w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ценова листа */}
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

          {/* Отзиви */}
          <div className="border-t border-white/10 p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold">Отзиви</h2>
            <ReviewList
              reviews={specialist.reviews as any}
              specialistId={specialist.id}
              specialistUserId={specialist.userId}
            />
            <div className="mt-6">
              <Link
                href={`/${locale}/specialist/${specialist.id}/review`}
                className="inline-block rounded-xl bg-[#1DB954] px-6 py-3 text-sm font-semibold text-white hover:bg-[#169b43] transition-colors"
              >
                ✍️ Напиши отзив
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}