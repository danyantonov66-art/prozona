"use client"

import Link from "next/link"
import { useState } from "react"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default function SuggestCategoryPage() {
  const [form, setForm] = useState({
    serviceName: "",
    categoryName: "",
    description: "",
    city: "",
    phone: "",
    email: ""
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const res = await fetch("/api/specialist/suggest-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        throw new Error("Неуспешно изпращане")
      }

      setSuccess("Предложението е изпратено и очаква одобрение от администратор.")
      setForm({
        serviceName: "",
        categoryName: "",
        description: "",
        city: "",
        phone: "",
        email: ""
      })
    } catch (err) {
      setError("Възникна проблем при изпращането. Опитай отново.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24 text-white">
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link href="/bg" className="text-[#1DB954] hover:underline">
            ← Начална страница
          </Link>
        </div>

        <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Предложи нова услуга
          </h1>

          <p className="text-gray-400 mb-8">
            Ако услугата, която предлагаш, все още не присъства в ProZona,
            изпрати предложение. То ще бъде прегледано от администратор.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Име на услугата
              </label>
              <input
                type="text"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                placeholder="Пример: Ремонт на покриви"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Основна категория
              </label>
              <input
                type="text"
                name="categoryName"
                value={form.categoryName}
                onChange={handleChange}
                placeholder="Пример: Строителство и ремонти"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Описание
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Опиши услугата накратко"
                rows={5}
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Град
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Пример: София"
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Телефон
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+359..."
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Имейл
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
                {success}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#1DB954] text-black font-semibold px-6 py-3 hover:bg-[#1ed760] transition disabled:opacity-60"
            >
              {loading ? "Изпращане..." : "Изпрати предложение"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}