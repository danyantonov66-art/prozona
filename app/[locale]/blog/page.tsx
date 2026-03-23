import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata() {
  return {
    title: "Блог — съвети и ръководства | ProZona",
    description: "Полезни статии за специалисти и клиенти — съвети, ръководства и новини от ProZona.",
    alternates: { canonical: "https://prozona.bg/bg/blog" },
  }
}

export const dynamic = "force-dynamic"

export default async function BlogPage({ params }: Props) {
  const { locale } = await params

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, slug: true, title: true, excerpt: true,
      coverImage: true, publishedAt: true, createdAt: true,
      author: { select: { name: true } }
    }
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-12">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">📝 Блог</h1>
          <p className="text-gray-400 text-lg">Съвети, ръководства и полезна информация за специалисти и клиенти</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Все още няма публикувани статии.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group rounded-2xl border border-white/10 bg-[#151528] overflow-hidden hover:border-[#1DB954]/40 transition-all"
              >
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-48 bg-[#23233A] flex items-center justify-center text-4xl">
                    📝
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#1DB954] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.author?.name || 'ProZona'}</span>
                    <span>
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('bg-BG')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}