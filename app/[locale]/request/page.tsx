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
]

const CATEGORIES = [
  { id: 9, name: "Ремонти и майстори" },
  { id: 11, name: "Почистване" },
  { id: 12, name: "Монтаж и дребни услуги" },
  { id: 8, name: "Градина и двор" },
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
            <p className="mb-6 text-gray-300">Специалисти в твоя район ще се свържат с теб скоро.</p>
            <Link href={`/${locale}`} className="inline-block rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black hover:bg-[#1ed760]">
              Към началото
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Търсиш специалист?</h1>
              <p className="mt-2 text-gray-400">Опиши от какво имаш нужда и специалисти ще се свържат с теб.</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#151528] p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

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

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-300">Опишете заявката *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Например: Търся монтаж на климатик 12k BTU в апартамент..."
                    className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 resize-none"
                  />
                </div>

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
                  {loading ? "Изпращане..." : "🚀 Изпрати заявката"}
                </button>

                <p className="text-center text-xs text-gray-500">
                  До 5 специалисти ще видят заявката ти. Безплатно за теб.
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