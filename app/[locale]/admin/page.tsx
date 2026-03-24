import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import VerifyToggleButton from "@/components/VerifyToggleButton"
import DeleteSpecialistButton from "@/components/DeleteSpecialistButton"
import SendEmailButton from "@/components/SendEmailButton"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  const [userCount, specialistCount, pendingCount, inquiryCount, suggestionCount, clientCount] = await Promise.all([
    prisma.user.count(),
    prisma.specialist.count(),
    prisma.specialist.count({ where: { verified: false } }),
    prisma.inquiry.count(),
    prisma.categorySuggestion.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ])

  const recentSpecialists = await prisma.specialist.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  })

  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    where: { role: "CLIENT" },
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Админ панел</h1>

        {/* Статистика */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-6">
          <Link href={`/${locale}/admin/users`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center hover:border-[#1DB954]/40 transition">
            <p className="text-3xl font-bold text-[#1DB954]">{userCount}</p>
            <p className="mt-1 text-sm text-gray-400">Потребители</p>
          </Link>
          <Link href={`/${locale}/admin/users`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center hover:border-[#1DB954]/40 transition">
            <p className="text-3xl font-bold text-[#1DB954]">{clientCount}</p>
            <p className="mt-1 text-sm text-gray-400">Клиенти</p>
          </Link>
          <Link href={`/${locale}/admin/specialists`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center hover:border-[#1DB954]/40 transition">
            <p className="text-3xl font-bold text-[#1DB954]">{specialistCount}</p>
            <p className="mt-1 text-sm text-gray-400">Специалисти</p>
          </Link>
          <Link href={`/${locale}/admin/specialists?filter=pending`} className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-center hover:border-yellow-500/60 transition">
            <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
            <p className="mt-1 text-sm text-gray-400">Чакат верификация</p>
          </Link>
          <Link href={`/${locale}/admin/inquiries`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 text-center hover:border-[#1DB954]/40 transition">
            <p className="text-3xl font-bold text-[#1DB954]">{inquiryCount}</p>
            <p className="mt-1 text-sm text-gray-400">Запитвания</p>
          </Link>
          <Link href={`/${locale}/admin/suggestions`} className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-center hover:border-blue-500/60 transition">
            <p className="text-3xl font-bold text-blue-400">{suggestionCount}</p>
            <p className="mt-1 text-sm text-gray-400">Предложения</p>
          </Link>
        </div>

        {/* Навигация */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href={`/${locale}/admin/users`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">👥 Потребители</h2>
            <p className="mt-1 text-sm text-gray-400">Виж всички регистрирани потребители</p>
          </Link>
          <Link href={`/${locale}/admin/specialists`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">🛠️ Специалисти</h2>
            <p className="mt-1 text-sm text-gray-400">Управлявай и верифицирай специалисти</p>
          </Link>
          <Link href={`/${locale}/admin/specialists?filter=pending`} className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 transition hover:border-yellow-500/60">
            <h2 className="text-lg font-semibold">⏳ Чакащи верификация</h2>
            <p className="mt-1 text-sm text-gray-400">{pendingCount} специалиста чакат</p>
          </Link>
          <Link href={`/${locale}/admin/inquiries`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">📩 Запитвания</h2>
            <p className="mt-1 text-sm text-gray-400">Виж всички запитвания от клиенти</p>
          </Link>
          <Link href={`/${locale}/specialists`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">👁️ Виж сайта</h2>
            <p className="mt-1 text-sm text-gray-400">Публичен изглед на платформата</p>
          </Link>
          <Link href={`/${locale}/admin/suggestions`} className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 transition hover:border-blue-500/60">
            <h2 className="text-lg font-semibold">📋 Предложения за услуги</h2>
            <p className="mt-1 text-sm text-gray-400">{suggestionCount} нови предложения</p>
          </Link>
          <Link href={`/${locale}/admin/blog`} className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <h2 className="text-lg font-semibold">📝 Блог</h2>
            <p className="mt-1 text-sm text-gray-400">Управлявай статиите в блога</p>
          </Link>
        </div>

        {/* Последно регистрирани специалисти */}
        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Последно регистрирани специалисти</h2>
            <Link href={`/${locale}/admin/specialists`} className="text-sm text-[#1DB954] hover:underline">Виж всички →</Link>
          </div>
          <div className="space-y-3">
            {recentSpecialists.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                <div>
                  <p className="font-medium">{s.businessName || s.user?.name || "—"}</p>
                  <p className="text-sm text-gray-400">{s.user?.email} · {s.city}</p>
                </div>
                <div className="flex items-center gap-3">
                  <VerifyToggleButton id={s.id} verified={s.verified} />
                  {/* ✅ Бутон за имейл */}
                  <SendEmailButton
                    email={s.user?.email || ""}
                    name={s.businessName || s.user?.name || "Специалист"}
                    specialistId={s.id}
                  />
                  <Link href={`/${locale}/specialists/${s.id}`} className="text-sm text-[#1DB954] hover:underline">
                    Виж
                  </Link>
                  <DeleteSpecialistButton id={s.id} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Последно регистрирани клиенти */}
        <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Последно регистрирани клиенти</h2>
            <Link href={`/${locale}/admin/users`} className="text-sm text-[#1DB954] hover:underline">Виж всички →</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>
                <p className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString("bg-BG")}</p>
              </div>
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}