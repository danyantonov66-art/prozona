"use client"

import { useState } from "react"
import Link from "next/link"

interface Specialist {
  id: string
  businessName?: string | null
  city?: string | null
  description?: string | null
  user?: { name?: string | null; image?: string | null } | null
  SpecialistCategory?: {
    Category?: { name?: string | null } | null
    Subcategory?: { name?: string | null } | null
  }[]
}

interface SpecialistsListProps {
  specialists: Specialist[]
  locale: string
}

const CITIES = [
  "София","Пловдив","Варна","Бургас","Русе","Стара Загора","Плевен","Сливен","Добрич","Шумен","Враца","Хасково","Благоевград","Велико Търново","Габрово","Пазарджик","Перник","Видин","Монтана","Кюстендил","Ямбол","Кърджали","Разград","Силистра","Търговище","Ловеч","Смолян","Самоков","Казанлък","Асеновград",
]

export default function SpecialistsList({ specialists, locale }: SpecialistsListProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cityInput, setCityInput] = useState("")
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", city: "" })
  const [urgent, setUrgent] = useState(false)

  const MAX_SELECT = 3

  function toggleSelect(id: string) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= MAX_SELECT) return prev
      return [...prev, id]
    })
  }

  function handleCityInput(val: string) {
    setCityInput(val)
    setForm(prev => ({ ...prev, city: val }))
    if (val.length >= 2) {
      const filtered = CITIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 6)
      setCitySuggestions(filtered)
      setShowCitySuggestions(filtered.length > 0)
    } else {
      setShowCitySuggestions(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await Promise.all(selected.map(specialistId =>
        fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            specialistId,
            categoryId: 1,
            urgent,
            message: urgent ? `⚡ СПЕШНО: ${form.message}` : form.message,
          }),
        })
      ))
      setSuccess(true)
      setSelected([])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Grid със специалисти */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {specialists.map((specialist) => {
          const image = specialist.user?.image || null
          const name = specialist.businessName || specialist.user?.name || "Специалист"
          const cats = specialist.SpecialistCategory
            ?.map((sc) => sc.Subcategory?.name || sc.Category?.name)
            .filter(Boolean)
            .slice(0, 2) ?? []
          const isSelected = selected.includes(specialist.id)
          const isDisabled = !isSelected && selected.length >= MAX_SELECT

          return (
            <div
              key={specialist.id}
              className={`relative rounded-2xl border bg-[#151528] transition-all ${
                isSelected
                  ? "border-[#1DB954] ring-2 ring-[#1DB954]/30"
                  : isDisabled
                  ? "border-white/5 opacity-50"
                  : "border-white/10 hover:border-[#1DB954]/40"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleSelect(specialist.id)}
                disabled={isDisabled}
                className={`absolute top-3 right-3 z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#1DB954] border-[#1DB954] text-black"
                    : "bg-[#0D0D1A] border-white/30 hover:border-[#1DB954]"
                }`}
              >
                {isSelected && <span className="text-xs font-bold">✓</span>}
              </button>

              <Link href={`/${locale}/specialists/${specialist.id}`} className="block p-5">
                <div className="mb-4">
                  {image ? (
                    <img src={image} alt={name} className="h-40 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-xl bg-[#23233A] text-4xl font-bold text-[#1DB954]">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h2 className="mb-1 text-xl font-semibold text-white">{name}</h2>
                {specialist.city && (
                  <p className="mb-2 text-sm text-gray-400">📍 {specialist.city}</p>
                )}
                {cats.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {cats.map((cat, i) => (
                      <span key={i} className="rounded-full bg-[#1DB954]/10 px-2 py-0.5 text-xs text-[#1DB954]">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                <p className="line-clamp-3 text-sm text-gray-300">
                  {specialist.description || "Няма добавено описание."}
                </p>
              </Link>

              {/* Бутон за избор */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => toggleSelect(specialist.id)}
                  disabled={isDisabled}
                  className={`w-full rounded-xl py-2 text-sm font-semibold transition ${
                    isSelected
                      ? "bg-[#1DB954] text-black"
                      : isDisabled
                      ? "bg-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-white/10 text-white hover:bg-[#1DB954]/20 hover:text-[#1DB954]"
                  }`}
                >
                  {isSelected ? "✓ Избран" : selected.length >= MAX_SELECT ? "Максимум 3" : "+ Избери"}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Floating bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="rounded-2xl bg-[#1DB954] p-4 shadow-2xl flex items-center justify-between gap-4">
            <div>
              <p className="text-black font-bold text-sm">
                {selected.length} специалист{selected.length > 1 ? "а" : ""} избран{selected.length > 1 ? "и" : ""}
              </p>
              <p className="text-black/70 text-xs">Изпрати едно запитване до всички</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected([])}
                className="rounded-xl bg-black/20 px-3 py-2 text-black text-sm hover:bg-black/30 transition"
              >
                ✕
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-black px-4 py-2 text-[#1DB954] font-bold text-sm hover:bg-gray-900 transition"
              >
                📩 Изпрати
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Форма за запитване */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151528] p-6">
            {success ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Запитванията са изпратени!</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Изпратено до {selected.length > 0 ? selected.length : "избраните"} специалиста. Очаквай отговор скоро.
                </p>
                <button
                  onClick={() => { setShowForm(false); setSuccess(false) }}
                  className="w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black"
                >
                  Затвори
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">Изпрати запитване</h2>
                    <p className="text-gray-400 text-sm mt-1">
                      До {selected.length} специалист{selected.length > 1 ? "а" : ""} едновременно
                    </p>
                  </div>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
                </div>

                {/* Спешно */}
                <label className="flex items-center gap-3 mb-4 cursor-pointer rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <input
                    type="checkbox"
                    checked={urgent}
                    onChange={e => setUrgent(e.target.checked)}
                    className="w-4 h-4 accent-red-500"
                  />
                  <div>
                    <span className="text-red-400 font-semibold text-sm">⚡ Спешно запитване</span>
                    <p className="text-gray-500 text-xs">Специалистите ще бъдат уведомени незабавно</p>
                  </div>
                </label>

                <div className="flex gap-3 text-xs text-gray-500 mb-4">
                  <span>✅ Безплатно</span>
                  <span>✅ Без регистрация</span>
                  <span>✅ До {selected.length} специалиста</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="Вашето ime"
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none text-sm"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                    placeholder="Имейл"
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none text-sm"
                  />
                  <input
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder={urgent ? "Телефон * (задължително)" : "Телефон (незадължително)"}
                    required={urgent}
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none text-sm"
                  />

                  {/* City autocomplete */}
                  <div className="relative">
                    <input
                      value={cityInput}
                      onChange={e => handleCityInput(e.target.value)}
                      required
                      autoComplete="off"
                      placeholder="Населено място * (напишете 2 букви)"
                      className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none text-sm"
                    />
                    {showCitySuggestions && (
                      <ul className="absolute z-10 mt-1 w-full rounded-xl border border-white/10 bg-[#1a1a35] overflow-hidden shadow-xl">
                        {citySuggestions.map(city => (
                          <li
                            key={city}
                            onMouseDown={() => { setCityInput(city); setForm(p => ({ ...p, city })); setShowCitySuggestions(false) }}
                            className="cursor-pointer px-4 py-2 text-white hover:bg-[#1DB954]/20 transition text-sm"
                          >
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    required
                    rows={3}
                    placeholder={urgent ? "Опиши аварията..." : "Опишете от какво имате нужда..."}
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none resize-none text-sm"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded-xl py-3 font-semibold transition disabled:opacity-60 ${
                      urgent ? "bg-red-600 text-white hover:bg-red-700" : "bg-[#1DB954] text-black hover:bg-[#1ed760]"
                    }`}
                  >
                    {loading ? "Изпращане..." : `${urgent ? "⚡" : "📩"} Изпрати до ${selected.length} специалист${selected.length > 1 ? "а" : ""}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}