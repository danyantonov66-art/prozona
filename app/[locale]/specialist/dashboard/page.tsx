import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import ProZonaHeader from "../../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../../components/footer/ProZonaFooter"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SpecialistDashboardPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session) redirect(`/${locale}/login`)

  const userId = (session.user as any)?.id
  const specialist = await prisma.specialist.findUnique({
    where: { userId },
    include: {
      user: true,
      GalleryImage: true,
      inquiries: { where: { status: "PENDING" }, take: 1 },
      reviews: { take: 1 },
    },
  })

  if (!specialist) redirect(`/${locale}/become-specialist`)

  const name = specialist.businessName || specialist.user?.name || "Специалист"

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-10">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1A1A2E] border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0">
            {specialist.user?.image ? (
              <img src={specialist.user.image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-[#1DB954]">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-gray-400">{specialist.city} · {specialist.verified ? "✅ Верифициран" : "⏳ Чака одобрение"}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-4 text-center">
            <p className="text-2xl font-bold text-[#1DB954]">{specialist.rating.toFixed(1)}</p>
            <p className="text-sm text-gray-400 mt-1">Рейтинг</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-4 text-center">
            <p className="text-2xl font-bold text-[#1DB954]">{specialist.reviewCount}</p>
            <p className="text-sm text-gray-400 mt-1">Отзива</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-4 text-center">
            <p className="text-2xl font-bold text-[#1DB954]">{specialist.credits}</p>
            <p className="text-sm text-gray-400 mt-1">Кредити</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-4 text-center">
            <p className="text-2xl font-bold text-[#1DB954]">{specialist.GalleryImage.length}/5</p>
            <p className="text-sm text-gray-400 mt-1">Снимки</p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href={`/${locale}/specialist/profile/edit`}
            className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <div className="text-2xl mb-3">✏️</div>
            <h2 className="font-semibold text-lg">Редактирай профил</h2>
            <p className="text-sm text-gray-400 mt-1">Обнови информацията си</p>
          </Link>

          <Link href={`/${locale}/specialist/gallery`}
            className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <div className="text-2xl mb-3">📸</div>
            <h2 className="font-semibold text-lg">Галерия на обекти</h2>
            <p className="text-sm text-gray-400 mt-1">{specialist.GalleryImage.length} от 5 снимки качени</p>
          </Link>

          <Link href={`/${locale}/specialist/inquiries`}
            className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <div className="text-2xl mb-3">📩</div>
            <h2 className="font-semibold text-lg">Запитвания</h2>
            <p className="text-sm text-gray-400 mt-1">Виж получените запитвания</p>
          </Link>

          <Link href={`/${locale}/specialist/prices`}
            className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <div className="text-2xl mb-3">💰</div>
            <h2 className="font-semibold text-lg">Ценова листа</h2>
            <p className="text-sm text-gray-400 mt-1">Управлявай цените си</p>
          </Link>

          <Link href={`/${locale}/specialist/buy-credits`}
            className="rounded-2xl border border-[#1DB954]/30 bg-[#1DB954]/10 p-5 transition hover:border-[#1DB954]/60">
            <div className="text-2xl mb-3">⚡</div>
            <h2 className="font-semibold text-lg">Купи кредити</h2>
            <p className="text-sm text-gray-400 mt-1">{specialist.credits} кредита налични</p>
          </Link>

          <Link href={`/${locale}/specialist/${specialist.id}`}
            className="rounded-2xl border border-white/10 bg-[#151528] p-5 transition hover:border-[#1DB954]/40">
            <div className="text-2xl mb-3">👁️</div>
            <h2 className="font-semibold text-lg">Публичен профил</h2>
            <p className="text-sm text-gray-400 mt-1">Виж как те виждат клиентите</p>
          </Link>

          {!specialist.verified && (
            <Link href={`/${locale}/specialist/verification`}
              className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5 transition hover:border-yellow-500/60">
              <div className="text-2xl mb-3">🔐</div>
              <h2 className="font-semibold text-lg">Верификация</h2>
              <p className="text-sm text-gray-400 mt-1">Верифицирай профила си</p>
            </Link>
          )}
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}