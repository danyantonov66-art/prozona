"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { categories } from "../../../lib/constants"

export default function BecomeSpecialistPage() {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    businessName: "",
    categoryId: "",
    subcategoryId: "",
    description: "",
    city: "",
    phone: ""
  })

  const subcategories = useMemo(() => {
    const selectedCategory = categories.find((c) => c.id === form.categoryId)
    return selectedCategory?.subcategories ?? []
  }, [form.categoryId])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    setForm((prev) => {
      if (name === "categoryId") {
        return {
          ...prev,
          categoryId: value,
          subcategoryId: ""
        }
      }

      return {
        ...prev,
        [name]: value
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const res = await fetch("/api/specialist/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || "Нещо се обърка")
      }

      setSuccess("Заявката е изпратена успешно.")
      setForm({
        businessName: "",
        categoryId: "",
        subcategoryId: "",
        description: "",
        city: "",
        phone: ""
      })
    } catch (err: any) {
      setError(err.message || "Възникна проблем при изпращането.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#0D0D1A] pt-24 text-white">
        <section className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 md:p-10 text-center">
            Зареждане...
          </div>
        </section>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] pt-24 text-white">
        <section className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 md:p-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Трябва да сте влезли в профила си
            </h1>

            <p className="text-gray-400 mb-8">
              За да подадете заявка като специалист, първо влезте в профила си.
            </p>

            <Link
              href="/bg/login"
              className="inline-flex items-center justify-center bg-[#1DB954] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#1ed760] transition"
            >
              Вход
            </Link>
          </div>
        </section>
      </main>
    )
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
            Стани специалист в ProZona
          </h1>

          <p className="text-gray-400 mb-8">
            Попълни формата, за да публикуваш услугите си и да започнеш да получаваш
            запитвания от клиенти.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Име на фирма или бранд
              </label>
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Пример: Иван Иванов ЕТ"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Категория *
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              >
                <option value="">Изберете категория</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Подкатегория *
              </label>
              <select
                name="subcategoryId"
                value={form.subcategoryId}
                onChange={handleChange}
                required
                disabled={!form.categoryId}
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50 disabled:opacity-60"
              >
                <option value="">Изберете подкатегория</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Описание на услугите *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Опишете какво предлагате, опита си, квалификации и как работите."
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Град *
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Пример: София"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Телефон за връзка *
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+359..."
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
              {loading ? "Изпращане..." : "Изпрати заявка"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
