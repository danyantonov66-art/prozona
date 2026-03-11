import Link from "next/link"
import ProZonaHeader from "../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../components/footer/ProZonaFooter"
import { blogPosts } from "../../../lib/blog"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Блог на ProZona
          </h1>

          <p className="mx-auto max-w-2xl text-gray-400">
            Практични съвети за ремонт, почистване и услуги за дома.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="rounded-2xl border border-white/10 bg-[#151528] p-6 transition hover:border-[#1DB954]/40"
            >
              <h2 className="mb-3 text-2xl font-bold text-white">
                {post.title}
              </h2>

              <p className="mb-4 text-sm text-gray-300">
                {post.excerpt}
              </p>

              <span className="text-sm font-medium text-[#1DB954]">
                Прочети →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}