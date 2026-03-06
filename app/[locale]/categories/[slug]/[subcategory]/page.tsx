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

  let subcategoryData: any = null
  let parentSubcategory: any = null

  for (const sub of category.subcategories || []) {
    if (sub.id === subcategory) {
      subcategoryData = sub
      break
    }
    if ((sub as any).subcategories) {
      for (const nestedSub of (sub as any).subcategories) {
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
            в†ђ РќР°Р·Р°Рґ РєСЉРј {category.name}
          </Link>
          {parentSubcategory && (
            <>
              <span className="text-gray-500 mx-2">вЂў</span>
              <Link href={`/${locale}/categories/${slug}/${parentSubcategory.id}`} className="text-[#1DB954] hover:underline">
                {parentSubcategory.name}
              </Link>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          {subcategoryData.icon} {subcategoryData.name}
        </h1>
        <p className="text-gray-400 mb-8">
          РќР°РјРµСЂРµС‚Рµ РЅР°Р№-РґРѕР±СЂРёС‚Рµ СЃРїРµС†РёР°Р»РёСЃС‚Рё
        </p>

        <div className="bg-[#1A1A2E] rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">
            Р’СЃРµ РѕС‰Рµ РЅСЏРјР° СЃРїРµС†РёР°Р»РёСЃС‚Рё РІ С‚Р°Р·Рё РєР°С‚РµРіРѕСЂРёСЏ.
          </p>
          <Link 
            href={`/${locale}/register/specialist`}
            className="inline-block px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] transition-colors"
          >
            Р РµРіРёСЃС‚СЂРёСЂР°Р№ СЃРµ РєР°С‚Рѕ СЃРїРµС†РёР°Р»РёСЃС‚
          </Link>
        </div>
      </div>
    </main>
  )
}
