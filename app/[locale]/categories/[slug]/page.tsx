// app/categories/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, cities } from '@/lib/constants'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  // Изчакваме params
  const { slug } = await params
  
  // Намерете категорията по slug
  const category = categories.find(cat => cat.slug === slug)

  // Ако няма такава категория - 404
  if (!category) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">Категории</Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white transition-colors">Как работи</Link>
            <Link href="/for-specialists" className="text-gray-300 hover:text-white transition-colors">За специалисти</Link>
          </nav>
          
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-white hover:text-[#1DB954] transition-colors">Вход</Link>
            <Link href="/register" className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors">Регистрация</Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Link href="/" className="hover:text-[#1DB954] transition-colors">Начало</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </div>
      </div>

      {/* Hero на категорията */}
      <section className="relative h-[300px] overflow-hidden">
        <img 
          src={category.imageUrl} 
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-xl text-gray-300">{category.description}</p>
        </div>
      </section>

      {/* ПОДКАТЕГОРИИ */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Подкатегории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.subcategories.map((subcategory: string, index: number) => {
            const subcategorySlug = subcategory
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w\-]+/g, '');
            
            return (
              <a
                key={index}
                href={`/categories/${category.slug}/${subcategorySlug}`}
                className="bg-[#1A1A2E] p-4 rounded-lg hover:bg-[#25253a] transition-colors text-center group block"
              >
                <span className="text-white group-hover:text-[#1DB954] transition-colors font-medium">
                  {subcategory}
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* Филтри и търсене */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-[#1A1A2E] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Търсене */}
            <div className="col-span-2">
              <input 
                type="text" 
                placeholder="Търси специалист..."
                className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#1DB954]"
              />
            </div>
            
            {/* Филтър по град */}
            <select className="px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]">
              <option value="">Всички градове</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            {/* Филтър по подкатегория */}
            <select className="px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]">
              <option value="">Всички услуги</option>
              {category.subcategories.map((sub: string) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Списък със специалисти */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">Специалисти в {category.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Примерни специалисти */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
              <div className="flex items-start gap-4">
                {/* Аватар */}
                <div className="w-16 h-16 bg-[#0D0D1A] rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-600">👤</span>
                </div>
                
                {/* Информация */}
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Иван Иванов</h3>
                  <p className="text-gray-400 text-sm mb-2">{category.subcategories[0]}</p>
                  
                  {/* Рейтинг */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="text-gray-400 text-sm ml-1">(12 отзива)</span>
                  </div>
                  
                  {/* Град */}
                  <p className="text-gray-400 text-sm">София</p>
                </div>
              </div>
              
              {/* Бутон за контакт */}
              <a
                href={`/specialist/${i}`}
                className="mt-4 block w-full py-2 bg-[#1DB954] text-white text-center rounded-lg hover:bg-[#169b43] transition-colors"
              >
                Виж профил
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer от ProZona - с правна информация */}
      <ProZonaFooter />
    </main>
  )
}