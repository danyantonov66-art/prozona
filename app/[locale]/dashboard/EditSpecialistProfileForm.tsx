'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface GalleryImage {
  id?: string
  imageUrl: string
}

interface Props {
  locale: string
  initialData: {
    businessName?: string | null
    description?: string | null
    phone?: string | null
    experienceYears?: number | null
    city?: string | null
    profileImage?: string | null
    galleryImages?: GalleryImage[]
  }
}

export default function EditSpecialistProfileForm({ initialData, locale }: Props) {
  const router = useRouter()

  const [businessName, setBusinessName] = useState(initialData.businessName || '')
  const [description, setDescription] = useState(initialData.description || '')
  const [phone, setPhone] = useState(initialData.phone || '')
  const [experienceYears, setExperienceYears] = useState(initialData.experienceYears || 0)
  const [city, setCity] = useState(initialData.city || '')
  const [profileImage, setProfileImage] = useState(initialData.profileImage || '')
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    initialData.galleryImages || []
  )

  const [saving, setSaving] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const profileInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/specialist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          description,
          phone,
          experienceYears: Number(experienceYears) || 0,
          city,
          profileImage,
          galleryImages,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Грешка при запазване')
        return
      }

      setMessage('Промените са запазени успешно.')

      router.refresh()
      router.push(`/${locale}/dashboard`)
    } catch (err) {
      console.error(err)
      setError('Възникна грешка при запазване.')
    } finally {
      setSaving(false)
    }
  }

  const uploadFile = async (file: File, type: 'profile' | 'gallery') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const res = await fetch('/api/specialist/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      throw new Error(data?.error || 'Грешка при качване')
    }

    return data?.url as string
  }

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingProfile(true)
    setMessage('')
    setError('')

    try {
      const url = await uploadFile(file, 'profile')
      setProfileImage(url)
      setMessage('Профилната снимка е качена успешно.')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Грешка при качване')
    } finally {
      setUploadingProfile(false)
      if (profileInputRef.current) profileInputRef.current.value = ''
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const freeSlots = Math.max(0, 5 - galleryImages.length)
    const filesToUpload = files.slice(0, freeSlots)

    if (!filesToUpload.length) {
      setError('Галерията вече е запълнена.')
      return
    }

    setUploadingGallery(true)
    setMessage('')
    setError('')

    try {
      const uploaded: GalleryImage[] = []

      for (const file of filesToUpload) {
        const url = await uploadFile(file, 'gallery')
        uploaded.push({ imageUrl: url })
      }

      setGalleryImages((prev) => [...prev, ...uploaded].slice(0, 5))
      setMessage('Снимките в галерията са качени успешно.')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Грешка при качване в галерията')
    } finally {
      setUploadingGallery(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ''
    }
  }

  const handleRemoveGalleryImage = async (imageUrl: string) => {
    setMessage('')
    setError('')

    try {
      const res = await fetch('/api/specialist/gallery/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.error || 'Грешка при изтриване')
        return
      }

      setGalleryImages((prev) => prev.filter((img) => img.imageUrl !== imageUrl))
      setMessage('Снимката е изтрита.')
    } catch (err) {
      console.error(err)
      setError('Възникна грешка при изтриване.')
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message && (
        <div className="rounded-lg border border-green-500 bg-green-500/10 p-3 text-green-400">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-3 text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Основна информация</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-gray-300">Име на бизнеса</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#0D0D1A] px-4 py-2 text-white"
              placeholder="Напр. Martin Furniture"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-700 bg-[#0D0D1A] px-4 py-2 text-white"
              placeholder="Опишете услугите си"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">Телефон</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#0D0D1A] px-4 py-2 text-white"
              placeholder="0888 123 456"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">Град</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-[#0D0D1A] px-4 py-2 text-white"
              placeholder="София"
            />
          </div>

          <div>
            <label className="mb-2 block text-gray-300">Години опит</label>
            <input
              type="number"
              min={0}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-700 bg-[#0D0D1A] px-4 py-2 text-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Профилна снимка</h2>

        {profileImage ? (
          <img
            src={profileImage}
            alt="Профилна снимка"
            className="mb-4 h-32 w-32 rounded-xl border border-gray-700 object-cover"
          />
        ) : (
          <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-gray-700 text-sm text-gray-400">
            Няма снимка
          </div>
        )}

        <input
          ref={profileInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileUpload}
          className="block w-full text-sm text-gray-300"
        />

        <p className="mt-2 text-sm text-gray-400">
          {uploadingProfile ? 'Качване...' : 'Изберете снимка за профила.'}
        </p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-[#1A1A2E] p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Галерия</h2>

        {galleryImages.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.map((image) => (
              <div
                key={image.imageUrl}
                className="rounded-xl border border-gray-700 bg-[#0D0D1A] p-2"
              >
                <img
                  src={image.imageUrl}
                  alt="Gallery"
                  className="h-40 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(image.imageUrl)}
                  className="mt-2 w-full rounded-lg border border-red-500 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  Изтрий
                </button>
              </div>
            ))}
          </div>
        )}

        {galleryImages.length < 5 && (
          <div className="mt-4">
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="block w-full text-sm text-gray-300"
            />
            <p className="mt-2 text-sm text-gray-400">
              {uploadingGallery
                ? 'Качване...'
                : `Можете да качите до 5 снимки. В момента: ${galleryImages.length}/5`}
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={saving || uploadingProfile || uploadingGallery}
        className="rounded-lg bg-[#1DB954] px-6 py-3 font-medium text-white hover:bg-[#169b43] disabled:opacity-50"
      >
        {saving ? 'Запазване...' : 'Запази промените'}
      </button>
    </form>
  )
}