"use client"

import { useState } from "react"

type GalleryImage = {
  id: number
  imageUrl: string
  altText?: string | null
  isPrimary?: boolean
}

type SpecialistFormData = {
  id: string
  businessName: string | null
  description: string | null
  city: string | null
  phone: string | null
  experienceYears: number | null
  images: GalleryImage[]
}

interface Props {
  specialist: SpecialistFormData
}

export default function EditSpecialistProfileForm({ specialist }: Props) {
  const [businessName, setBusinessName] = useState(specialist.businessName || "")
  const [description, setDescription] = useState(specialist.description || "")
  const [city, setCity] = useState(specialist.city || "")
  const [phone, setPhone] = useState(specialist.phone || "")
  const [experienceYears, setExperienceYears] = useState(
    specialist.experienceYears?.toString() || "0"
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const res = await fetch("/api/specialist/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          description,
          city,
          phone,
          experienceYears: Number(experienceYears) || 0,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Грешка при обновяване")
      }

      setSuccess("Профилът беше обновен успешно.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Възникна грешка.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success ? (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Име на бизнеса
        </label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
          placeholder="Например: Martin Furniture"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
          placeholder="Опиши услугите, които предлагаш"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Град
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
            placeholder="Например: София"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Телефон
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
            placeholder="+359..."
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Години опит
        </label>
        <input
          type="number"
          min={0}
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-[#0D0D1A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
        />
      </div>

      {specialist.images.length > 0 ? (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-white">Галерия</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {specialist.images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#0D0D1A]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.imageUrl}
                  alt={image.altText || "Галерия"}
                  className="h-32 w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[#1DB954] px-5 py-3 font-medium text-white transition hover:bg-[#169b43] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Запазване..." : "Запази промените"}
      </button>
    </form>
  )
}