import { redirect, notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{ locale: string; id: string }>
}

export default async function AdminInquiryDetailPage({ params }: Props) {
  const { locale, id } = await params
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  const inq = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      Category: true,
      specialist: { include: { user: { select: { name: true, email: true } } } },
      User: { select: { name: true, email: true } },
      InquiryResponse: {
        include: { Specialist: { include: { user: { select: { name: true } } } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!inq) notFound()

  const statusLabel: Record<string, string> = {
    PENDING: "Чакащо",
    VIEWED: "Видяно",
    REPLIED: "Отговорено",
    COMPLETED: "Завършено",
    CANCELLED: "Отказано",
  }

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    VIEWED: "bg-blue-500/20 text-blue-400",
    REPLIED: "bg-purple-500/20 text-purple-400",
    COMPLETED: "bg-green-500/20 text-green-400",
    CANCELLED: "bg-red-500/20 text-red-400",
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6">
          <Link href={`/${locale}/admin/inquiries`} className="text-[#1DB954] hover:underline text-sm">
            ← Всички запитвания
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Запитване #{inq.id.slice(-6).toUpperCase()}</h1>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor[inq.status]}`}>
            {statusLabel[inq.status]}
          </span>
        </div>

        {/* Клиент */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#151528] p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-300">👤 Клиент</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Име</p>
              <p className="font-medium">{inq.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">{inq.email}</p>
            </div>
            {inq.phone && (
              <div>
                <p className="text-gray-500">Телефон</p>
                <p className="font-medium">{inq.phone}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Град</p>
              <p className="font-medium">{inq.city}</p>
            </div>
          </div>
        </div>

        {/* Запитване */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#151528] p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-300">📋 Детайли</h2>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500">Категория</p>
              <p className="font-medium">{inq.Category?.name || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500">Дата</p>
              <p className="font-medium">{new Date(inq.createdAt).toLocaleDateString("bg-BG")}</p>
            </div>
            {inq.viewedAt && (
              <div>
                <p className="text-gray-500">Видяно на</p>
                <p className="font-medium">{new Date(inq.viewedAt).toLocaleDateString("bg-BG")}</p>
              </div>
            )}
            {inq.repliedAt && (
              <div>
                <p className="text-gray-500">Отговорено на</p>
                <p className="font-medium">{new Date(inq.repliedAt).toLocaleDateString("bg-BG")}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-2">Съобщение</p>
            <div className="rounded-xl bg-[#0D0D1A] p-4 text-gray-200 leading-relaxed">
              {inq.message}
            </div>
          </div>
          {inq.notes && (
            <div className="mt-4">
              <p className="text-gray-500 text-sm mb-2">Бележки</p>
              <div className="rounded-xl bg-[#0D0D1A] p-4 text-gray-200">
                {inq.notes}
              </div>
            </div>
          )}
        </div>

        {/* Специалист */}
        <div className="mb-4 rounded-2xl border border-white/10 bg-[#151528] p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-300">🔧 Специалист</h2>
          {inq.specialist ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{inq.specialist.user?.name || "—"}</p>
                <p className="text-sm text-gray-500">{inq.specialist.user?.email || "—"}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/${locale}/specialist/${inq.specialist.id}`}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition"
                >
                  Виж профил →
                </Link>
                {inq.status === "PENDING" && (
                  <form action={`/api/admin/inquiries/${inq.id}/remind`} method="POST">
                    <button
                      type="submit"
                      className="rounded-lg bg-[#1DB954]/20 px-3 py-1.5 text-xs font-medium text-[#1DB954] hover:bg-[#1DB954]/30 transition"
                    >
                      🔔 Изпрати напомняне
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Без назначен специалист</p>
          )}
        </div>

        {/* Отговори */}
        {inq.InquiryResponse.length > 0 && (
          <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-300">💬 Отговори ({inq.InquiryResponse.length})</h2>
            <div className="space-y-3">
              {inq.InquiryResponse.map((r) => (
                <div key={r.id} className="rounded-xl bg-[#0D0D1A] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-[#1DB954]">
                      {r.Specialist.user?.name || "Специалист"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleDateString("bg-BG")}
                    </p>
                  </div>
                  <p className="text-sm text-gray-300">{r.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}