import Link from "next/link"

interface Props {
  locale: string
}

const popularServices = [
  { name: "Хамалски услуги", slug: "premestvane-hamali" },
  { name: "ВиК услуги", slug: "vik" },
  { name: "Почистване", slug: "domashno" },
  { name: "Монтаж на мебели", slug: "mebeli" },
  { name: "Климатици", slug: "klimatici" },
]

const popularCities = [
  "София",
  "Пловдив",
  "Варна",
  "Бургас",
  "Русе",
]

export default function PopularCityServices({ locale }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-4 text-center text-3xl font-bold">
        Популярни услуги по град
      </h2>

      <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
        Бърз достъп до най-търсените услуги в големите градове.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {popularCities.map((city) =>
          popularServices.map((service) => (
            <Link
              key={`${city}-${service.slug}`}
              href={`/${locale}/uslugi/${encodeURIComponent(city)}/${service.slug}`}
              className="rounded-xl border border-white/10 bg-[#151528] px-4 py-3 text-sm text-center transition hover:border-[#1DB954] hover:bg-[#1b1b31]"
            >
              {service.name}
              <div className="text-xs text-gray-400 mt-1">
                {city}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  )
}
