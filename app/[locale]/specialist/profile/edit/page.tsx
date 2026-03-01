'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'bg'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [gallery, setGallery] = useState<string[]>([])

  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  const profileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session || (session.user as any)?.role !== 'SPECIALIST') {
      router.push(`/${locale}/login`)
    } else {
      loadProfile()
    }
  }, [session, status])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/specialist/me')
      const data = await res.json()
      if (res.ok) {
        setBusinessName(data.businessName || '')
        setDescription(data.description || '')
        setPhone(data.phone || '')
        setExperience(data.experienceYears?.toString() || '')
        setProfileImage(data.user?.image || null)
        setGallery((data.gallery || []).map((g: any) => g.imageUrl || g))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadProfileImage = async (file: File) => {
    setUploadingProfile(true)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'profile')
      const res = await fetch('/api/specialist/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setProfileImage(data.url)
        setMessage('Профилната снимка е качена!')
        setMessageType('success')
      } else {
        setMessage(data.error || 'Грешка при качване')
        setMessageType('error')
      }
    } catch {
      setMessage('Грешка при качване')
      setMessageType('error')
    } finally {
      setUploadingProfile(false)
    }
  }

  const uploadGalleryImage = async (file: File) => {
    if (gallery.length >= 5) {
      setMessage('Максимум 5 снимки в галерията')
      setMessageType('error')
      return
    }
    setUploadingGallery(true)
    setMessage('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'gallery')
      const res = await fetch('/api/specialist/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setGallery(prev => [...prev, data.url])
        setMessage('Снимката е добавена в галерията!')
        setMessageType('success')
      } else {
        setMessage(data.error || 'Грешка при качване')
        setMessageType('error')
      }
    } catch {
      setMessage('Грешка при качване')
      setMessageType('error')
    } finally {
      setUploadingGallery(false)
    }
  }

  const removeGalleryImage = async (url: string) => {
    try {
      await fetch('/api/specialist/gallery/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url })
      })
      setGallery(prev => prev.filter(g => g !== url))
    } catch {
      setMessage('Грешка при изтриване')
      setMessageType('error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/specialist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          description,
          phone,
          experienceYears: parseInt(experience) || 0,
        })
      })
      if (res.ok) {
        setMessage('Профилът е обновен успешно!')
        setMessageType('success')
      } else {
        setMessage('Грешка при обновяване')
        setMessageType('error')
      }
    } catch {
      setMessage('Възникна грешка')
      setMessageType('error')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Зареждане...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href={`/${locale}/dashboard`} className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Редактирай профил</h1>

        {message && (
          <div className={`border rounded-lg p-3 mb-4 ${messageType === 'success' ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="bg-[#1A1A2E] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Профилна снимка</h2>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-[#25253a] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {profileImage ? (
                <img src={profileImage} alt="Профил" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-[#1DB954]">
                  {(session?.user?.name || 'П').charAt(0)}
                </span>
              )}
            </div>
            <div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadProfileImage(e.target.files[0])}
              />
              <button
                type="button"
                onClick={() => profileInputRef.current?.click()}
                disabled={uploadingProfile}
                className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50 text-sm"
              >
                {uploadingProfile ? 'Качване...' : 'Смени снимката'}
              </button>
              <p className="text-gray-500 text-xs mt-2">Максимум 4MB. JPG, PNG, WEBP.</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A1A2E] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Галерия ({gallery.length}/5 снимки)</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {gallery.map((url, i) => (
              <div key={i} className="relative aspect-square">
                <img src={url} alt={`Галерия ${i+1}`} className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(url)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {gallery.length < 5 && (
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="aspect-square bg-[#25253a] rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center hover:border-[#1DB954] transition-colors disabled:opacity-50"
              >
                {uploadingGallery ? (
                  <span className="text-gray-400 text-xs">Качване...</span>
                ) : (
                  <>
                    <span className="text-2xl text-gray-500">+</span>
                    <span className="text-gray-500 text-xs">Добави</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && uploadGalleryImage(e.target.files[0])}
          />
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1A1A2E] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold mb-2">Основна информация</h2>

          <div>
            <label className="block text-gray-300 mb-2">Ime на фирма</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Години опит</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
              min="0"
              max="50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50 font-semibold"
          >
            {saving ? 'Запазване...' : 'Запази промените'}
          </button>
        </form>
      </div>
    </div>
  )
}