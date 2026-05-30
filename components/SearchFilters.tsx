"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

const CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Враца", "Хасково",
  "Благоевград", "Велико Търново", "Габрово", "Пазарджик",
  "Перник", "Видин", "Монтана", "Кюстендил", "Ямбол", "Кърджали",
]

const SERVICES = [
  "електротехник", "вик майстор", "почистване", "хамали",
  "климатик монтаж", "боядисване", "шпакловка", "ремонт баня",
  "градинар", "гипсокартон", "дребни ремонти", "ремонт покриви",
]

interface SearchFiltersProps {
  locale: string
  initialQ?: string
  initialCity?: string
  initialCategory?: string
}

export default function SearchFilters({ locale, initialQ, initialCity, initialCategory }: SearchFiltersProps) {
  const router = useRouter()
  const [q, setQ] = useState(initialQ || "")
  const [city, setCity] = useState(initialCity || "")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (city) params.set("city", city)
    router.push(`/${locale}/search?${params.toString()}`)
  }

  function handleClear() {
    setQ("")
    setCity("")
    router.push(`/${locale}/search`)
  }

  return (
    <div className="mb-8 rounded-2xl border border-white/10 bg-[#151528] p-6">
      <h2 className="text-lg font-semibold mb-4 text-white">🔍 Намери специалист</h2>
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-xs text-gray-400 mb-1">Вид услуга</label>
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Пр: ВиК, климатик, почистване..."
            className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 text-sm"
            list="services-list"
          />
          <datalist id="services-list">
            {SERVICES.map(s => <option key={s} value={s} />)}
          </datalist>
        </div>

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

        <div className="flex gap-2 items-end">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-[#1DB954] py-3 font-semibold text-black hover:bg-[#1ed760] transition text-sm"
          >
            🔍 Търси
          </button>
          {(q || city) && (
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

      {/* Бързи услуги */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SERVICES.slice(0, 8).map(s => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setQ(s)
              const params = new URLSearchParams()
              params.set("q", s)
              if (city) params.set("city", city)
              router.push(`/${locale}/search?${params.toString()}`)
            }}
            className={`rounded-full px-3 py-1 text-xs border transition ${
              q === s
                ? "bg-[#1DB954] border-[#1DB954] text-black"
                : "border-white/10 text-gray-400 hover:border-[#1DB954]/40 hover:text-[#1DB954]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}