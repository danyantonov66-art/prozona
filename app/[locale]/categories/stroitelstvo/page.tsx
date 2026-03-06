import Link from 'next/link'
import { notFound } from 'next/navigation'
import { categories } from '@/lib/constants'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params
  
  const category = categories.find(c => c.id === slug)
  if (!category) return notFound()

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href={`/${locale}/categories`} className="text-[#1DB954] hover:underline">
            ← Всички категории
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">
          {category.icon} {category.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories?.map((sub: any) => (
            <Link
              key={sub.id}
              href={`/${locale}/categories/${slug}/${sub.id}`}
              className="bg-[#1A1A2E] p-6 rounded-lg hover:bg-[#25253a] transition-colors"
            >
              <div className="text-3xl mb-4">{sub.icon}</div>
              <h2 className="text-lg font-semibold text-white">{sub.name}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}