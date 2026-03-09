import Link from "next/link"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-6 text-sm text-gray-400">
          <Link
            href={`/${locale}`}
            className="text-[#1DB954] hover:underline"
          >
            Начало
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Категории</span>
        </div>

        <h1 className="mb-2 text-4xl font-bold text-white">
          Всички категории
        </h1>

        <p className="mb-10 text-gray-400">
          Избери категория и намери подходящ специалист за дома, бизнеса
          или ежедневните услуги
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#151528] transition hover:border-[#1DB954]/40"
            >
              <div className="relative h-56">
                {typeof category.icon === "string" && category.icon.startsWith("/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="h-full w-full object-cover opacity-30 transition duration-300 group-hover:opacity-40"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-6xl opacity-30">
                    {category.icon}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#151528] via-[#151528]/90 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="mb-3 inline-block rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#1DB954]">
                    Категория
                  </span>

                  <h2 className="mb-2 text-2xl font-bold text-white">
                    {category.name}
                  </h2>

                  <p className="mb-4 text-sm text-gray-300">
                    {category.description}
                  </p>

                  <span className="text-sm font-medium text-[#1DB954]">
                    Разгледай →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}