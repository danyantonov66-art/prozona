import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AdminInquiriesPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      Category: { select: { name: true } },
      specialist: { include: { user: { select: { name: true } } } },
      User: { select: { name: true, email: true } },
    },
  })

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
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <Link href={`/${locale}/admin`} className="text-[#1DB954] hover:underline text-sm">
            ← Админ панел
          </Link>
        </div>
        <h1 className="mb-8 text-3xl font-bold">Запитвания ({inquiries.length})</h1>

        <div className="rounded-2xl border border-white/10 bg-[#151528] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-[#0D0D1A]">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400">Клиент</th>
                <th className="px-4 py-3 text-left text-gray-400">Категория</th>
                <th className="px-4 py-3 text-left text-gray-400">Град</th>
                <th className="px-4 py-3 text-left text-gray-400">Специалист</th>
                <th className="px-4 py-3 text-left text-gray-400">Статус</th>
                <th className="px-4 py-3 text-left text-gray-400">Дата</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium">{inq.name}</p>
                    <p className="text-xs text-gray-500">{inq.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{inq.Category?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{inq.city}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {inq.specialist ? (
                      <Link
                        href={`/${locale}/specialist/${inq.specialist.id}`}
                        className="text-[#1DB954] hover:underline"
                      >
                        {inq.specialist.user?.name || "—"}
                      </Link>
                    ) : (
                      <span className="text-gray-600">Без специалист</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColor[inq.status]}`}>
                      {statusLabel[inq.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(inq.createdAt).toLocaleDateString("bg-BG")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}