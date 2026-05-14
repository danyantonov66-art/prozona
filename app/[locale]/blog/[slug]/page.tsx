import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

const SLUG_TO_USLUGI: Record<string, { service: string; name: string }[]> = {
  // ВиК
  "vik": [{ service: "vik", name: "ВиК майстор" }],
  "vodoprovodchik": [{ service: "vik", name: "ВиК майстор" }],
  "kanalizacia": [{ service: "vik", name: "ВиК майстор" }],
  "trubi": [{ service: "vik", name: "ВиК майстор" }],
  "avaria": [{ service: "vik", name: "ВиК майстор" }],

  // Електро
  "elektrotehnik": [
    { service: "elektrotehnik", name: "Електротехник" },
    { service: "elektro", name: "Електроинсталации" },
  ],
  "elektro": [
    { service: "elektrotehnik", name: "Електротехник" },
    { service: "elektro", name: "Електроинсталации" },
  ],
  "tok": [{ service: "elektrotehnik", name: "Електротехник" }],
  "instalacii": [{ service: "elektro", name: "Електроинсталации" }],

  // Климатик
  "klimatik": [
    { service: "klimatik", name: "Монтаж на климатик" },
    { service: "klimatici", name: "Климатици" },
  ],
  "klimatici": [
    { service: "klimatik", name: "Монтаж на климатик" },
    { service: "klimatici", name: "Климатици" },
  ],
  "freon": [{ service: "klimatik", name: "Монтаж на климатик" }],

  // Почистване
  "pochistvane": [
    { service: "pochistvane", name: "Почистване" },
    { service: "domashno", name: "Домашно почистване" },
  ],
  "pochist": [
    { service: "pochistvane", name: "Почистване" },
    { service: "domashno", name: "Домашно почистване" },
  ],
  "firma": [
    { service: "pochistvane", name: "Почистване" },
    { service: "ofis", name: "Офис почистване" },
  ],
  "ofis": [{ service: "ofis", name: "Офис почистване" }],

  // Хамали
  "hamali": [{ service: "hamali", name: "Хамалски услуги" }],
  "hamal": [{ service: "hamali", name: "Хамалски услуги" }],
  "premestване": [{ service: "hamali", name: "Хамалски услуги" }],
  "premestване": [{ service: "hamali", name: "Хамалски услуги" }],

  // Боядисване / Шпакловка
  "shpaklovka": [
    { service: "shpaklovka", name: "Шпакловка и боя" },
    { service: "boyadisvane", name: "Боядисване" },
  ],
  "boyadisvane": [
    { service: "shpaklovka", name: "Шпакловка и боя" },
    { service: "boyadisvane", name: "Боядисване" },
  ],
  "boya": [
    { service: "shpaklovka", name: "Шпакловка и боя" },
    { service: "boyadisvane", name: "Боядисване" },
  ],
  "boyadisvane": [
    { service: "boyadisvane", name: "Боядисване" },
  ],

  // Ремонт
  "remont": [
    { service: "drebni-remonti", name: "Дребни ремонти" },
    { service: "dovarshitelni-remonti", name: "Довършителни ремонти" },
    { service: "remont-banya-kuhnya", name: "Ремонт на баня и кухня" },
  ],
  "banya": [
    { service: "remont-banya-kuhnya", name: "Ремонт на баня и кухня" },
    { service: "vik", name: "ВиК майстор" },
  ],
  "kuhnya": [
    { service: "remont-banya-kuhnya", name: "Ремонт на баня и кухня" },
  ],
  "dovarshitelni": [
    { service: "dovarshitelni-remonti", name: "Довършителни ремонти" },
  ],
  "drebni": [
    { service: "drebni-remonti", name: "Дребни ремонти" },
  ],

  // Покриви
  "pokrivi": [{ service: "remont-pokrivi", name: "Ремонт на покриви" }],
  "pokriv": [{ service: "remont-pokrivi", name: "Ремонт на покриви" }],

  // Гипсокартон
  "gipsokarton": [{ service: "gipsokarton", name: "Гипсокартон" }],
  "gips": [{ service: "gipsokarton", name: "Гипсокартон" }],

  // Градина
  "gradina": [
    { service: "gradina", name: "Градинарство" },
    { service: "kosene", name: "Косене на трева" },
  ],
  "gradinar": [
    { service: "gradina", name: "Градинарство" },
    { service: "kosene", name: "Косене на трева" },
  ],
  "kosene": [{ service: "kosene", name: "Косене на трева" }],
  "ozelenqvane": [{ service: "gradina", name: "Градинарство" }],

  // Подови настилки
  "podovi": [{ service: "podovi-nastilki", name: "Подови настилки" }],
  "parket": [{ service: "podovi-nastilki", name: "Подови настилки" }],
  "laminat": [{ service: "podovi-nastilki", name: "Подови настилки" }],

  // Авто
  "avto": [
    { service: "avtoserviz", name: "Автосервиз" },
    { service: "gumi", name: "Смяна на гуми" },
  ],
  "kola": [{ service: "avtoserviz", name: "Автосервиз" }],
  "gumi": [{ service: "gumi", name: "Смяна на гуми" }],

  // Мебели
  "mebeli": [
    { service: "sglobqvane-mebeli", name: "Сглобяване на мебели" },
    { service: "remont-mebeli", name: "Ремонт на мебели" },
  ],

  // Общо
  "maystor": [
    { service: "drebni-remonti", name: "Дребни ремонти" },
    { service: "elektrotehnik", name: "Електротехник" },
    { service: "vik", name: "ВиК майстор" },
  ],
  "specialist": [
    { service: "drebni-remonti", name: "Дребни ремонти" },
    { service: "elektrotehnik", name: "Електротехник" },
    { service: "vik", name: "ВиК майстор" },
  ],
}

const TOP_CITIES = ["sofia", "plovdiv", "varna", "burgas", "ruse"]
const CITY_NAMES: Record<string, string> = {
  "sofia": "София",
  "plovdiv": "Пловдив",
  "varna": "Варна",
  "burgas": "Бургас",
  "ruse": "Русе",
}

function getRelatedUslugi(slug: string): { service: string; name: string }[] {
  const parts = slug.split("-")
  for (const part of parts) {
    if (SLUG_TO_USLUGI[part]) return SLUG_TO_USLUGI[part]
  }
  for (const key of Object.keys(SLUG_TO_USLUGI)) {
    if (slug.includes(key)) return SLUG_TO_USLUGI[key]
  }
  return []
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true }
  })
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || post.title
  const canonicalUrl = `https://prozona.bg/bg/blog/${slug}`

  return {
    title: `${title} | ProZona Блог`,
    description,
    alternates: { canonical: canonicalUrl },
    ...(locale !== "bg" && { robots: { index: false, follow: false } }),
    openGraph: {
      title, description, url: canonicalUrl, siteName: "ProZona", type: "article",
      ...(post.coverImage && { images: [{ url: post.coverImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: { card: "summary_large_image", title, description },
  }
}

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { author: { select: { name: true, image: true } } }
  })

  if (!post) notFound()

  const relatedUslugi = getRelatedUslugi(slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    ...(post.coverImage && { image: post.coverImage }),
    datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.author?.name || "ProZona" },
    publisher: { "@type": "Organization", name: "ProZona", url: "https://prozona.bg" },
  }

  const formattedDate = new Date(post.publishedAt || post.createdAt)
    .toLocaleDateString("bg-BG", { year: "numeric", month: "long", day: "numeric" })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white" suppressHydrationWarning>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProZonaHeader locale={locale} />
      <article className="mx-auto max-w-3xl px-4 py-12">

        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/blog`} className="text-[#1DB954] hover:underline">Блог</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{post.title}</span>
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-white/10">
          {post.author?.image && (
            <img src={post.author.image} alt={post.author?.name ?? "ProZona"} className="w-8 h-8 rounded-full" />
          )}
          <span>{post.author?.name ?? "ProZona"}</span>
          <span>·</span>
          <span suppressHydrationWarning>{formattedDate}</span>
        </div>

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-8
            prose-a:text-[#1DB954] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:my-1
            prose-blockquote:border-[#1DB954] prose-blockquote:text-gray-400
            prose-code:bg-[#1A1A2E] prose-code:text-[#1DB954] prose-code:px-1 prose-code:rounded
            prose-hr:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {relatedUslugi.length > 0 && (
          <div className="mt-10 p-6 bg-[#151528] border border-white/10 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              🔧 Намери специалист по темата
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedUslugi.map(({ service, name }) =>
                TOP_CITIES.map((city) => (
                  <Link
                    key={`${service}-${city}`}
                    href={`/${locale}/uslugi/${city}/${service}`}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-[#1DB954]/40 hover:text-[#1DB954] transition"
                  >
                    {name} в {CITY_NAMES[city]}
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-[#151528] border border-[#1DB954]/20 rounded-2xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">Търсиш специалист?</h3>
          <p className="text-gray-400 mb-4">
            Намери проверен майстор близо до теб — безплатно и без регистрация.
          </p>
          <Link
            href={`/${locale}/search`}
            className="inline-block bg-[#1DB954] text-[#0D0D1A] font-bold px-8 py-3 rounded-xl hover:bg-[#17a847] transition-colors"
          >
            Намери специалист →
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-2 text-[#1DB954] hover:underline">
            ← Обратно към блога
          </Link>
        </div>

      </article>
      <ProZonaFooter locale={locale} />
    </main>
  )
}
