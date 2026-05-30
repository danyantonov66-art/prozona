"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Враца", "Хасково",
  "Благоевград", "Велико Търново", "Габрово", "Пазарджик",
  "Перник", "Видин", "Монтана", "Кюстендил", "Ямбол", "Кърджали",
]

interface Category {
  id: number
  name: string
  slug: string
  Subcategory: { id: number; name: string; slug: string }[]
}

interface SearchFiltersProps {
  locale: string
  initialQ?: string
  initialCity?: string
  initialCategory?: string
  categories: Category[]
}

export default function SearchFilters({ locale, initialQ, initialCity, initialCategory, categories }: SearchFiltersProps) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ || "")
  const [city, setCity] = useState(initialCity || "")
  const [categorySlug, setCategorySlug] = useState(initialCategory || "")
  const [subcategorySlug, setSubcategorySlug] = useState("")

  const selectedCategory = categories.find(c => c.slug === categorySlug)
  const subcategories = selectedCategory?.Subcategory ?? []

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (city) params.set("city", city)
    if (categorySlug) params.set("category", categorySlug)
    if (subcategorySlug) params.set("subcategory", subcategorySlug)
    router.push(`/${locale}/search?${params.toString()}`)
  }

  function handleClear() {
    setQ("")
    setCity("")
    setCategorySlug("")
    setSubcategorySlug("")
    router.push(`/${locale}/search`)
  }

  function handleCategoryClick(slug: string) {
    setCategorySlug(slug)
    setSubcategorySlug("")
    setQ("")
    const params = new URLSearchParams()
    if (city) params.set("city", city)
    params.set("category", slug)
    router.push(`/${locale}/search?${params.toString()}`)
  }

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-[#151528] p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">🔍 Намери специалист</h2>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Категория */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Категория</label>
          <select
            value={categorySlug}
            onChange={e => { setCategorySlug(e.target.value); setSubcategorySlug("") }}
            className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm"
          >
            <option value="">Всички категории</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Подкатегория */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Подкатегория</label>
          <select
            value={subcategorySlug}
            onChange={e => setSubcategorySlug(e.target.value)}
            disabled={subcategories.length === 0}
            className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm disabled:opacity-40"
          >
            <option value="">Всички</option>
            {subcategories.map(s => (
              <option key={s.id} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Град */}
        <div>
          <label className="block text-xs text-gray-400 mb-1">Град</label>
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm"
          >
            <option value="">Всички градове</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Бутони */}
        <div className="flex gap-2 items-end">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#1DB954] py-3 font-semibold text-black hover:bg-[#1ed760] transition text-sm"
          >
            🔍 Търси
          </button>
          {(q || city || categorySlug) && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl border border-white/20 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </form>

      {/* Бързи категории */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => handleCategoryClick(c.slug)}
            className={`rounded-full px-3 py-1 text-xs border transition ${
              categorySlug === c.slug
                ? "bg-[#1DB954] border-[#1DB954] text-black"
                : "border-white/10 text-gray-400 hover:border-[#1DB954]/40 hover:text-[#1DB954]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}