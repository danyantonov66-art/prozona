"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

interface PriceItem {
  id: number
  name: string
  price: number | null
  description?: string
  unit?: string
}

export default function PriceListPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || "bg"

  const [items, setItems] = useState<PriceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", price: "", description: "", unit: "лв." })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/login`)
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/specialist/me")
        .then((r) => r.json())
        .then((data) => {
          setItems(data.PriceListItem || [])
          setLoading(false)
        })
    }
  }, [status])

  async function addItem(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/specialist/price-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: form.price ? parseFloat(form.price) : null,
          description: form.description,
          unit: form.unit,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Грешка")
      setItems((prev) => [...prev, data.item])
      setForm({ name: "", price: "", description: "", unit: "лв." })
      setSuccess("Добавено!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteItem(id: number) {
    if (!confirm("Изтриваш тази услуга?")) return
    await fetch(`/api/specialist/price-list/${id}`, { method: "DELETE" })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#0D0D1A] text-white flex items-center justify-center">
        <p className="text-gray-400">Зареждане...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link href={`/${locale}/specialist/dashboard`} className="text-[#1DB954] hover:underline text-sm">
            ← Назад към Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Ценова листа</h1>

        {/* Добави услуга */}
        <div className="bg-[#151528] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Добави услуга</h2>
          <form onSubmit={addItem} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Услуга *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Например: Монтаж на кран"
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Цена</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Описание (по избор)</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Кратко описание"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
            </div>
            {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">{error}</div>}
            {success && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300 text-sm">{success}</div>}
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#1DB954] text-black font-semibold px-6 py-3 hover:bg-[#1ed760] transition disabled:opacity-60"
            >
              {saving ? "Добавяне..." : "+ Добави"}
            </button>
          </form>
        </div>

        {/* Списък */}
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#151528] p-8 text-center text-gray-400">
              Все още няма добавени услуги.
            </div>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#151528] px-4 py-3">
              <div>
                <p className="font-medium">{item.name}</p>
                {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
              </div>
              <div className="flex items-center gap-4">
                {item.price && (
                  <span className="font-semibold text-[#1DB954]">{item.price} лв.</span>
                )}
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-400 hover:text-red-300 text-sm hover:underline"
                >
                  Изтрий
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}