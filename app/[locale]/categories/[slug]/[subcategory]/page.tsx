import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { categories } from '@/lib/constants'

interface Props {
  params: Promise<{
    locale: string
    slug: string
    subcategory: string
  }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, slug, subcategory } = await params

  const category = categories.find(c => c.id === slug)
  if (!category) notFound()

  const subcategoryData = category.subcategories.find(s => s.id === subcategory)
  if (!subcategoryData) notFound()

  const specialists = await prisma.specialist.findMany({
    where: { categoryId: slug, subcategoryId: subcategory, isApproved: true },
    include: { user: true },
    orderBy: { rating: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href={`/${locale}/categories/${slug}`} className="text-[#1DB954] hover:underline">
            ← Назад към {category.name}
          </Link>
        </div>
      </header>
      <section className="container mx-auto px-4 py-10">
        <p className="text-sm text-gray-400 mb-2">{category.name}</p>
        <h1 className="text-3xl font-bold mb-8">{subcategoryData.icon} {subcategoryData.name}</h1>
        {specialists.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-6 text-gray-400">
            Все още няма добавени специалисти в тази подкатегория.
            <div className="mt-4">
              <Link href={`/${locale}/become-specialist`} className="text-[#1DB954] hover:underline">
                Регистрирай се като специалист
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => (
              <Link key={specialist.id} href={`/${locale}/specialist/${specialist.id}`}
                className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-5 hover:border-[#1DB954] transition">
                <h2 className="text-xl font-semibold mb-2">
                  {specialist.businessName || specialist.user?.name || 'Специалист'}
                </h2>
                <p className="text-sm text-gray-400 mb-2">{specialist.city || 'Без посочен град'}</p>
                {specialist.description && (
                  <p className="text-sm text-gray-300 line-clamp-3">{specialist.description}</p>
                )}
                <div className="mt-4 text-[#1DB954] text-sm">Виж профил →</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
