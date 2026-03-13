import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import InquiryButton from "@/components/InquiryButton"
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function SpecialistPage({ params }: Props) {
  const { locale, id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
    },
  })

  if (!specialist) {
    notFound()
  }

  const name = specialist.businessName || specialist.user?.name || "Специалист"
  const image = specialist.user?.image || null

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151528]">
          <div className="p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[320px_1fr]">
              <div>
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="h-72 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-[#23233A] text-6xl font-bold text-[#1DB954]">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h1 className="mb-4 text-3xl font-bold">{name}</h1>

                {specialist.city && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">Град:</span>{" "}
                    {specialist.city}
                  </p>
                )}

                {specialist.phone && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">Телефон:</span>{" "}
                    {specialist.phone}
                  </p>
                )}

                {specialist.experienceYears && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">Опит:</span>{" "}
                    {specialist.experienceYears} години
                  </p>
                )}

                {specialist.serviceAreas && specialist.serviceAreas.length > 0 && (
                  <p className="mb-2 text-gray-300">
                    <span className="font-semibold text-white">Обслужва:</span>{" "}
                    {specialist.serviceAreas.join(", ")}
                  </p>
                )}
                <InquiryButton specialistId={specialist.id} specialistName={name} />

                <div className="mt-6">
                  <h2 className="mb-3 text-xl font-semibold">Описание</h2>
                  <p className="leading-7 text-gray-300">
                    {specialist.description || "Няма добавено описание."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}