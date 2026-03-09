import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { categories } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
  }>
}

const categoryGradients: Record<string, string> = {
  remonti: "from-[#2B1F1F] via-[#1A1A2E] to-[#101522]",
  pochistvane: "from-[#13232A] via-[#1A1A2E] to-[#101522]",
  montaj: "from-[#24182B] via-[#1A1A2E] to-[#101522]",
  gradina: "from-[#132616] via-[#1A1A2E] to-[#101522]",
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-white">Категории</span>
        </div>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            Всички категории
          </h1>

          <p className="max-w-3xl text-lg text-gray-400">
            Избери категория и намери подходящ специалист за дома, бизнеса или
            ежедневните услуги.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${locale}/categories/${category.slug}`}
              className={`group relative min-h-[260px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${
                categoryGradients[category.slug] || "from-[#1A1A2E] to-[#101522]"
              } p-6 transition hover:-translate-y-1 hover:border-[#1DB954]/40`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(29,185,84,0.16),transparent_35%)] opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-[#1DB954]/20 px-3 py-1 text-xs font-medium text-[#86efac]">
                    Категория
                  </span>
                </div>

                <div>
                  <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
                    {category.name}
                  </h2>

                  <p className="mb-6 max-w-md text-base text-gray-200">
                    {category.description}
                  </p>

                  <span className="inline-flex items-center text-base font-medium text-[#1DB954]">
                    Разгледай →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}