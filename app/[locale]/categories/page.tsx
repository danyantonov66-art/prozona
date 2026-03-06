import Link from 'next/link'
import { categories } from '@/lib/constants'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Всички категории</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/categories/${category.id}`}
              className="bg-[#1A1A2E] p-6 rounded-lg hover:bg-[#25253a] transition-colors"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h2 className="text-xl font-bold text-white mb-2">{category.name}</h2>
              <p className="text-gray-400">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}