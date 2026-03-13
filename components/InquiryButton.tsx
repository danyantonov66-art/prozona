"use client"

import { useState } from "react"

const BULGARIAN_CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Враца", "Хасково",
  "Благоевград", "Велико Търново", "Габрово", "Пазарджик",
]

interface Props {
  specialistId: string
  specialistName: string
}

export default function InquiryButton({ specialistId, specialistName }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    city: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          specialistId,
          categoryId: 1,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Нещо се обърка")
      setSuccess("Запитването е изпратено успешно!")
      setForm({ name: "", email: "", phone: "", message: "", city: "" })
    } catch (err: any) {
      setError(err.message || "Възникна проблем")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#1DB954] px-6 py-3 font-semibold text-black transition hover:bg-[#1ed760]"
      >
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
                <button onClick={() => setOpen(false)} className="mt-3 block w-full rounded-xl bg-[#1DB954] py-2 font-semibold text-black">
                  Затвори
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Вашето име"
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Имейл"
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Телефон (незадължително)"
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                />
                <select
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                >
                  <option value="">Изберете град *</option>
                  {BULGARIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Опишете от какво имате нужда..."
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 resize-none"
                />
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#1DB954] py-3 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
                >
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