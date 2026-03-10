import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{
    id: string
    locale: string
  }>
}

export default async function SpecialistPage({ params }: Props) {
  const { id, locale } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  if (!specialist) return notFound()

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: specialist.businessName || specialist.user.name,
    description: specialist.description || "",
    url: `https://prozona.bg/${locale}/specialists/${specialist.id}`,
    telephone: specialist.phone || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: specialist.city || "",
      addressCountry: "BG"
    },
    areaServed: {
      "@type": "City",
      name: specialist.city || ""
    },
    serviceType:
      specialist.categories?.map((c) => c.category.name) || [],
    provider: {
      "@type": "Person",
      name: specialist.user.name
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 text-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <h1 className="text-3xl font-bold mb-4">
        {specialist.businessName || specialist.user.name}
      </h1>

      <p className="text-gray-300 mb-6">
        {specialist.description}
      </p>

      <div className="space-y-2 text-gray-400">
        {specialist.city && (
          <p>Град: {specialist.city}</p>
        )}

        {specialist.phone && (
          <p>Телефон: {specialist.phone}</p>
        )}
      </div>

      {specialist.categories?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Услуги</h2>

          <ul className="list-disc ml-5 space-y-1 text-gray-300">
            {specialist.categories.map((c) => (
              <li key={c.id}>
                {c.category.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}