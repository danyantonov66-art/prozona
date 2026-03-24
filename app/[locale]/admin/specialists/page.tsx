"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface GalleryImage {
  id: number
  imageUrl: string
  title?: string
}

interface Specialist {
  id: string
  businessName?: string
  city: string
  verified: boolean
  subscriptionPlan: string
  createdAt: string
  user?: { name: string; email: string }
  GalleryImage?: GalleryImage[]
}

export default function AdminSpecialistsPage() {
  const params = useParams()
  const locale = params?.locale as string || "bg"

  const [items, setItems] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all")
  const [search, setSearch] = useState("")
  const [expandedGallery, setExpandedGallery] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState<string | null>(null)

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

  async function deleteGalleryImage(specialistId: string, imageId: number) {
    if (!confirm("Изтриваш тази снимка?")) return
    await fetch(`/api/admin/gallery/${imageId}`, { method: "DELETE" })
    setItems((prev) =>
      prev.map((s) =>
        s.id === specialistId
          ? { ...s, GalleryImage: s.GalleryImage?.filter((img) => img.id !== imageId) }
          : s
      )
    )
  }

  // ✅ Изпрати имейл за попълване на профил
  async function sendCompleteProfileEmail(s: Specialist) {
    if (!s.user?.email) return
    setSendingEmail(s.id)
    try {
      await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: s.user.email,
          name: s.businessName || s.user.name,
          type: "complete_profile",
          specialistId: s.id,
        })
      })
      setEmailSent(s.id)
      setTimeout(() => setEmailSent(null), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSendingEmail(null)
    }
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

        <div className="space-y-4">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-2xl border border-white/10 bg-[#151528] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-3">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="font-medium text-white">
                    {s.businessName || s.user?.name || "—"}
                  </span>
                  <span className="text-gray-400">{s.user?.email}</span>
                  <span className="text-gray-400">{s.city}</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    s.subscriptionPlan === "PREMIUM"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : s.subscriptionPlan === "BASIC"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {s.subscriptionPlan}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    s.verified
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {s.verified ? "Верифициран" : "Чакащ"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(s.createdAt).toLocaleDateString("bg-BG")}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => toggleVerify(s.id)}
                    className={`font-medium hover:underline ${
                      s.verified ? "text-yellow-400" : "text-[#1DB954]"
                    }`}
                  >
                    {s.verified ? "Премахни" : "Верифицирай"}
                  </button>

                  {/* ✅ Бутон за имейл */}
                  <button
                    onClick={() => sendCompleteProfileEmail(s)}
                    disabled={sendingEmail === s.id}
                    className={`font-medium hover:underline transition ${
                      emailSent === s.id
                        ? "text-[#1DB954]"
                        : "text-orange-400 hover:text-orange-300"
                    }`}
                  >
                    {emailSent === s.id
                      ? "✅ Изпратен!"
                      : sendingEmail === s.id
                      ? "Изпращане..."
                      : "📧 Попълни профил"}
                  </button>

                  <Link
                    href={`/${locale}/specialists/${s.id}`}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                  >
                    Виж
                  </Link>
                  <button
                    onClick={() => setExpandedGallery(expandedGallery === s.id ? null : s.id)}
                    className="text-purple-400 hover:underline"
                  >
                    🖼️ Галерия ({s.GalleryImage?.length || 0})
                  </button>
                  <button
                    onClick={() => deleteSpecialist(s.id)}
                    className="text-red-400 hover:text-red-300 hover:underline"
                  >
                    Изтрий
                  </button>
                </div>
              </div>

              {/* Галерия секция */}
              {expandedGallery === s.id && (
                <div className="border-t border-white/10 bg-[#0D0D1A] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-white">Галерия</h3>
                    <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
                      ⚠️ Провери за контактна информация
                    </span>
                  </div>
                  {!s.GalleryImage || s.GalleryImage.length === 0 ? (
                    <p className="text-sm text-gray-500">Няма качени снимки.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                      {s.GalleryImage.map((img) => (
                        <div key={img.id} className="relative group">
                          <img
                            src={img.imageUrl}
                            alt={img.title || "Галерия"}
                            className="h-24 w-full rounded-xl object-cover"
                          />
                          <button
                            onClick={() => deleteGalleryImage(s.id, img.id)}
                            className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}