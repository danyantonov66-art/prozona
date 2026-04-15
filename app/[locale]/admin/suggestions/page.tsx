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
  specialistId?: string
  Specialist?: {
    user?: {
      name?: string
      email?: string
    }
  }
}

interface Category {
  id: number
  name: string
  slug: string
}

interface Subcategory {
  id: number
  name: string
  slug: string
  categoryId: number
}

interface ApproveModal {
  suggestion: Suggestion
  // Избор на начин на поставяне
  mode: "subcategory" | "new_category" | null
  // Съществуваща категория
  selectedCategoryId: number | null
  // Съществуваща подкатегория
  selectedSubcategoryId: number | null
  // Ново създаване
  newCategoryName: string
  newSubcategoryName: string
  // Дали да се добавя нова подкатегория
  addNewSubcategory: boolean
}

export default function SuggestionsAdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = params?.locale as string

  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [modal, setModal] = useState<ApproveModal | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`)
    }
  }, [status])

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/suggestions").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([suggs, cats]) => {
      setSuggestions(suggs)
      // /api/categories връща { categories: [...] } или директен масив
      const catList = Array.isArray(cats) ? cats : cats.categories ?? []
      setCategories(catList)
      setLoading(false)
    })
  }, [])

  // Зареди подкатегориите при избор на категория
  useEffect(() => {
    if (!modal?.selectedCategoryId) {
      setSubcategories([])
      return
    }
    fetch(`/api/categories/${modal.selectedCategoryId}/subcategories`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.subcategories ?? []
        setSubcategories(list)
      })
      .catch(() => setSubcategories([]))
  }, [modal?.selectedCategoryId])

  const openApproveModal = (s: Suggestion) => {
    setModal({
      suggestion: s,
      mode: null,
      selectedCategoryId: null,
      selectedSubcategoryId: null,
      newCategoryName: s.name,
      newSubcategoryName: s.name,
      addNewSubcategory: false,
    })
  }

  const closeModal = () => {
    setModal(null)
    setSubcategories([])
  }

  const handleApprove = async () => {
    if (!modal) return
    const { suggestion, mode, selectedCategoryId, selectedSubcategoryId, newCategoryName, newSubcategoryName, addNewSubcategory } = modal

    if (!mode) {
      alert("Моля, избери начин на поставяне.")
      return
    }

    if (mode === "subcategory" && !selectedCategoryId) {
      alert("Моля, избери категория.")
      return
    }

    if (mode === "new_category" && !newCategoryName.trim()) {
      alert("Моля, въведи името на новата категория.")
      return
    }

    setUpdating(suggestion.id)

    const payload: Record<string, any> = { status: "APPROVED" }

    if (mode === "subcategory") {
      payload.categoryId = selectedCategoryId
      if (addNewSubcategory && newSubcategoryName.trim()) {
        payload.newSubcategoryName = newSubcategoryName
      } else if (selectedSubcategoryId) {
        payload.subcategoryId = selectedSubcategoryId
      }
    } else if (mode === "new_category") {
      payload.newCategoryName = newCategoryName
      if (newSubcategoryName.trim()) {
        payload.newSubcategoryName = newSubcategoryName
      }
    }

    const res = await fetch(`/api/admin/suggestions/${suggestion.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      setSuggestions((prev) =>
        prev.map((s) => (s.id === suggestion.id ? { ...s, status: "APPROVED" } : s))
      )
      closeModal()
    } else {
      alert("Грешка при одобрение.")
    }
    setUpdating(null)
  }

  const rejectSuggestion = async (id: string) => {
    setUpdating(id)
    const res = await fetch(`/api/admin/suggestions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    })
    if (res.ok) {
      setSuggestions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: "REJECTED" } : s))
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
            <div key={s.id} className="rounded-2xl border border-white/10 bg-[#151528] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">{s.name}</p>
                  {s.parentName && (
                    <p className="text-sm text-gray-400">Предложена категория: {s.parentName}</p>
                  )}
                  {s.description && (
                    <p className="mt-2 text-gray-300">{s.description}</p>
                  )}
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
                  {s.status === "PENDING" ? "Изчаква" : s.status === "APPROVED" ? "Одобрено" : "Отказано"}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {new Date(s.createdAt).toLocaleDateString("bg-BG")}
              </p>

              {s.status === "PENDING" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => openApproveModal(s)}
                    disabled={updating === s.id}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
                  >
                    ✔ Одобри
                  </button>
                  <button
                    onClick={() => rejectSuggestion(s.id)}
                    disabled={updating === s.id}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                  >
                    {updating === s.id ? "..." : "✘ Откажи"}
                  </button>
                </div>
              )}

              {s.status !== "PENDING" && (
                <div className="mt-4">
                  <button
                    onClick={() => openApproveModal(s)}
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

      {/* МОДАЛ ЗА ОДОБРЕНИЕ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#151528] p-6">
            <h2 className="mb-1 text-xl font-bold text-white">Одобри предложение</h2>
            <p className="mb-5 text-gray-400 text-sm">
              Услуга: <span className="text-white font-medium">{modal.suggestion.name}</span>
            </p>

            {/* Стъпка 1: Избор на начин */}
            <p className="mb-3 text-sm font-semibold text-gray-300">Как да се добави?</p>
            <div className="mb-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => setModal((m) => m ? { ...m, mode: "subcategory", selectedCategoryId: null, selectedSubcategoryId: null } : m)}
                className={`rounded-xl border p-3 text-sm font-medium transition-colors ${
                  modal.mode === "subcategory"
                    ? "border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954]"
                    : "border-white/10 text-gray-300 hover:border-white/30"
                }`}
              >
                📁 Подкатегория в съществуваща категория
              </button>
              <button
                onClick={() => setModal((m) => m ? { ...m, mode: "new_category", selectedCategoryId: null, selectedSubcategoryId: null } : m)}
                className={`rounded-xl border p-3 text-sm font-medium transition-colors ${
                  modal.mode === "new_category"
                    ? "border-[#1DB954] bg-[#1DB954]/10 text-[#1DB954]"
                    : "border-white/10 text-gray-300 hover:border-white/30"
                }`}
              >
                ✨ Нова главна категория
              </button>
            </div>

            {/* Подкатегория в съществуваща категория */}
            {modal.mode === "subcategory" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Категория *</label>
                  <select
                    value={modal.selectedCategoryId ?? ""}
                    onChange={(e) => setModal((m) => m ? {
                      ...m,
                      selectedCategoryId: Number(e.target.value) || null,
                      selectedSubcategoryId: null,
                      addNewSubcategory: false,
                    } : m)}
                    className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option value="">-- Избери категория --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {modal.selectedCategoryId && (
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Подкатегория</label>
                    <select
                      value={modal.addNewSubcategory ? "new" : (modal.selectedSubcategoryId ?? "")}
                      onChange={(e) => {
                        if (e.target.value === "new") {
                          setModal((m) => m ? { ...m, addNewSubcategory: true, selectedSubcategoryId: null } : m)
                        } else {
                          setModal((m) => m ? { ...m, addNewSubcategory: false, selectedSubcategoryId: Number(e.target.value) || null } : m)
                        }
                      }}
                      className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                    >
                      <option value="">-- Само в категорията (без подкатегория) --</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                      <option value="new">➕ Създай нова подкатегория</option>
                    </select>
                  </div>
                )}

                {modal.addNewSubcategory && (
                  <div>
                    <label className="mb-1 block text-sm text-gray-400">Име на новата подкатегория *</label>
                    <input
                      type="text"
                      value={modal.newSubcategoryName}
                      onChange={(e) => setModal((m) => m ? { ...m, newSubcategoryName: e.target.value } : m)}
                      className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                      placeholder="Напр. Подово отопление"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Нова главна категория */}
            {modal.mode === "new_category" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-400">Ime на новата категория *</label>
                  <input
                    type="text"
                    value={modal.newCategoryName}
                    onChange={(e) => setModal((m) => m ? { ...m, newCategoryName: e.target.value } : m)}
                    className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                    placeholder="Напр. Компютърни услуги"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-400">
                    Подкатегория (незадължително)
                  </label>
                  <input
                    type="text"
                    value={modal.newSubcategoryName}
                    onChange={(e) => setModal((m) => m ? { ...m, newSubcategoryName: e.target.value } : m)}
                    className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#1DB954]"
                    placeholder="Напр. Поддръжка на лаптопи"
                  />
                  <p className="mt-1 text-xs text-gray-500">Остави празно ако услугата е директно в категорията</p>
                </div>
              </div>
            )}

            {/* Бутони */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleApprove}
                disabled={updating === modal.suggestion.id}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
              >
                {updating === modal.suggestion.id ? "Запазване..." : "✔ Потвърди одобрение"}
              </button>
              <button
                onClick={closeModal}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-white/40 transition-colors"
              >
                Отказ
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}