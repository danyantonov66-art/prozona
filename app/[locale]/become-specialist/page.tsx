"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { categories } from "../../../lib/constants"
import ProZonaHeader from "../../../components/header/ProZonaHeader"
import ProZonaFooter from "../../../components/footer/ProZonaFooter"

const BULGARIAN_CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Перник", "Хасково",
  "Ямбол", "Пазарджик", "Благоевград", "Велико Търново", "Враца",
  "Габрово", "Асеновград", "Видин", "Казанлък", "Кюстендил",
  "Монтана", "Силистра", "Ловеч", "Търговище", "Разград", "Смолян"
]

interface Props {
  params: { locale: string }
}

export default function BecomeSpecialistPage({ params }: Props) {
  const locale = params?.locale || "bg"
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
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")
    try {
      const res = await fetch("/api/specialist/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || "Нещо се обърка")
      setSuccess("Заявката е изпратена успешно. Ще получиш имейл за потвърждение.")
      setForm({ businessName: "", categoryId: "", subcategoryId: "", description: "", city: "", phone: "" })
    } catch (err: any) {
      setError(err.message || "Възникна проблем при изпращането.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white">
        <ProZonaHeader locale={locale} />
        <section className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 text-center">
            Зареждане...
          </div>
        </section>
        <ProZonaFooter locale={locale} />
      </main>
    )
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white">
        <ProZonaHeader locale={locale} />
        <section className="max-w-3xl mx-auto px-4 py-16">

          {/* Банер 3 месеца безплатно */}
          <div className="mb-8 rounded-2xl border border-[#1DB954]/30 bg-gradient-to-r from-[#1DB954]/10 to-[#151528] p-6 text-center">
            <div className="mb-2 inline-block rounded-full bg-[#1DB954] px-4 py-1 text-sm font-bold text-black">
              🎉 Стартова оферта
            </div>
            <h2 className="mt-3 text-2xl font-bold">3 месеца Premium безплатно</h2>
            <p className="mt-2 text-gray-300">
              Регистрирай се сега и получи <strong className="text-white">Premium план безплатно за 3 месеца</strong> — топ позиция, неограничени снимки и 20 стартови кредита.
            </p>
            <p className="mt-2 text-sm text-[#1DB954]">⚡ Първите 200 специалисти получават 6 месеца безплатно!</p>
          </div>

          <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 md:p-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Трябва да сте влезли в профила си
            </h1>
            <p className="text-gray-400 mb-8">
              За да подадете заявка като специалист, първо влезте в профила си.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center justify-center bg-[#1DB954] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#1ed760] transition"
              >
                Вход
              </Link>
              <Link
                href={`/${locale}/register`}
                className="inline-flex items-center justify-center border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition"
              >
                Регистрация
              </Link>
            </div>
          </div>
        </section>
        <ProZonaFooter locale={locale} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="max-w-3xl mx-auto px-4 py-16">

        <div className="mb-6">
          <Link href={`/${locale}`} className="text-[#1DB954] hover:underline">
            ← Начална страница
          </Link>
        </div>

        {/* Банер 3 месеца безплатно */}
        <div className="mb-8 rounded-2xl border border-[#1DB954]/30 bg-gradient-to-r from-[#1DB954]/10 to-[#151528] p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🎉</span>
            <div>
              <div className="mb-1 inline-block rounded-full bg-[#1DB954] px-3 py-0.5 text-xs font-bold text-black">
                Стартова оферта
              </div>
              <h2 className="text-xl font-bold">3 месеца Premium безплатно</h2>
              <p className="mt-1 text-sm text-gray-300">
                Регистрирай се сега и получи <strong className="text-white">Premium план безплатно за 3 месеца</strong> — топ позиция, неограничени снимки и 20 стартови кредита. Без кредитна карта.
              </p>
              <p className="mt-2 text-sm text-[#1DB954] font-semibold">
                ⚡ Първите 200 специалисти получават 6 месеца безплатно!
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Стани специалист в ProZona
          </h1>
          <p className="text-gray-400 mb-8">
            Попълни формата, за да публикуваш услугите си и да започнеш да получаваш запитвания от клиенти.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Име на фирма или бранд</label>
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
              <label className="block text-sm text-gray-300 mb-2">Категория *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              >
                <option value="">Изберете категория</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Подкатегория *</label>
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
                  <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Описание на услугите *</label>
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
              <label className="block text-sm text-gray-300 mb-2">Град *</label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              >
                <option value="">Изберете град</option>
                {BULGARIAN_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Телефон за връзка *</label>
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
              {loading ? "Изпращане..." : "Изпрати заявка и вземи 3 месеца безплатно"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Без кредитна карта. Без скрити такси. Отказ по всяко време.
            </p>
          </form>
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}