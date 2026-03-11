import Link from "next/link"
import { cities } from "@/lib/constants"

interface Props {
  locale: string
}

export default function PopularCities({ locale }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-4 text-center text-3xl font-bold">
        Намери специалист в твоя град
      </h2>

      <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400">
        Избери областен град и разгледай специалисти близо до теб.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {cities.map((city) => (
          <Link
            key={city}
            href={`/${locale}/search?city=${encodeURIComponent(city)}`}
            className="rounded-xl border border-white/10 bg-[#151528] px-5 py-3 text-sm font-medium text-white transition hover:border-[#1DB954] hover:bg-[#1b1b31]"
          >
            {city}
          </Link>
        ))}
      </div>
    </section>
  )
}
