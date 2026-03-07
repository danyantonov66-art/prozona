import Link from "next/link"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Всички категории
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Избери категория и намери подходящ специалист за дома, бизнеса или ежедневните услуги
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/categories/${category.id}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151528] hover:border-[#1DB954]/40 transition duration-300 shadow-lg"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={`/images/categories/${category.id}.png`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 group-hover:from-black/85 group-hover:via-black/40 transition duration-300" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="inline-flex items-center rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 px-3 py-1 text-xs font-medium text-[#7DFFA8] mb-3">
                    Категория
                  </div>

                  <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                    {category.name}
                  </h2>

                  <p className="text-sm text-gray-200 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="mt-4 inline-flex items-center text-[#1DB954] font-medium text-sm">
                    Разгледай →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}