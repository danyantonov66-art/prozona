import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SuggestionsAdminPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  const suggestions = await prisma.categorySuggestion.findMany({
    orderBy: { createdAt: "desc" },
    include: { Specialist: { include: { user: true } } },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6">
          <Link href={`/${locale}/admin`} className="text-[#1DB954] hover:underline">
            ← Админ панел
          </Link>
        </div>
        <h1 className="mb-8 text-3xl font-bold">Предложения за нови услуги</h1>
        <div className="space-y-4">
          {suggestions.length === 0 && (
            <p className="text-gray-400">Няма предложения.</p>
          )}
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-2xl border border-white/10 bg-[#151528] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">{s.name}</p>
                  {s.parentName && (
                    <p className="text-sm text-gray-400">Категория: {s.parentName}</p>
                  )}
                  <p className="mt-2 text-gray-300">{s.description}</p>
                  {s.Specialist && (
                    <p className="mt-1 text-sm text-gray-400">
                      От специалист: {s.Specialist.user?.name} ({s.Specialist.user?.email})
                    </p>
                  )}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  s.status === "PENDING"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : s.status === "APPROVED"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {s.status}
                </span>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                {new Date(s.createdAt).toLocaleDateString("bg-BG")}
              </p>
            </div>
          ))}
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}