// app/categories/[slug]/[subcategory]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, cities } from '@/lib/constants'

interface Props {
  params: Promise<{
    slug: string
    subcategory: string
  }>
}

export default async function SubcategoryPage({ params }: Props) {
  // Изчакваме params (ЗАДЪЛЖИТЕЛНО за Next.js 16)
  const { slug, subcategory } = await params
  
  console.log('Category slug:', slug)
  console.log('Subcategory slug:', subcategory)
  
  // Намери категорията
  const category = categories.find(cat => cat.slug === slug)
  
  if (!category) {
    console.log('Category not found:', slug)
    notFound()
  }

  // Превърни URL обратно в нормално име
  // "зидария-и-мазилки" -> "Зидария и мазилки"
  const subcategoryName = subcategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

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
            <Link href="/categories" className="text-gray-300 hover:text-white">Категории</Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-white">Как работи</Link>
            <Link href="/for-specialists" className="text-gray-300 hover:text-white">За специалисти</Link>
          </nav>
          
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-white hover:text-[#1DB954]">Вход</Link>
            <Link href="/register" className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]">Регистрация</Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Link href="/" className="hover:text-[#1DB954]">Начало</Link>
          <span>/</span>
          <Link href={`/categories/${slug}`} className="hover:text-[#1DB954]">{category.name}</Link>
          <span>/</span>
          <span className="text-white">{subcategoryName}</span>
        </div>
      </div>

      {/* Hero секция */}
      <section className="bg-[#1A1A2E] py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{subcategoryName}</h1>
          <p className="text-gray-400 text-lg">
            Намерете най-добрите специалисти за {subcategoryName.toLowerCase()} в {category.name}
          </p>
        </div>
      </section>

      {/* Филтри и търсене */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-[#1A1A2E] rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              placeholder="Търси специалист..."
              className="px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#1DB954]"
            />
            
            <select className="px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]">
              <option value="">Всички градове</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select className="px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]">
              <option value="">Сортирай по</option>
              <option value="rating">Рейтинг</option>
              <option value="price">Цена</option>
              <option value="experience">Опит</option>
            </select>
          </div>
        </div>
      </section>

      {/* Списък със специалисти */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-8">Специалисти по {subcategoryName}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Примерни специалисти */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-[#0D0D1A] rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-600">👤</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">Иван Иванов</h3>
                  <p className="text-gray-400 text-sm mb-2">{subcategoryName}</p>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 fill-current text-yellow-500" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                    <span className="text-gray-400 text-sm ml-1">(12 отзива)</span>
                  </div>
                  <p className="text-gray-400 text-sm">София • 10 год. опит</p>
                </div>
              </div>
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

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">PZ</span>
                </div>
                <span className="text-white font-semibold">ProZona</span>
              </div>
              <p className="text-gray-400 text-sm">Намери надежден специалист близо до теб</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Категории</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/categories/construction" className="hover:text-[#1DB954]">Строителство</a></li>
                <li><a href="/categories/home" className="hover:text-[#1DB954]">Домашни услуги</a></li>
                <li><a href="/categories/beauty" className="hover:text-[#1DB954]">Красота и здраве</a></li>
                <li><a href="/categories/photography" className="hover:text-[#1DB954]">Фотография</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">За нас</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-[#1DB954]">За ProZona</a></li>
                <li><a href="/how-it-works" className="hover:text-[#1DB954]">Как работи</a></li>
                <li><a href="/contact" className="hover:text-[#1DB954]">Контакти</a></li>
                <li><a href="/faq" className="hover:text-[#1DB954]">Често задавани въпроси</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Свържи се</h4>
              <ul className="space-y-2 text-gray-400">
                <li>office@prozona.bg</li>
                <li>+359 888 123 456</li>
                <li>София, България</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2026 ProZona. Всички права запазени.
          </div>
        </div>
      </footer>
    </main>
  )
}