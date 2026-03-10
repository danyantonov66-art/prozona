import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { categories, cities } from "@/lib/constants"

interface Props {
  params: Promise<{
    locale: string
    city: string
    service: string
  }>
}

function normalizeSlug(value: string) {
  return decodeURIComponent(value).toLowerCase()
}

function findServiceBySlug(serviceSlug: string) {
  for (const category of categories) {
    for (const sub of category.subcategories) {
      if (sub.slug === serviceSlug) {
        return {
          category,
          subcategory: sub,
        }
      }
    }
  }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, service } = await params
  const decodedCity = decodeURIComponent(city)
  const serviceData = findServiceBySlug(normalizeSlug(service))

  if (!serviceData) {
    return {
      title: "Услугата не е намерена | ProZona",
    }
  }

  return {
    title: `${serviceData.subcategory.name} в ${decodedCity} | ProZona`,
    description: `Намери специалисти за ${serviceData.subcategory.name.toLowerCase()} в ${decodedCity}. Разгледай профили и избери подходящ професионалист в ProZona.`,
  }
}

export default async function CityServicePage({ params }: Props) {
  const { locale, city, service } = await params
  const decodedCity = decodeURIComponent(city)
  const serviceSlug = normalizeSlug(service)

  const cityExists = cities.includes(decodedCity)
  const serviceData = findServiceBySlug(serviceSlug)

  if (!cityExists || !serviceData) {
    notFound()
  }

  const specialists = await prisma.specialist.findMany({
    where: {
      verified: true,
      city: decodedCity,
      SpecialistCategory: {
        some: {
          Subcategory: {
            slug: serviceSlug,
          },
        },
      },
    },
    include: {
      user: true,
      SpecialistCategory: {
        include: {
          Category: true,
          Subcategory: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 text-sm text-gray-400">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            Начало
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/${locale}/search?city=${encodeURIComponent(decodedCity)}`}
            className="text-[#1DB954] hover:underline"
          >
            {decodedCity}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{serviceData.subcategory.name}</span>
        </div>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {serviceData.subcategory.name} в {decodedCity}
          </h1>

          <p className="max-w-3xl text-lg text-gray-400">
            Разгледай верифицирани специалисти за {serviceData.subcategory.name.toLowerCase()} в {decodedCity} и избери подходящ професионалист за твоята услуга.
          </p>
        </div>

        {specialists.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#151528] p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              Все още няма специалисти
            </h2>
            <p className="text-gray-400">
              За момента няма публикувани специалисти за тази услуга в {decodedCity}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {specialists.map((specialist) => {
              const displayName =
                specialist.businessName ||
                specialist.user?.name ||
                "Специалист"

              const mainCategory =
                specialist.SpecialistCategory[0]?.Category?.name

              const subcategory =
                specialist.SpecialistCategory[0]?.Subcategory?.name

              return (
                <div
                  key={specialist.id}
                  className="rounded-3xl border border-white/10 bg-[#151528] p-6"
                >
                  <h2 className="mb-2 text-2xl font-bold">
                    {displayName}
                  </h2>

                  {mainCategory && (
                    <p className="mb-1 text-sm text-[#86efac]">
                      {mainCategory}
                      {subcategory ? ` • ${subcategory}` : ""}
                    </p>
                  )}

                  <p className="mb-4 text-sm text-gray-400">
                    {specialist.city}
                  </p>

                  {specialist.description && (
                    <p className="mb-6 line-clamp-3 text-sm text-gray-300">
                      {specialist.description}
                    </p>
                  )}

                  <Link
                    href={`/${locale}/specialists/${specialist.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-4 py-2 font-semibold text-black hover:bg-[#1ed760]"
                  >
                    Виж профил
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}