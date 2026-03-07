import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { categories } from '@/lib/constants'

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params

  const category = categories.find(c => c.id === slug)
  if (!category) notFound()

  const specialists = await prisma.specialist.findMany({
    where: { categoryId: slug, isApproved: true },
    include: { user: true },
    orderBy: { rating: 'desc' },
    take: 6,
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">
            ← Всички категории
          </Link>
        </div>
      </header>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">{category.icon} {category.name}</h1>
        <p className="text-gray-400 mb-10">{category.description}</p>

        <h2 className="text-2xl font-semibold mb-6">Подкатегории</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {category.subcategories.map((sub) => (
            <Link key={sub.id} href={`/${locale}/categories/${slug}/${sub.id}`}
              className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-5 hover:border-[#1DB954] transition">
              <div className="text-3xl mb-2">{sub.icon}</div>
              <h3 className="text-lg font-semibold">{sub.name}</h3>
            </Link>
          ))}
        </div>

        {specialists.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-6">Специалисти</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {specialists.map((specialist) => (
                <Link key={specialist.id} href={`/${locale}/specialist/${specialist.id}`}
                  className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-5 hover:border-[#1DB954] transition">
                  <h3 className="text-xl font-semibold mb-2">
                    {specialist.businessName || specialist.user?.name || 'Специалист'}
                  </h3>
                  <p className="text-sm text-gray-400">{specialist.city || 'Без посочен град'}</p>
                  <div className="mt-4 text-[#1DB954] text-sm">Виж профил →</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
