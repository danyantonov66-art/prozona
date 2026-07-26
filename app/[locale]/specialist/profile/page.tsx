"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { UploadButton } from "@/lib/uploadthing"
import ChangePasswordSection from "@/components/ChangePasswordSection"

interface SelectedCategory {
  categoryId: string
  subcategoryId: string
}

interface DbCategory {
  id: number
  name: string
  Subcategory: { id: number; name: string }[]
}

function getYoutubeEmbedUrl(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[7].length === 11 ? match[7] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

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
    videoUrl: "",
    selectedCategories: [{ categoryId: "", subcategoryId: "" }] as SelectedCategory[],
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [dbCategories, setDbCategories] = useState<DbCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") router.push(`/${locale}/login`)
  }, [status])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setDbCategories)
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/specialist/me")
        .then(async (r) => {
          if (r.status === 404) {
            router.push(`/${locale}/dashboard`)
            return null
          }
          return r.json()
        })
        .then((data) => {
          if (!data) return

          const existingCats = data.SpecialistCategory?.length > 0
            ? data.SpecialistCategory.map((sc: any) => ({
                categoryId: String(sc.categoryId || ""),
                subcategoryId: sc.subcategoryId ? String(sc.subcategoryId) : "",
              }))
            : [{ categoryId: "", subcategoryId: "" }]

          setForm({
            businessName: data.businessName || "",
            description: data.description || "",
            city: data.city || "",
            phone: data.phone || "",
            experienceYears: data.experienceYears || "",
            serviceAreas: data.serviceAreas?.join(", ") || "",
            videoUrl: data.videoUrl || "",
            selectedCategories: existingCats,
          })
          setProfileImage(data.user?.image || null)
          setLoading(false)
        })
    }
  }, [status])

  function handleCategoryChange(idx: number, field: "categoryId" | "subcategoryId", value: string) {
    const updated = [...form.selectedCategories]
    if (field === "categoryId") {
      updated[idx] = { categoryId: value, subcategoryId: "" }
    } else {
      updated[idx] = { ...updated[idx], subcategoryId: value }
    }
    setForm((prev) => ({ ...prev, selectedCategories: updated }))
  }

  function addCategory() {
    setForm((prev) => ({
      ...prev,
      selectedCategories: [...prev.selectedCategories, { categoryId: "", subcategoryId: "" }]
    }))
  }

  function removeCategory(idx: number) {
    const updated = form.selectedCategories.filter((_, i) => i !== idx)
    setForm((prev) => ({ ...prev, selectedCategories: updated }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    if (!form.city) { setError("Градът е задължителен."); setSaving(false); return }
    if (!form.phone) { setError("Телефонът е задължителен."); setSaving(false); return }
    if (!form.description || form.description.trim().length < 20) { setError("Описанието трябва да е поне 20 символа."); setSaving(false); return }

    const validCategories = form.selectedCategories.filter(sc => sc.categoryId)
    if (validCategories.length === 0) { setError("Моля, избери поне една категория."); setSaving(false); return }

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
          videoUrl: form.videoUrl.trim() || null,
          categories: validCategories,
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

  async function handleDelete() {
    if (!confirm("Сигурен ли си? Профилът ти на специалист ще бъде изтрит безвъзвратно.")) return
    const res = await fetch("/api/specialist/profile/delete", { method: "DELETE" })
    if (res.ok) {
      window.location.href = "/"
    } else {
      alert("Грешка при изтриване")
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

        <div className="bg-[#151528] border border-white/10 rounded-2xl p-8 mb-6">
          <h2 className="text-white font-semibold mb-4">Профилна снимка</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#25253a] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {profileImage ? (
                <img src={profileImage} alt="Профил" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-[#1DB954]">
                  {(session?.user?.name || "П").charAt(0)}
                </span>
              )}
            </div>
            <UploadButton
              endpoint="profileImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) setProfileImage(res[0].url)
                setSuccess("Профилната снимка е обновена!")
                setError("")
              }}
              onUploadError={(err) => {
                setError(err.message || "Грешка при качване")
                setSuccess("")
              }}
            />
          </div>
        </div>

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
                <label className="block text-sm text-gray-300 mb-2">Град <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Телефон <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
                  required
                />
              </div>
            </div>

            {/* Множество категории */}
            <div>
              <label className="block text-sm text-gray-300 mb-3">
                Категории и услуги <span className="text-red-400">*</span>
                <span className="ml-2 text-xs text-gray-500">(можеш да добавиш повече от една)</span>
              </label>

              {form.selectedCategories.map((sc, idx) => {
                const catObj = dbCategories.find((c) => String(c.id) === String(sc.categoryId))
                const subs = catObj?.Subcategory ?? []
                return (
                  <div key={idx} className="mb-3 rounded-xl border border-white/10 bg-[#0F1020] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-400">Услуга {idx + 1}</span>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeCategory(idx)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕ Премахни
                        </button>
                      )}
                    </div>
                    <select
                      value={sc.categoryId}
                      onChange={(e) => handleCategoryChange(idx, "categoryId", e.target.value)}
                      className="w-full rounded-xl bg-[#151528] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50 mb-2"
                    >
                      <option value="">-- Избери категория --</option>
                      {dbCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    {subs.length > 0 && (
                      <select
                        value={sc.subcategoryId}
                        onChange={(e) => handleCategoryChange(idx, "subcategoryId", e.target.value)}
                        className="w-full rounded-xl bg-[#151528] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#1DB954]/50"
                      >
                        <option value="">Подкатегория (по желание)</option>
                        {subs.map((sub) => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )
              })}

              <button
                type="button"
                onClick={addCategory}
                className="w-full rounded-xl border border-[#1DB954]/30 text-[#1DB954] py-2 text-sm hover:bg-[#1DB954]/10 transition"
              >
                + Добави още категория
              </button>
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
              <label className="block text-sm text-gray-300 mb-2">Описание <span className="text-red-400">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                placeholder="Опиши услугите си (минимум 20 символа)..."
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50 resize-none"
                required
              />
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mt-2">
                ⚠️ Описанието не може да съдържа телефон, имейл или линкове.
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                🎥 Видео за работата ти
                <span className="ml-2 text-xs text-gray-500">YouTube или TikTok линк</span>
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl bg-[#0F1020] border border-white/10 px-4 py-3 outline-none focus:border-[#1DB954]/50"
              />
              {form.videoUrl && (form.videoUrl.includes("youtube.com") || form.videoUrl.includes("youtu.be")) && (
                <div className="mt-3 aspect-video w-full overflow-hidden rounded-xl">
                  <iframe
                    src={getYoutubeEmbedUrl(form.videoUrl)}
                    className="h-full w-full"
                    allowFullScreen
                    title="Видео преглед"
                  />
                </div>
              )}
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
              className="w-full rounded-xl bg-[#1DB954] text-black font-semibold px-6 py-3 hover:bg-[#1ed760] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Запазване..." : "Запази промените"}
            </button>
          </form>
        </div>

        <ChangePasswordSection />

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <h2 className="mb-1 font-semibold text-red-400">⚠️ Опасна зона</h2>
          <p className="mb-4 text-sm text-gray-400">Изтриването на профила е необратимо. Всички данни ще бъдат изгубени.</p>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition"
          >
            🗑️ Изтрий профила си
          </button>
        </div>
      </section>
    </main>
  )
}
