import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true }
  })
  if (!post) return {}

  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || post.title
  const canonicalUrl = `https://prozona.bg/${locale}/blog/${slug}`

  return {
    title: `${title} | ProZona Блог`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title, description, url: canonicalUrl, siteName: 'ProZona', type: 'article',
      ...(post.coverImage && { images: [{ url: post.coverImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: { card: 'summary_large_image', title, description },
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

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProZonaHeader locale={locale} />
      <article className="mx-auto max-w-3xl px-4 py-12">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/blog`} className="text-[#1DB954] hover:underline">Блог</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{post.title}</span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-white/10">
          {post.author?.image && (
            <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full" />
          )}
          <span>{post.author?.name || 'ProZona'}</span>
          <span>·</span>
          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Content */}
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

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-[#1DB954] hover:underline"
          >
            ← Обратно към блога
          </Link>
        </div>
      </article>
      <ProZonaFooter locale={locale} />
    </main>
  )
}