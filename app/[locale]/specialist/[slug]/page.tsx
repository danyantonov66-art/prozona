import { prisma } from "@/lib/prisma"
import { notFound, permanentRedirect } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import InquiryButton from "@/components/InquiryButton"
import ReviewList from "@/components/reviews/ReviewList"
import TrackViewContent from "@/components/tracking/TrackViewContent"
import ShareButton from "@/components/ShareButton"
import ExitIntentPopup from "@/components/ExitIntentPopup"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

async function getSpecialist(slug: string) {
  let specialist = await prisma.specialist.findUnique({
    where: { slug },
    include: {
      user: true,
      GalleryImage: true,
      reviews: {
        include: { User: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      PriceListItem: true,
      SpecialistCategory: {
        include: { Category: true, Subcategory: true },
      },
    },
  })

  // Ако не намери по slug — опитай по ID (стар URL)
  if (!specialist) {
    specialist = await prisma.specialist.findUnique({
      where: { id: slug },
      include: {
        user: true,
        GalleryImage: true,
        reviews: {
          include: { User: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        PriceListItem: true,
        SpecialistCategory: {
          include: { Category: true, Subcategory: true },
        },
      },
    })
  }

  return specialist
}

function getYoutubeEmbedUrl(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[7].length === 11 ? match[7] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

function getTikTokEmbedUrl(url: string): string | null {
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/)
  return match ? `https://www.tiktok.com/embed/${match[1]}` : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const specialist = await prisma.specialist.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: {
      user: true,
      _count: { select: { SpecialistCategory: true, GalleryImage: true } },
    },
  })

  if (!specialist) return { title: "Специалист не е намерен | ProZona" }

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const city = specialist.city || "България"
  const canonicalSlug = specialist.slug || slug
  const canonicalUrl = `https://prozona.bg/bg/specialist/${canonicalSlug}`

  const hasDescription = !!specialist.description &&
    specialist.description.trim().length >= 20 &&
    !specialist.description.includes("предстои да бъде попълнен")
  const hasCategories = specialist._count.SpecialistCategory > 0
  const hasPhotos = specialist._count.GalleryImage > 0

  // Тънко съдържание — нов/непопълнен профил без описание, услуги или снимки.
  // noindex докато специалистът не попълни поне едно от тях, за да не трупаме
  // тънки страници в индекса.
  const isThin = !hasDescription && !hasCategories && !hasPhotos

  if (isThin) {
    return {
      title: `${name} | ProZona`,
      robots: { index: false, follow: false },
    }
  }

  const description = specialist.description
    ? `${specialist.description.slice(0, 150)}...`
    : `${name} — верифициран специалист в ${city}. Намери го на ProZona.bg`

  return {
    title: `${name} — специалист в ${city} | ProZona`,
    description,
    keywords: [name, city, "специалист", "ProZona"].filter(Boolean).join(", "),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${name} — специалист в ${city} | ProZona`,
      description,
      url: canonicalUrl,
      siteName: "ProZona",
      type: "profile",
      images: specialist.user?.image
        ? [{ url: specialist.user.image }]
        : [{ url: "https://prozona.bg/og-image.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — специалист в ${city}`,
      description,
      ...(specialist.user?.image && { images: [specialist.user.image] }),
    },
  }
}

export default async function SpecialistPage({ params }: Props) {
  const { locale, slug } = await params

  const specialist = await getSpecialist(slug)

  if (!specialist) notFound()

  // Ако е достъпен по ID (стар URL) — permanent redirect към slug
  if (specialist.slug && specialist.slug !== slug) {
    permanentRedirect(`/${locale}/specialist/${specialist.slug}`)
  }

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const image = specialist.user?.image || null
  const canonicalUrl = `https://prozona.bg/bg/specialist/${specialist.slug || slug}`
  const avgRating = specialist.reviews.length > 0
    ? specialist.reviews.reduce((sum, r) => sum + r.rating, 0) / specialist.reviews.length
    : null

  const videoUrl = (specialist as any).videoUrl as string | null
  const isYoutube = videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"))
  const isTikTok = videoUrl && videoUrl.includes("tiktok.com")
  const embedUrl = isYoutube
    ? getYoutubeEmbedUrl(videoUrl!)
    : isTikTok
    ? getTikTokEmbedUrl(videoUrl!)
    : null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url: canonicalUrl,
    ...(image && { image }),
    ...(specialist.city && { address: { "@type": "PostalAddress", addressLocality: specialist.city, addressCountry: "BG" } }),
    ...(specialist.description && { description: specialist.description }),
    ...(avgRating && { aggregateRating: { "@type": "AggregateRating", ratingValue: avgRating.toFixed(1), reviewCount: specialist.reviews.length } }),
    ...(specialist.reviews.length > 0 && {
      review: specialist.reviews.map((r) => ({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: r.rating },
        datePublished: r.createdAt.toISOString().split("T")[0],
        reviewBody: r.comment,
      })),
    }),
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProZonaHeader locale={locale} />
      <TrackViewContent name={name} />
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

                {specialist.SpecialistCategory && specialist.SpecialistCategory.length > 0 && (
                  <div className="mt-3 mb-2">
                    <span className="font-semibold text-white text-sm">🔧 Услуги: </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {specialist.SpecialistCategory.map((sc: any) => (
                        <span
                          key={sc.id}
                          className="rounded-full bg-[#1DB954]/10 px-3 py-1 text-xs text-[#1DB954] border border-[#1DB954]/20"
                        >
                          {sc.Category?.name}
                          {sc.Subcategory ? ` › ${sc.Subcategory.name}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4">
                  <InquiryButton specialistId={specialist.id} specialistName={name} />
                  <ShareButton url={canonicalUrl} title={`${name} — специалист в ProZona`} />
                </div>
                <div className="mt-6">
                  <h2 className="mb-3 text-xl font-semibold">Описание</h2>
                  <p className="leading-7 text-gray-300">
                    {specialist.description || "Няма добавено описание."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {embedUrl && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">🎥 Видео</h2>
              <div className={`overflow-hidden rounded-2xl ${isTikTok ? "max-w-sm mx-auto" : "aspect-video"}`}>
                <iframe
                  src={embedUrl}
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`${name} — видео`}
                  {...(isTikTok && { style: { minHeight: "500px" } })}
                />
              </div>
            </div>
          )}

          {specialist.GalleryImage.length > 0 && (
            <div className="border-t border-white/10 p-6 md:p-8">
              <h2 className="mb-4 text-xl font-semibold">Галерия</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {specialist.GalleryImage.map((img) => (
                  <img key={img.id} src={img.imageUrl} alt={`${name} — галерия`}
                    className="h-32 w-full rounded-xl object-cover" />
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

          <div className="border-t border-white/10 p-6 md:p-8">
            <h2 className="mb-4 text-xl font-semibold">Отзиви</h2>
            <ReviewList
              reviews={specialist.reviews as any}
              specialistId={specialist.id}
              specialistUserId={specialist.userId}
            />
            <div className="mt-6">
              <Link
                href={`/${locale}/specialist/${specialist.slug || specialist.id}/review`}
                className="inline-block rounded-xl bg-[#1DB954] px-6 py-3 text-sm font-semibold text-white hover:bg-[#169b43] transition-colors"
              >
                ✏️ Напиши отзив
              </Link>
            </div>
          </div>
        </div>
      </section>
      <ProZonaFooter locale={locale} />
      <ExitIntentPopup
        specialistId={specialist.id}
        specialistName={specialist.businessName || specialist.user?.name || "специалиста"}
        locale={locale}
      />
    </main>
  )
}
