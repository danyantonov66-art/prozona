"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

const BULGARIAN_CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Враца", "Хасково",
  "Благоевград", "Велико Търново", "Габрово", "Пазарджик",
  "Перник", "Видин", "Монтана", "Кюстендил", "Ямбол", "Кърджали",
  "Разград", "Силистра", "Търговище", "Ловеч", "Смолян", "Виден",
  "Самоков", "Казанлък", "Асеновград", "Горна Оряховица",
]

const CATEGORIES = [
  { id: 9, name: "Ремонти и майстори", icon: "🔨" },
  { id: 11, name: "Почистване", icon: "🧹" },
  { id: 12, name: "Монтаж и дребни услуги", icon: "🔧" },
  { id: 8, name: "Градина и двор", icon: "🌿" },
  { id: 3, name: "Климатици", icon: "❄️" },
  { id: 5, name: "Транспортни услуги", icon: "📦" },
  { id: 6, name: "Мебели и обзавеждане", icon: "🛋️" },
  { id: 7, name: "Авто услуги", icon: "🚗" },
  { id: 10, name: "Компютърни и IT услуги", icon: "💻" },
]

export default function RequestPage() {
  const params = useParams()
  const locale = (params?.locale as string) || "bg"

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    city: "",
    categoryId: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categoryId: Number(form.categoryId),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Грешка")
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-xl px-4 py-16">

        {success ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="mb-2 text-2xl font-bold text-green-400">Заявката е изпратена!</h2>
            <p className="mb-2 text-gray-300">Специалисти в твоя район ще се свържат с теб скоро.</p>
            <p className="mb-6 text-sm text-gray-500">Провери имейла си за потвърждение.</p>
            <Link href={`/${locale}`} className="inline-block rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black hover:bg-[#1ed760]">
              Към началото
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="mb-3 inline-flex items-center rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-1 text-sm text-[#86efac]">
                📩 Безплатна заявка
              </div>
              <h1 className="mb-2 text-3xl font-bold">Търсиш специалист?</h1>
              <p className="text-gray-400">Опиши от какво имаш нужда и специалисти ще се свържат с теб.</p>

              {/* Trust signals */}
              <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
                <span>✅ Безплатно</span>
                <span>✅ До 5 специалиста</span>
                <span>✅ Отговор до 24 часа</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Category */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Категория *</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                  >
                    <option value="">Изберете категория</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Град *</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                  >
                    <option value="">Изберете град</option>
                    {BULGARIAN_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Опишете заявката *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Например: Търся монтаж на климатик 12k BTU в апартамент на 3-ти етаж..."
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 resize-none"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Вашето име *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Иван Иванов"
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Имейл *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="ivan@example.com"
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Телефон (незадължително)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="0888 123 456"
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60 text-lg"
                >
                  {loading ? "Изпращане..." : "🚀 Изпрати заявката безплатно"}
                </button>

                <p className="text-center text-xs text-gray-500">
                  До 5 специалиста ще видят заявката ти. Безплатно за теб.
                </p>
                <p className="text-center text-xs text-gray-500 mt-1">
                  Или{" "}
                  <Link href={`/${locale}/specialists`} className="text-[#1DB954] hover:underline">
                    разгледай специалистите директно →
                  </Link>
                </p>
              </form>
            </div>
          </>
        )}
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}