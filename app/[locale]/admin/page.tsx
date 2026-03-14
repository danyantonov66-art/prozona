import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../components/footer/ProZonaFooter"
import VerifyToggleButton from "@/components/VerifyToggleButton"
import DeleteSpecialistButton from "@/components/DeleteSpecialistButton"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  const [userCount, specialistCount, pendingCount, inquiryCount] = await Promise.all([
    prisma.user.count(),
    prisma.specialist.count(),
    prisma.specialist.count({ where: { verified: false } }),
    prisma.inquiry.count(),
  ])

  const recentSpecialists = await prisma.specialist.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Админ панел</h1>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center">
            <p className="text-3xl font-bold text-[#1DB954]">{userCount}</p>
            <p className="mt-1 text-sm text-gray-400">Потребители</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center">
            <p className="text-3xl font-bold text-[#1DB954]">{specialistCount}</p>
            <p className="mt-1 text-sm text-gray-400">Специалисти</p>
          </div>
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
            <p className="mt-1 text-sm text-gray-400">Чакат верификация</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center">
            <p className="text-3xl font-bold text-[#1DB954]">{inquiryCount}</p>
            <p className="mt-1 text-sm text-gray-400">Запитвания</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href={`/${locale}/admin/specialists`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">🛠️ Специалисти</h2>
            <p className="mt-1 text-sm text-gray-400">Управлявай и верифицирай специалисти</p>
          </Link>
          <Link href={`/${locale}/admin/specialists?filter=pending`} className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 transition hover:border-yellow-500/60">
            <h2 className="text-lg font-semibold">⏳ Чакащи верификация</h2>
            <p className="mt-1 text-sm text-gray-400">{pendingCount} специалиста чакат</p>
          </Link>
          <Link href={`/${locale}/specialists`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">👁️ Виж сайта</h2>
            <p className="mt-1 text-sm text-gray-400">Публичен изглед на платформата</p>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
          <h2 className="mb-4 text-xl font-semibold">Последно регистрирани специалисти</h2>
          <div className="space-y-3">
            {recentSpecialists.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                <div>
                  <p className="font-medium">{s.businessName || s.user?.name || "—"}</p>
                  <p className="text-sm text-gray-400">{s.user?.email} · {s.city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <VerifyToggleButton id={s.id} verified={s.verified} />
                  <Link href={`/${locale}/specialist/${s.id}`} className="text-sm text-[#1DB954] hover:underline">
                    Виж
                  </Link>
                  <DeleteSpecialistButton id={s.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}