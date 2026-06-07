import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${locale}/login`)
  }

  const userId = (session.user as any)?.id
  const role = (session.user as any)?.role

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { specialist: true },
  })

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const specialist = user.specialist

  return (
  <main className="min-h-screen bg-[#0B1220] text-white">
    <ProZonaHeader locale={locale} />
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Моето табло</h1>
      <p className="mb-8 text-gray-400">
        Добре дошъл, {user.name || user.email}!
      </p>
      {/* Кредитен баланс */}
      {specialist && (
        <div className="mb-8 rounded-2xl border border-[#1DB954]/30 bg-[#1DB954]/5 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🪙</span>
              <div>
                <p className="text-sm text-gray-400">Наличен баланс</p>
                <p className="text-3xl font-bold text-[#1DB954]">{specialist.credits} кредита</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${locale}/dashboard/credits`}
                className="rounded-xl bg-[#1DB954] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#1ed760] transition"
              >
                + Купи кредити
              </Link>
              <Link
                href={`/${locale}/specialist/dashboard`}
                className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Виж запитвания
              </Link>
            </div>
          </div>
          {specialist.credits > 0 && (
            <p className="mt-3 text-xs text-gray-500">
              💡 Имаш {specialist.credits} активни кредита — използвай ги за да се свържеш с клиенти
            </p>
          )}
          {specialist.credits === 0 && (
            <p className="mt-3 text-xs text-yellow-400">
              ⚠️ Нямаш кредити — купи за да продължиш да получаваш клиенти
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile */}
        <Link
          href={`/${locale}/dashboard/profile-edit`}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1DB954]/40 hover:bg-white/10"
        >
          <div className="mb-3 text-2xl">👤</div>
          <h2 className="text-lg font-semibold">Профил</h2>
          <p className="mt-1 text-sm text-gray-400">Редактирай личната си информация</p>
        </Link>

        {/* Inquiries */}
        <Link
          href={`/${locale}/dashboard/inquiries`}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1DB954]/40 hover:bg-white/10"
        >
          <div className="mb-3 text-2xl">📩</div>
          <h2 className="text-lg font-semibold">Запитвания</h2>
          <p className="mt-1 text-sm text-gray-400">Виж изпратените запитвания</p>
        </Link>

        {/* Favorites */}
        <Link
          href={`/${locale}/dashboard/favorites`}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1DB954]/40 hover:bg-white/10"
        >
          <div className="mb-3 text-2xl">❤️</div>
          <h2 className="text-lg font-semibold">Любими</h2>
          <p className="mt-1 text-sm text-gray-400">Запазени специалисти</p>
        </Link>

        {/* Specialist dashboard */}
        {specialist && (
          <Link
            href={`/${locale}/specialist/dashboard`}
            className="rounded-2xl border border-[#1DB954]/30 bg-[#1DB954]/10 p-5 transition hover:border-[#1DB954]/60 hover:bg-[#1DB954]/20"
          >
            <div className="mb-3 text-2xl">🛠️</div>
            <h2 className="text-lg font-semibold">Табло на специалист</h2>
            <p className="mt-1 text-sm text-gray-400">Управлявай своя профил на специалист</p>
          </Link>
        )}

        {/* Become specialist */}
        {!specialist && (
          <Link
            href={`/${locale}/become-specialist`}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-[#1DB954]/40 hover:bg-white/10"
          >
            <div className="mb-3 text-2xl">🚀</div>
            <h2 className="text-lg font-semibold">Стани специалист</h2>
            <p className="mt-1 text-sm text-gray-400">Регистрирай се като специалист</p>
          </Link>
        )}

        {/* Admin */}
        {role === "ADMIN" && (
          <Link
            href={`/${locale}/admin`}
            className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 transition hover:border-yellow-500/60"
          >
            <div className="mb-3 text-2xl">⚙️</div>
            <h2 className="text-lg font-semibold">Администрация</h2>
            <p className="mt-1 text-sm text-gray-400">Управлявай платформата</p>
          </Link>
        )}
      </div>
    </div>
    <ProZonaFooter locale={locale} />
  </main>
)
}
