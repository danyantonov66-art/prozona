"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

interface Suggestion {
  id: string
  name: string
  parentName?: string
  description?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
  Specialist?: {
    user?: {
      name?: string
      email?: string
    }
  }
}

export default function SuggestionsAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`)
    }
  }, [status])

  useEffect(() => {
    fetch("/api/admin/suggestions")
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data)
        setLoading(false)
      })
  }, [])

  const updateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    setUpdating(id)
    const res = await fetch(`/api/admin/suggestions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      )
    }
    setUpdating(null)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white flex items-center justify-center">
        <p className="text-gray-400">Зареждане...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
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
            <div
              key={s.id}
              className="rounded-2xl border border-white/10 bg-[#151528] p-5"
            >
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
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    s.status === "PENDING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : s.status === "APPROVED"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {new Date(s.createdAt).toLocaleDateString("bg-BG")}
              </p>

              {/* Бутони за действие */}
              {s.status === "PENDING" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => updateStatus(s.id, "APPROVED")}
                    disabled={updating === s.id}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
                  >
                    {updating === s.id ? "..." : "✓ Одобри"}
                  </button>
                  <button
                    onClick={() => updateStatus(s.id, "REJECTED")}
                    disabled={updating === s.id}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    {updating === s.id ? "..." : "✗ Откажи"}
                  </button>
                </div>
              )}

              {/* Бутон за връщане към PENDING */}
              {s.status !== "PENDING" && (
                <div className="mt-4">
                  <button
                    onClick={() => updateStatus(s.id, "APPROVED")}
                    disabled={updating === s.id}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-white/40 disabled:opacity-50 transition-colors"
                  >
                    Промени статус
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}