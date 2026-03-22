"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Specialist {
  id: string
  businessName?: string
  city: string
  verified: boolean
  subscriptionPlan: string
  createdAt: string
  user?: { name: string; email: string }
}

export default function AdminSpecialistsPage() {
  const params = useParams()
  const locale = params?.locale as string || "bg"

  const [items, setItems] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all")
  const [search, setSearch] = useState("")

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/specialists", { cache: "no-store" })
    const data = await res.json()
    setItems(Array.isArray(data) ? data : (data.specialists ?? []))
    setLoading(false)
  }

  async function toggleVerify(id: string) {
    await fetch(`/api/admin/specialists/${id}/verify`, { method: "PATCH" })
    load()
  }

  async function deleteSpecialist(id: string) {
    if (!confirm("Сигурен ли си? Това ще изтрие профила безвъзвратно.")) return
    await fetch(`/api/admin/specialists/${id}/delete`, { method: "DELETE" })
    load()
  }

  useEffect(() => { load() }, [])

  const filtered = items
    .filter((s) => {
      if (filter === "pending") return !s.verified
      if (filter === "verified") return s.verified
      return true
    })
    .filter((s) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        s.user?.name?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.businessName?.toLowerCase().includes(q)
      )
    })

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <Link href={`/${locale}/admin`} className="text-[#1DB954] hover:underline text-sm">
            ← Админ панел
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Специалисти ({filtered.length})</h1>
        </div>

        {/* Филтри и търсене */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {(["all", "pending", "verified"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === f
                    ? "bg-[#1DB954] text-black"
                    : "bg-[#151528] text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {f === "all" ? "Всички" : f === "pending" ? "Чакащи" : "Верифицирани"}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Търси по име, имейл, град..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 bg-[#151528] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-[#1DB954]"
          />
        </div>

        {loading && <p className="text-gray-400">Зареждане...</p>}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-400">Няма специалисти.</p>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#151528] overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-[#0D0D1A]">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400">Специалист</th>
                <th className="px-4 py-3 text-left text-gray-400">Имейл</th>
                <th className="px-4 py-3 text-left text-gray-400">Град</th>
                <th className="px-4 py-3 text-left text-gray-400">План</th>
                <th className="px-4 py-3 text-left text-gray-400">Статус</th>
                <th className="px-4 py-3 text-left text-gray-400">Регистриран</th>
                <th className="px-4 py-3 text-left text-gray-400">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-medium">
                    {s.businessName || s.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{s.user?.email}</td>
                  <td className="px-4 py-3 text-gray-400">{s.city}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      s.subscriptionPlan === "PREMIUM"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : s.subscriptionPlan === "BASIC"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {s.subscriptionPlan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      s.verified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {s.verified ? "Верифициран" : "Чакащ"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(s.createdAt).toLocaleDateString("bg-BG")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleVerify(s.id)}
                        className={`text-xs font-medium hover:underline ${
                          s.verified ? "text-yellow-400" : "text-[#1DB954]"
                        }`}
                      >
                        {s.verified ? "Премахни верификация" : "Верифицирай"}
                      </button>
                      <Link
                        href={`/${locale}/specialist/${s.id}`}
                        className="text-xs text-blue-400 hover:underline"
                        target="_blank"
                      >
                        Виж
                      </Link>
                      <button
                        onClick={() => deleteSpecialist(s.id)}
                        className="text-xs text-red-400 hover:text-red-300 hover:underline"
                      >
                        Изтрий
                      </button>
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