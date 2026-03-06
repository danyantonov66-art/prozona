import Link from 'next/link'
import { notFound } from 'next/navigation'
import { categories } from '@/lib/constants'

interface Props {
  params: Promise<{ locale: string; slug: string; subcategory: string }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, slug, subcategory } = await params
  
  const category = categories.find(c => c.id === slug)
  if (!category) return notFound()

  // Търсим подкатегорията
  let subcategoryData: any = null
  let parentSubcategory: any = null

  // Първо търсим в основните подкатегории
  for (const sub of category.subcategories || []) {
    if (sub.id === subcategory) {
      subcategoryData = sub
      break
    }
    // Ако има вложени подкатегории
    if (sub.subcategories) {
      for (const nestedSub of sub.subcategories) {
        if (nestedSub.id === subcategory) {
          subcategoryData = nestedSub
          parentSubcategory = sub
          break
        }
      }
    }
  }

  if (!subcategoryData) return notFound()

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href={`/${locale}/categories/${slug}`} className="text-[#1DB954] hover:underline">
            ← Назад към {category.name}
          </Link>
          {parentSubcategory && (
            <span className="text-gray-500 mx-2">•</span>
          )}
          {parentSubcategory && (
            <Link href={`/${locale}/categories/${slug}/${parentSubcategory.id}`} className="text-[#1DB954] hover:underline">
              {parentSubcategory.name}
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          {subcategoryData.icon} {subcategoryData.name}
        </h1>
        <p className="text-gray-400 mb-8">
          {parentSubcategory ? `Услуга в категория ${parentSubcategory.name}` : `Намерете най-добрите специалисти за ${subcategoryData.name.toLowerCase()}`}
        </p>

        <div className="bg-[#1A1A2E] rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">
            Все още няма специалисти в тази категория.
          </p>
          <p className="text-gray-500 mb-6">
            Бъдете първият, който предлага тази услуга!
          </p>
          <Link 
            href={`/${locale}/register/specialist`}
            className="inline-block px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
          >
            Регистрирай се като специалист
          </Link>
        </div>
      </div>
    </main>
  )
}