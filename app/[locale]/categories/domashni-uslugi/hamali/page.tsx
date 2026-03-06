import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ locale: string; slug: string; subcategory: string }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, slug, subcategory } = await params

  const names: Record<string, string> = {
    "maistori": "Майстори",
    "remont-banya": "Ремонт на баня",
    "elektrotehnik": "Електротехник",
    "vik": "ВиК",
    "boqdji": "Бояджии",
    "gipsokarton": "Гипсокартон",
    "avtoserviz": "Автосервиз",
    "tenekedjia": "Тенекеджия",
    "smyana-na-gumi": "Смяна на гуми",
    "gtp": "ГТП",
    "repatrak": "Репатрак",
    "transport": "Транспорт",
    "pochistvane": "Почистване",
    "hamali": "Хамали",
    "gradinar": "Градинар",
    "montaji": "Монтажи",
    "drebni-remonti": "Дребни ремонти"
  }

  const subName = names[subcategory] || subcategory.replace(/-/g, ' ')

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <Link href={`/${locale}/categories/${slug}`} className="text-[#1DB954] hover:underline">
            ← Назад
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">{subName}</h1>
        <p className="text-gray-400 mb-8">Намерете най-добрите специалисти</p>

        <div className="bg-[#1A1A2E] rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-4">
            Все още няма специалисти в тази категория.
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
