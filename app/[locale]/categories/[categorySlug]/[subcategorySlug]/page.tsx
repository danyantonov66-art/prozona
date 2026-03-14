import Link from "next/link"
import { getServerSession } from "next-auth"
import { prisma } from "../../../../../lib/prisma"
import { categories } from "../../../../../lib/constants"
import { authOptions } from "../../../../../lib/auth"
import ProZonaHeader from "../../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
    categorySlug: string
    subcategorySlug: string
  }>
}

export default async function SubcategoryPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug } = await params
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session

  // Вземи реалните имена от constants
  const category = categories.find((c) => c.slug === categorySlug)
  const subcategory = category?.subcategories.find((s) => s.slug === subcategorySlug)
  const categoryName = category?.name || categorySlug
  const subcategoryName = subcategory?.name || subcategorySlug

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      SpecialistCategory: {
        some: {
          Category: {
            slug: categorySlug,
          },
          Subcategory: {
            slug: subcategorySlug,
          },
        },
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">Начало</Link>
          <span>/</span>
          <Link href={`/${locale}/categories/${categorySlug}`} className="text-[#1DB954] hover:underline">{categoryName}</Link>
          <span>/</span>
          <span className="text-white">{subcategoryName}</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold">{subcategoryName}</h1>
        <p className="mb-8 text-gray-400">Верифицирани специалисти в категория „{subcategoryName}"</p>

        {specialists.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center">
            <p className="mb-4 text-gray-300">Няма намерени специалисти в тази категория все още.</p>
            <Link
              href={`/${locale}/become-specialist`}
              className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-2 font-semibold text-black transition hover:bg-[#1ed760]"
            >
              Стани първият специалист →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => {
              const image = specialist.user?.image || null
              const name = specialist.businessName || specialist.user?.name || "Специалист"
              return (
                <Link
                  key={specialist.id}
                  href={`/${locale}/specialists/${specialist.id}`}
                  className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40"
                >
                  <div className="mb-4">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="h-40 w-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-xl bg-[#23233A] text-4xl font-bold text-[#1DB954]">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h2 className="mb-1 text-xl font-semibold">{name}</h2>
                  {specialist.city && (
                    <p className="mb-2 text-sm text-gray-400">📍 {specialist.city}</p>
                  )}
                  {/* Телефон само за логнати */}
                  {isLoggedIn && specialist.phone && (
                    <p className="mb-2 text-sm text-[#1DB954]">📞 {specialist.phone}</p>
                  )}
                  <p className="line-clamp-3 text-sm text-gray-300">
                    {specialist.description || "Няма добавено описание."}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}