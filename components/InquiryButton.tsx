"use client"

import { useState, useRef, useEffect } from "react"
import { trackLead } from "@/lib/metaPixel"

const CITIES = [
  "Благоевград","Банско","Разлог","Петрич","Сандански","Гоце Делчев","Бургас","Айтос","Карнобат","Несебър","Поморие","Созопол","Средец","Царево","Варна","Балчик","Девня","Добрич","Каварна","Провадия","Велико Търново","Горна Оряховица","Елена","Павликени","Свищов","Видин","Белоградчик","Бойница","Враца","Бяла Слатина","Козлодуй","Мездра","Оряхово","Габрово","Дряново","Севлиево","Трявна","Добрич","Балчик","Генерал Тошево","Каварна","Тервел","Кърджали","Ардино","Джебел","Крумовград","Момчилград","Кюстендил","Дупница","Бобов дол","Рила","Ловеч","Луковит","Тетевен","Троян","Ябланица","Монтана","Берковица","Вършец","Лом","Вълчедръм","Пазарджик","Велинград","Панагюрище","Пещера","Батак","Перник","Брезник","Радомир","Трън","Плевен","Белене","Гулянци","Долна Митрополия","Левски","Никопол","Пловдив","Асеновград","Карлово","Пещера","Раковски","Сопот","Разград","Исперих","Кубрат","Лозница","Завет","Русе","Бяла","Борово","Две могили","Иваново","Сливо поле","Силистра","Дулово","Кайнарджа","Тутракан","Сливен","Котел","Нова Загора","Твърдица","Смолян","Девин","Доспат","Мадан","Рудозем","Чепеларе","София","Банкя","Ботевград","Елин Пелин","Етрополе","Ихтиман","Костинброд","Пирдоп","Самоков","Своге","Сливница","Стара Загора","Казанлък","Гълъбово","Чирпан","Раднево","Търговище","Омуртаг","Опака","Попово","Хасково","Димитровград","Ивайловград","Любимец","Маджарово","Минерални бани","Свиленград","Симеоновград","Стамболово","Тополовград","Шумен","Велики Преслав","Върбица","Каспичан","Нови пазар","Плиска","Смядово","Хитрино","Ямбол","Елхово","Стралджа","Болярово","Тунджа"
]

interface Props { specialistId: string; specialistName: string }

export default function InquiryButton({ specialistId, specialistName }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", city: "" })
  const [cityInput, setCityInput] = useState("")
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const cityRef = useRef<HTMLDivElement>(null)

  // Затвори suggestions при клик извън
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCityInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setCityInput(val)
    setForm((prev) => ({ ...prev, city: val }))
    if (val.length >= 2) {
      const filtered = CITIES.filter((c) =>
        c.toLowerCase().startsWith(val.toLowerCase())
      ).slice(0, 8)
      setCitySuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  function selectCity(city: string) {
    setCityInput(city)
    setForm((prev) => ({ ...prev, city }))
    setShowSuggestions(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, specialistId, categoryId: 1 }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Грешка")
     trackLead("Inquiry Submitted")
     if (typeof window !== "undefined" && (window as any).gtag) {
     (window as any).gtag("event", "inquiry_sent", {
      event_category: "engagement",
      event_label: specialistName,
      specialist_id: specialistId,
    })
  }
      setSuccess("Запитването е изпратено успешно!")
      setForm({ name: "", email: "", phone: "", message: "", city: "" })
      setCityInput("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760]">
        📩 Изпрати запитване
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151528] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Запитване към {specialistName}</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            {success ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
                {success}
                <button onClick={() => setOpen(false)} className="mt-3 block w-full rounded-xl bg-[#1DB954] py-2 font-semibold text-black">Затвори</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Вашето име" className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Имейл" className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Телефон (незадължително)" className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none" />

                {/* City autocomplete */}
                <div ref={cityRef} className="relative">
                  <input
                    name="city"
                    value={cityInput}
                    onChange={handleCityInput}
                    onFocus={() => cityInput.length >= 2 && setShowSuggestions(citySuggestions.length > 0)}
                    required
                    autoComplete="off"
                    placeholder="Населено място * (напишете 2 букви)"
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none"
                  />
                  {showSuggestions && (
                    <ul className="absolute z-10 mt-1 w-full rounded-xl border border-white/10 bg-[#1a1a35] overflow-hidden shadow-xl">
                      {citySuggestions.map((city) => (
                        <li
                          key={city}
                          onMouseDown={() => selectCity(city)}
                          className="cursor-pointer px-4 py-2 text-white hover:bg-[#1DB954]/20 transition"
                        >
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Опишете от какво имате нужда..." className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none resize-none" />
                {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60">
                  {loading ? "Изпращане..." : "Изпрати"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}