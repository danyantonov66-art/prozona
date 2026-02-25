import { categories } from '@/lib/constants'
import Link from 'next/link'

export default function ConstructionPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const category = categories.find(c => c.slug === 'construction')

  if (!category) {
    return <div>Категорията не е намерена</div>
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">{category.name}</h1>
        <p className="text-gray-400 mb-8">{category.description}</p>

        <h2 className="text-2xl font-bold text-white mb-4">Подкатегории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category.subcategories.map((sub, index) => (
            <Link
              key={index}
              href={`/${locale}/categories/${category.slug}/${sub.toLowerCase().replace(/ /g, '-')}`}
              className="bg-[#1A1A2E] p-4 rounded-lg text-white hover:bg-[#25253a] transition-colors"
            >
              {sub}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}