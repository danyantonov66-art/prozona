"use client"

import Link from "next/link"
import { useState } from "react"
import { trackCompleteRegistration } from "@/lib/metaPixel"
import { categories } from "@/lib/constants"

export default function RegisterSpecialistPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    confirmPassword: "",
    service: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const selectedCategory = categories.find((c) => c.id === form.categoryId)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryId" ? { subcategoryId: "", service: "" } : {}),
      ...(name === "subcategoryId"
        ? {
            service:
              categories
                .find((c) => c.id === form.categoryId)
                ?.subcategories.find((s) => s.id === value)?.name || "",
          }
        : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess("")
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Паролите не съвпадат.")
      return
    }

    if (!form.categoryId || !form.subcategoryId) {
      setError("Моля, избери категория и подкатегория.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          password: form.password,
          role: "SPECIALIST",
          service: form.service,
          description: form.description,
          categoryId: form.categoryId,
          subcategoryId: form.subcategoryId,
        }),
      })

      if (!res.ok) throw new Error("Неуспешна регистрация")

      trackCompleteRegistration("Specialist Registration")
      setSuccess("Регистрацията е успешна. Можеш да влезеш в профила си.")
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        password: "",
        confirmPassword: "",
        service: "",
        description: "",
        categoryId: "",
        subcategoryId: "",
      })
    } catch (err) {
      setError("Възникна проблем при регистрацията. Провери данните и опитай отново.")
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
            Регистрация на специалист
          </h1>
          <p className="text-gray-400 mb-8">
            Създай профил в ProZona и започни да получаваш запитвания от клиенти.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Име и Имейл */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Име и фамилия</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Имейл</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
            </div>

            {/* Телефон и Град */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Телефон</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Град</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
            </div>

            {/* Категория */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Категория <span className="text-red-400">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                required
              >
                <option value="">-- Избери категория --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Подкатегория */}
            {selectedCategory && (
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Подкатегория <span className="text-red-400">*</span>
                </label>
                <select
                  name="subcategoryId"
                  value={form.subcategoryId}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                >
                  <option value="">-- Избери подкатегория --</option>
                  {selectedCategory.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.icon} {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Описание */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Кратко описание</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Опиши какво предлагаш"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50 resize-none"
              />
            </div>

            {/* Парола */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Парола</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Повтори паролата</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
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
              {loading ? "Регистрация..." : "Регистрирай се като специалист"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}