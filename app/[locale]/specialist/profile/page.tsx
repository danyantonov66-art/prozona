"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { categories } from "@/lib/constants"

export default function SpecialistProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || "bg"

  const [form, setForm] = useState({
    businessName: "",
    description: "",
    city: "",
    phone: "",
    experienceYears: "",
    serviceAreas: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/login`)
  }, [status])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/specialist/me")
        .then((r) => r.json())
        .then((data) => {
          setForm({
            businessName: data.businessName || "",
            description: data.description || "",
            city: data.city || "",
            phone: data.phone || "",
            experienceYears: data.experienceYears || "",
            serviceAreas: data.serviceAreas?.join(", ") || "",
          })
          setLoading(false)
        })
    }
  }, [status])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/specialist/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: form.businessName,
          description: form.description,
          city: form.city,
          phone: form.phone,
          experienceYears: form.experienceYears ? parseInt(form.experienceYears) : null,
          serviceAreas: form.serviceAreas.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Грешка")
      setSuccess("Профилът е обновен успешно!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
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

        <h1 className="text-3xl font-bold mb-8">Редактирай профила</h1>

        <div className="bg-[#151528] border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-gray-300 mb-2">Име на фирма / бизнес (по избор)</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                placeholder="Например: Иван Иванов ЕООД"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Град *</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Телефон</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Години опит</label>
              <input
                type="number"
                value={form.experienceYears}
                onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                min="0"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Райони на обслужване</label>
              <input
                type="text"
                value={form.serviceAreas}
                onChange={(e) => setForm({ ...form, serviceAreas: e.target.value })}
                placeholder="София, Пловдив, Варна"
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
              <p className="text-xs text-gray-500 mt-1">Разделени със запетая</p>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Описание *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                placeholder="Опиши услугите си..."
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50 resize-none"
                required
              />
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mt-2">
                ⚠️ Описанието не може да съдържа телефон, имейл или линкове.
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
              disabled={saving}
              className="w-full rounded-xl bg-[#1DB954] text-black font-semibold px-6 py-3 hover:bg-[#1ed760] transition disabled:opacity-60"
            >
              {saving ? "Запазване..." : "Запази промените"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}