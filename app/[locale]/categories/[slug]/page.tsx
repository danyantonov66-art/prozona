import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, cities } from '@/lib/constants'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params
  const category = categories.find(cat => cat.slug === slug)
  if (!category) { notFound() }

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href={`/${locale}/categories`} className="text-gray-300 hover:text-white">Категории</Link>
            <Link href={`/${locale}/how-it-works`} className="text-gray-300 hover:text-white">Как работи</Link>
            <Link href={`/${locale}/for-specialists`} className="text-gray-300 hover:text-white">За специалисти</Link>
          </nav>
          <div className="flex gap-3">
            <Link href={`/${locale}/login`} className="px-4 py-2 text-white hover:text-[#1DB954]">Вход</Link>
            <Link href={`/${locale}/register`} className="px-4 py-2 bg-[#1DB954] text-white rounded-lg">Регистрация</Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Link href={`/${locale}`} className="hover:text-[#1DB954]">Начало</Link>
          <span>/</span>
          <Link href={`/${locale}/categories`} className="hover:text-[#1DB954]">Категории</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </div>
      </div>

      <section className="relative h-[300px] overflow-hidden">
        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{category.name}</h1>
          <p className="text-xl text-gray-300">{category.description}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Подкатегории</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {category.subcategories.map((subcategory: string, index: number) => {
            const subcategorySlug = subcategory.toLowerCase().replace(/ /g, '-').replace(/[^\w\-]+/g, '')
            return (
              <a key={index} href={`/${locale}/categories/${category.slug}/${subcategorySlug}`}
                className="bg-[#1A1A2E] p-4 rounded-lg hover:bg-[#25253a] transition-colors text-center group block">
                <span className="text-white group-hover:text-[#1DB954] font-medium">{subcategory}</span>
              </a>
            )
          })}
        </div>
      </section>

      <ProZonaFooter />
    </main>
  )
}
