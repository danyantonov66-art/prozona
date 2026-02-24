// app/categories/page.tsx
import Link from 'next/link'
import { categories } from '@/lib/constants'

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Категории услуги</h1>
        <p className="text-xl text-gray-400 mb-12 text-center">
          Избери категория и намери най-добрия специалист
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/categories/${category.slug}`}
              className="bg-[#1A1A2E] rounded-lg overflow-hidden hover:bg-[#25253a] transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#1DB954]">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                <span className="text-[#1DB954]">Виж услугите →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}