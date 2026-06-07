"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface GalleryImage {
  id: number
  imageUrl: string
  title?: string
}

interface Category {
  id: number
  name: string
  Subcategory: { id: number; name: string }[]
}

interface Specialist {
  id: string
  businessName?: string
  city: string
  description?: string
  verified: boolean
  subscriptionPlan: string
  createdAt: string
  user?: { name: string; email: string; image?: string | null }
  GalleryImage?: GalleryImage[]
  SpecialistCategory?: {
    Category: { id: number; name: string }
    Subcategory?: { id: number; name: string } | null
  }[]
}

interface EditCategory {
  categoryId: number | ""
  subcategoryId: number | ""
}

function containsPhone(text: string): boolean {
  const patterns = [
    /(\+359|00359)\s?[\d\s\-]{8,}/,
    /08\d[\d\s\-]{7,}/,
    /0\d{9}/,
    /\b\d{10}\b/,
    /\d{3,4}[\s\-]\d{3}[\s\-]\d{3,4}/,
  ]
  return patterns.some((p) => p.test(text))
}

function removePhones(text: string): string {
  return text
    .replace(/(\+359|00359)\s?[\d\s\-]{8,}/g, "")
    .replace(/08\d[\d\s\-]{7,}/g, "")
    .replace(/\b\d{10}\b/g, "")
    .replace(/\d{3,4}[\s\-]\d{3}[\s\-]\d{3,4}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
}

export default function AdminSpecialistsPage() {
  const params = useParams()
  const locale = params?.locale as string || "bg"

  const [items, setItems] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "phone">("all")
  const [search, setSearch] = useState("")
  const [expandedGallery, setExpandedGallery] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [editCity, setEditCity] = useState("")
  const [editCategories, setEditCategories] = useState<EditCategory[]>([{ categoryId: "", subcategoryId: "" }])
  const [editSaving, setEditSaving] = useState(false)
  const [cleaning, setCleaning] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/specialists", { cache: "no-store" })
    const data = await res.json()
    setItems(Array.isArray(data) ? data : (data.specialists ?? []))
    setLoading(false)
  }

  async function loadCategories() {
    const res = await fetch("/api/categories?withSubcategories=true")
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : (data.categories ?? []))
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

  async function clearProfileImage(id: string) {
    if (!confirm("Изтриваш профилната снимка?")) return
    await fetch(`/api/admin/specialists/${id}/clear-image`, { method: "PATCH" })
    load()
  }

  function startEdit(s: Specialist) {
    setEditingId(s.id)
    setEditDescription(s.description || "")
    setEditCity(s.city || "")
    if (s.SpecialistCategory && s.SpecialistCategory.length > 0) {
      setEditCategories(s.SpecialistCategory.map(sc => ({
        categoryId: sc.Category?.id ?? "",
        subcategoryId: sc.Subcategory?.id ?? "",
      })))
    } else {
      setEditCategories([{ categoryId: "", subcategoryId: "" }])
    }
  }

  function handleCategoryChange(idx: number, field: "categoryId" | "subcategoryId", value: string) {
    const updated = [...editCategories]
    if (field === "categoryId") {
      updated[idx] = { categoryId: value === "" ? "" : Number(value), subcategoryId: "" }
    } else {
      updated[idx] = { ...updated[idx], subcategoryId: value === "" ? "" : Number(value) }
    }
    setEditCategories(updated)
  }

  function addEditCategory() {
    setEditCategories(prev => [...prev, { categoryId: "", subcategoryId: "" }])
  }

  function removeEditCategory(idx: number) {
    setEditCategories(prev => prev.filter((_, i) => i !== idx))
  }

  async function saveEdit(id: string) {
    setEditSaving(true)
    const validCategories = editCategories.filter(ec => ec.categoryId !== "")
    await fetch(`/api/admin/specialists/${id}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: editDescription,
        city: editCity,
        categories: validCategories.map(ec => ({
          categoryId: ec.categoryId,
          subcategoryId: ec.subcategoryId || null,
        })),
      }),
    })
    setEditingId(null)
    setEditSaving(false)
    load()
  }

  async function cleanPhone(s: Specialist) {
    if (!s.description) return
    const cleaned = removePhones(s.description)
    setCleaning(s.id)
    await fetch(`/api/admin/specialists/${s.id}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: cleaned })
    })
    setCleaning(null)
    load()
  }

  async function sendCompleteProfileEmail(s: Specialist) {
    if (!s.user?.email) return
    setSendingEmail(s.id)
    try {
      await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: s.user.email,
          name: s.businessName || s.user?.name,
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

  async function sendCreditsRefundedEmail(s: Specialist) {
    if (!s.user?.email) return
    setSendingEmail(s.id)
    try {
      await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: s.user.email,
          name: s.businessName || s.user?.name,
          type: "credits_refunded",
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

  async function autoAssignCategory(id: string) {
    const res = await fetch(`/api/admin/specialists/${id}/auto-category`, { method: "POST" })
    const data = await res.json()
    if (data.success) {
      alert("✅ Категорията е зададена автоматично!")
      load()
    } else {
      alert(data.error || data.message || "Неуспешно")
    }
  }

  useEffect(() => {
    load()
    loadCategories()
  }, [])

  const filtered = items
    .filter((s) => {
      if (filter === "pending") return !s.verified
      if (filter === "verified") return s.verified
      if (filter === "phone") return containsPhone(s.description || "")
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

  const phoneCount = items.filter(s => containsPhone(s.description || "")).length

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
          {phoneCount > 0 && (
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-400">
              ⚠️ {phoneCount} с телефон в описанието
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "verified", "phone"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === f
                    ? f === "phone" ? "bg-red-500 text-white" : "bg-[#1DB954] text-black"
                    : "bg-[#151528] text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {f === "all" ? "Всички" : f === "pending" ? "Чакащи" : f === "verified" ? "Верифицирани" : `📞 С телефон (${phoneCount})`}
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
          {filtered.map((s) => {
            const hasPhone = containsPhone(s.description || "")
            return (
              <div key={s.id} className={`rounded-2xl border overflow-hidden ${hasPhone ? "border-red-500/40 bg-[#1a1015]" : "border-white/10 bg-[#151528]"}`}>
                <div className="flex flex-wrap items-center justify-between px-4 py-3 gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-medium text-white">
                      {s.businessName || s.user?.name || "—"}
                    </span>
                    <span className="text-gray-400">{s.user?.email}</span>
                    <span className="text-gray-400">{s.city}</span>

                    {s.SpecialistCategory && s.SpecialistCategory.length > 0 ? (
                      s.SpecialistCategory.map((sc, i) => (
                        <span key={i} className="text-xs bg-[#1DB954]/20 text-[#1DB954] px-2 py-1 rounded-full">
                          {sc.Category?.name}{sc.Subcategory ? ` / ${sc.Subcategory.name}` : ""}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                        ⚠️ Без категория
                      </span>
                    )}

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
                    {hasPhone && (
                      <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400">
                        📞 Телефон!
                      </span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {new Date(s.createdAt).toLocaleDateString("bg-BG")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs flex-wrap">
                    <button
                      onClick={() => toggleVerify(s.id)}
                      className={`font-medium hover:underline ${s.verified ? "text-yellow-400" : "text-[#1DB954]"}`}
                    >
                      {s.verified ? "Премахни" : "Верифицирай"}
                    </button>
                    <button
                      onClick={() => editingId === s.id ? setEditingId(null) : startEdit(s)}
                      className="font-medium text-blue-400 hover:underline"
                    >
                      {editingId === s.id ? "Затвори" : "✏️ Редактирай"}
                    </button>
                    <button
                      onClick={() => autoAssignCategory(s.id)}
                      className="font-medium text-purple-400 hover:underline"
                    >
                      🤖 Авто категория
                    </button>
                    {hasPhone && (
                      <button
                        onClick={() => cleanPhone(s)}
                        disabled={cleaning === s.id}
                        className="font-medium text-red-400 hover:text-red-300 hover:underline disabled:opacity-50"
                      >
                        {cleaning === s.id ? "Почиства..." : "🧹 Изчисти телефона"}
                      </button>
                    )}
                    <button
                      onClick={() => sendCompleteProfileEmail(s)}
                      disabled={sendingEmail === s.id}
                      className={`font-medium hover:underline transition ${
                        emailSent === s.id ? "text-[#1DB954]" : "text-orange-400 hover:text-orange-300"
                      }`}
                    >
                      {emailSent === s.id ? "✅ Изпратен!" : sendingEmail === s.id ? "Изпращане..." : "📧 Попълни профил"}
                    </button>
                    <button
                      onClick={() => sendCreditsRefundedEmail(s)}
                      disabled={sendingEmail === s.id}
                      className="font-medium text-yellow-400 hover:text-yellow-300 hover:underline transition"
                    >
                      💰 Върнати кредити
                    </button>
                    <Link href={`/${locale}/specialists/${s.id}`} className="text-blue-400 hover:underline" target="_blank">
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

                {editingId === s.id && (
                  <div className="border-t border-white/10 bg-[#0D0D1A] p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-white">✏️ Редактирай профила</h3>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Град</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full px-3 py-2 bg-[#151528] border border-gray-700 rounded-lg text-white text-sm focus:border-[#1DB954] outline-none"
                      />
                    </div>

                    {/* Множество категории */}
                    <div>
                      <label className="text-xs text-gray-400 mb-2 block">
                        Категории
                        <span className="ml-2 text-gray-600">(можеш да добавиш повече)</span>
                      </label>
                      {editCategories.map((ec, idx) => {
                        const catObj = categories.find(c => c.id === ec.categoryId)
                        const subs = catObj?.Subcategory ?? []
                        return (
                          <div key={idx} className="mb-2 rounded-lg border border-white/10 bg-[#151528] p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-500">Категория {idx + 1}</span>
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => removeEditCategory(idx)}
                                  className="text-red-400 text-xs hover:text-red-300"
                                >
                                  ✕ Премахни
                                </button>
                              )}
                            </div>
                            <select
                              value={ec.categoryId}
                              onChange={(e) => handleCategoryChange(idx, "categoryId", e.target.value)}
                              className="w-full px-3 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white text-sm focus:border-[#1DB954] outline-none mb-2"
                            >
                              <option value="">— Без категория —</option>
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                            {subs.length > 0 && (
                              <select
                                value={ec.subcategoryId}
                                onChange={(e) => handleCategoryChange(idx, "subcategoryId", e.target.value)}
                                className="w-full px-3 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white text-sm focus:border-[#1DB954] outline-none"
                              >
                                <option value="">— Без подкатегория —</option>
                                {subs.map((sub) => (
                                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                              </select>
                            )}
                          </div>
                        )
                      })}
                      <button
                        type="button"
                        onClick={addEditCategory}
                        className="w-full rounded-lg border border-[#1DB954]/30 text-[#1DB954] py-1.5 text-xs hover:bg-[#1DB954]/10 transition"
                      >
                        + Добави категория
                      </button>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Описание</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 bg-[#151528] border border-gray-700 rounded-lg text-white text-sm focus:border-[#1DB954] outline-none resize-none"
                      />
                      {editDescription && containsPhone(editDescription) && (
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-red-400">⚠️ Описанието съдържа телефонен номер!</p>
                          <button
                            onClick={() => setEditDescription(removePhones(editDescription))}
                            className="text-xs text-red-400 hover:text-red-300 underline"
                          >
                            Изчисти автоматично
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(s.id)}
                        disabled={editSaving}
                        className="px-4 py-2 bg-[#1DB954] text-black rounded-lg text-sm font-semibold hover:bg-[#1ed760] disabled:opacity-50"
                      >
                        {editSaving ? "Запазване..." : "Запази"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
                      >
                        Откажи
                      </button>
                    </div>
                  </div>
                )}

                {expandedGallery === s.id && (
                  <div className="border-t border-white/10 bg-[#0D0D1A] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-semibold text-white">Галерия</h3>
                      <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
                        ⚠️ Провери за контактна информация
                      </span>
                    </div>

                    {s.user?.image && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-400 mb-2">📸 Профилна снимка:</p>
                        <div className="relative group inline-block">
                          <img
                            src={s.user.image}
                            alt="Профилна снимка"
                            className="h-24 w-24 rounded-xl object-cover"
                          />
                          <button
                            onClick={() => clearProfileImage(s.id)}
                            className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs hover:bg-red-600"
                            title="Изтрий профилната снимка"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Задръж мишката върху снимката за да я изтриеш</p>
                      </div>
                    )}

                    {!s.GalleryImage || s.GalleryImage.length === 0 ? (
                      <p className="text-sm text-gray-500">Няма качени снимки в галерията.</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                        {s.GalleryImage.map((img) => (
                          <div key={img.id} className="relative group">
                            <img src={img.imageUrl} alt={img.title || "Галерия"} className="h-24 w-full rounded-xl object-cover" />
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
            )
          })}
        </div>
      </section>
    </main>
  )
}