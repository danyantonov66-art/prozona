import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      subcategories: {
        orderBy: { name: 'asc' },
      },
    },
  })

  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            ← Назад
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-3">{category.name}</h1>

        {category.description && (
          <p className="text-gray-400 mb-8">{category.description}</p>
        )}

        {category.subcategories.length === 0 ? (
          <div className="text-gray-400">Няма добавени подкатегории.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.subcategories.map((subcategory) => (
              <Link
                key={subcategory.id}
                href={`/${locale}/categories/${category.slug}/${subcategory.slug}`}
                className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-5 hover:border-[#1DB954] hover:bg-[#20203A] transition"
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  {subcategory.name}
                </h2>

                {subcategory.description && (
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {subcategory.description}
                  </p>
                )}

                <div className="mt-4 text-[#1DB954] text-sm">
                  Разгледай →
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}