import Link from "next/link"

const categories = [
  {
    id: "stroitelstvo",
    name: "Строителство и ремонти",
    description: "Майстори, ВиК, електро, бояджии",
    image: "/images/categories/stroitelstvo.png",
  },
  {
    id: "auto-transport",
    name: "Авто услуги и транспорт",
    description: "Автосервизи, транспорт, хамали",
    image: "/images/categories/auto-transport.png",
  },
  {
    id: "krasota",
    name: "Красота и грижа",
    description: "Фризьори, маникюр, козметика",
    image: "/images/categories/krasota.png",
  },
  {
    id: "mebeli",
    name: "Мебели и сглобяване",
    description: "Сглобяване и ремонт на мебели",
    image: "/images/categories/mebeli.png",
  },
  {
    id: "pochistvane",
    name: "Почистване",
    description: "Домашно и професионално почистване",
    image: "/images/categories/pochistvane.png",
  },
  {
    id: "gradina",
    name: "Градина и двор",
    description: "Поддръжка на двор и озеленяване",
    image: "/images/categories/gradina.png",
  },
  {
    id: "klimatici",
    name: "Климатична техника",
    description: "Монтаж и ремонт на климатици",
    image: "/images/categories/klimatici.png",
  },
  {
    id: "uroci",
    name: "Уроци и обучения",
    description: "Частни уроци и професионални обучения",
    image: "/images/categories/uroci.png",
  },
]

interface Props {
  params: Promise<{ locale: string }>
}

export default async function CategoriesPage({ params }: Props) {
  const { locale } = await params

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Всички категории
          </h1>
          <p className="text-gray-400">
            Избери категория и намери подходящ специалист
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/categories/${category.id}`}
              className="rounded-2xl overflow-hidden bg-[#1A1A2E] border border-white/5 hover:border-[#1DB954]/40 transition group"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h2>

                <p className="text-gray-400 text-sm">
                  {category.description}
                </p>

                <div className="mt-4 text-[#1DB954] text-sm font-medium">
                  Виж категорията →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
