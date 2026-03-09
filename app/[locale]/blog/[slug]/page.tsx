import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { blogPosts, getPostBySlug } from "@/lib/blog"

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: "Статията не е намерена | ProZona" }
  }

  return {
    title: `${post.title} | ProZona`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <article className="mx-auto max-w-4xl px-4 py-16">
        <Link
          href={`/${locale}/blog`}
          className="text-sm text-[#1DB954] hover:underline"
        >
          ← Обратно към блога
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#151528] p-8">
          <h1 className="mb-6 text-4xl font-bold">
            {post.title}
          </h1>

          <p className="mb-8 text-gray-300">
            {post.excerpt}
          </p>

          <div className="space-y-6 text-gray-200">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <ProZonaFooter />
    </main>
  )
}