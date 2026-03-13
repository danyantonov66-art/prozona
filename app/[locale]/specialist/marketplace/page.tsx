"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"

const BULGARIAN_CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Враца", "Хасково",
  "Благоевград", "Велико Търново", "Габрово", "Пазарджик",
]

function timeAgo(date: string) {
  const ms = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `преди ${minutes} мин`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `преди ${hours} ч`
  return `преди ${Math.floor(hours / 24)} дни`
}

export default function MarketplacePage() {
  const params = useParams()
  const locale = (params?.locale as string) || "bg"

  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCity, setFilterCity] = useState("")
  const [unlocking, setUnlocking] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Record<string, any>>({})

  async function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterCity) params.set("city", filterCity)
    const res = await fetch(`/api/inquiries/marketplace?${params}`, { cache: "no-store" })
    const data = await res.json()
    setInquiries(data.inquiries ?? [])
    setLoading(false)
  }

  async function unlock(id: string) {
    if (!confirm("Отключването ще използва 2 кредита. Продължи?")) return
    setUnlocking(id)
    try {
      const res = await fetch(`/api/inquiries/${id}/unlock`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || "Грешка при отключване")
        return
      }
      setContacts((prev) => ({ ...prev, [id]: data.contact }))
      load()
    } catch {
      alert("Грешка при отключване")
    } finally {
      setUnlocking(null)
    }
  }

  useEffect(() => { load() }, [filterCity])

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-5xl px-4 py-10">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📋 Заявки от клиенти</h1>
            <p className="mt-1 text-sm text-gray-400">Отключи контакт с кредити и свържи се директно с клиента</p>
          </div>
          <Link href={`/${locale}/specialist/buy-credits`}
            className="rounded-xl border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-2 text-sm font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition">
            ⚡ Купи кредити
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#151528] px-4 py-2 text-sm text-white outline-none focus:border-[#1DB954]/50"
          >
            <option value="">Всички градове</option>
            {BULGARIAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Зареждане...</div>
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center text-gray-400">Няма налични заявки в момента.</div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="rounded-2xl border border-white/10 bg-[#151528] p-6">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold">{inq.title}</h2>
                    {inq.isNew && (
                      <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-400">🔥 Нова</span>
                    )}
                    {inq.isUrgent && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">⚡ Спешно</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{timeAgo(inq.createdAt)}</span>
                </div>

                <div className="mb-3 flex flex-wrap gap-3 text-sm text-gray-400">
                  <span>📍 {inq.city}</span>
                  <span>👥 {inq.unlockedCount}/5 специалисти</span>
                </div>

                <p className="mb-4 text-sm text-gray-300 leading-6">{inq.message}</p>

                {contacts[inq.id] || inq.isUnlocked ? (
                  <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
                    <p className="mb-1 text-sm font-semibold text-green-400">✅ Контакт отключен</p>
                    <p className="text-sm text-white">Име: {contacts[inq.id]?.name || inq.contact?.name}</p>
                    {(contacts[inq.id]?.phone || inq.contact?.phone) && (
                      <p className="text-sm text-white">Телефон: {contacts[inq.id]?.phone || inq.contact?.phone}</p>
                    )}
                    <p className="text-sm text-white">Имейл: {contacts[inq.id]?.email || inq.contact?.email}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      💳 Цена за контакт: <span className="font-semibold text-white">{inq.creditPrice} кредита</span>
                    </span>
                    <button
                      onClick={() => unlock(inq.id)}
                      disabled={unlocking === inq.id}
                      className="rounded-xl bg-[#1DB954] px-5 py-2 font-semibold text-black transition hover:bg-[#1ed760] disabled:opacity-60"
                    >
                      {unlocking === inq.id ? "Отключване..." : "Отключи контакт"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}