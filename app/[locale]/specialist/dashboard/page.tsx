import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import ProZonaHeader from "../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function SpecialistDashboardPage({ params }: Props) {
  const { locale } = await params

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/${locale}/login`)
  }

  const userId = (session.user as any)?.id

  const specialist = await prisma.specialist.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-bold">Табло на специалист</h1>

        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
          {!specialist ? (
            <p className="text-gray-300">Няма създаден профил на специалист.</p>
          ) : (
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-semibold text-white">Име:</span>{" "}
                {specialist.businessName || specialist.user?.name || "Специалист"}
              </p>
              <p>
                <span className="font-semibold text-white">Град:</span>{" "}
                {specialist.city || "-"}
              </p>
              <p>
                <span className="font-semibold text-white">Статус:</span>{" "}
                {specialist.isVerified ? "Верифициран" : "Чака одобрение"}
              </p>
            </div>
          )}
        </div>
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}