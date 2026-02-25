// app/[locale]/categories/photography/page.tsx
import { categories } from '@/lib/constants'
import Link from 'next/link'

export default function PhotographyPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const category = categories.find(c => c.slug === 'photography')
  
  return (
    <div className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">
          {category?.name || 'Фотография'}
        </h1>
        <p className="text-gray-400 mb-8">{category?.description}</p>
        
        <h2 className="text-2xl font-bold text-white mb-4">Подкатегории</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {category?.subcategories.map((sub, i) => (
            <div key={i} className="bg-[#1A1A2E] p-4 rounded-lg text-white hover:bg-[#25253a] transition-colors">
              {sub}
            </div>
          ))}
        </div>
        
        <div className="mt-12">
          <Link 
            href={`/${locale}/specialists?category=${category?.slug}`}
            className="inline-block px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
          >
            Виж всички специалисти в тази категория →
          </Link>
        </div>
      </div>
    </div>
  )
}