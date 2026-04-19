import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import DeleteUserButton from "@/components/DeleteUserButton"
import SendEmailButton from "@/components/SendEmailButton"
import ChangeRoleButton from "@/components/ChangeRoleButton"

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ role?: string }>
}

export default async function AdminUsersPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { role } = await searchParams
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect(`/${locale}/login`)
  }

  const users = await prisma.user.findMany({
    where: role ? { role: role as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      specialist: { select: { id: true, verified: true, city: true } },
    },
  })

  const title = role === "CLIENT" ? "Клиенти" : role === "SPECIALIST" ? "Специалисти" : "Потребители"

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/${locale}/admin`} className="text-[#1DB954] hover:underline text-sm">
            ← Админ панел
          </Link>
          <div className="flex gap-2 ml-4">
            <Link href={`/${locale}/admin/users`} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${!role ? "bg-[#1DB954] text-black" : "border border-white/20 text-gray-400 hover:text-white"}`}>
              Всички
            </Link>
            <Link href={`/${locale}/admin/users?role=CLIENT`} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${role === "CLIENT" ? "bg-green-500 text-black" : "border border-white/20 text-gray-400 hover:text-white"}`}>
              Клиенти
            </Link>
            <Link href={`/${locale}/admin/users?role=SPECIALIST`} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${role === "SPECIALIST" ? "bg-blue-500 text-white" : "border border-white/20 text-gray-400 hover:text-white"}`}>
              Специалисти
            </Link>
          </div>
        </div>
        <h1 className="mb-8 text-3xl font-bold">{title} ({users.length})</h1>
        <div className="rounded-2xl border border-white/10 bg-[#151528] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-[#0D0D1A]">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400">Име</th>
                <th className="px-4 py-3 text-left text-gray-400">Имейл</th>
                <th className="px-4 py-3 text-left text-gray-400">Роля</th>
                <th className="px-4 py-3 text-left text-gray-400">Град</th>
                <th className="px-4 py-3 text-left text-gray-400">Регистриран</th>
                <th className="px-4 py-3 text-left text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-gray-400">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-red-500/20 text-red-400"
                        : u.role === "SPECIALIST"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {u.role === "ADMIN" ? "Админ" : u.role === "SPECIALIST" ? "Специалист" : "Клиент"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {u.specialist?.city || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString("bg-BG")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {u.specialist && (
                        <Link
                          href={`/${locale}/specialist/${u.specialist.id}`}
                          className="text-[#1DB954] hover:underline text-xs"
                        >
                          Виж профил
                        </Link>
                      )}
                      {(u.role === "CLIENT" || (u.role === "SPECIALIST" && !u.specialist)) && (
                        <ChangeRoleButton userId={u.id} currentRole={u.role} />
                      )}
                      {u.role === "CLIENT" && (
                        <SendEmailButton
                          email={u.email || ""}
                          name={u.name || "Потребител"}
                          type="wrong_role"
                        />
                      )}
                      {u.role !== "ADMIN" && (
                        <DeleteUserButton id={u.id} />
                      )}
                    </div>
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