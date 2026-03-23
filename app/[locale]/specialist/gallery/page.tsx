'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'

type ImageType = 'NORMAL' | 'BEFORE' | 'AFTER'

interface GalleryImage {
  id: number
  imageUrl: string
  isPrimary: boolean
  title: string | null
  description: string | null
  type: ImageType
}

const MAX_IMAGES = 20
const TYPE_LABELS: Record<ImageType, string> = {
  NORMAL: '📷 Обикновена',
  BEFORE: '⬅️ Преди',
  AFTER: '✅ След',
}
const TYPE_COLORS: Record<ImageType, string> = {
  NORMAL: 'bg-gray-500',
  BEFORE: 'bg-orange-500',
  AFTER: 'bg-[#1DB954]',
}

export default function GalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'bg'

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editType, setEditType] = useState<ImageType>('NORMAL')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'ALL' | ImageType>('ALL')
  // Type to assign on next upload
  const [uploadType, setUploadType] = useState<ImageType>('NORMAL')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || (session.user as any)?.role !== 'SPECIALIST') {
      router.push(`/${locale}/login`)
    } else {
      loadGallery()
    }
  }, [session, status])

  const loadGallery = async () => {
    try {
      const res = await fetch('/api/specialist/me')
      const data = await res.json()
      if (res.ok) {
        setGallery(data.GalleryImage || data.gallery || [])
      }
    } catch (error) {
      console.error('Error loading gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = async (imageUrl: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази снимка?')) return
    try {
      const res = await fetch('/api/specialist/gallery/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })
      if (res.ok) {
        setGallery(prev => prev.filter(g => g.imageUrl !== imageUrl))
        showMessage('Снимката е изтрита', 'success')
      }
    } catch {
      showMessage('Грешка при изтриване', 'error')
    }
  }

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id)
    setEditTitle(img.title || '')
    setEditDescription(img.description || '')
    setEditType(img.type || 'NORMAL')
  }

  const saveEdit = async (id: number) => {
    setSaving(true)
    try {
      const res = await fetch('/api/specialist/gallery/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle, description: editDescription, type: editType })
      })
      if (res.ok) {
        setGallery(prev => prev.map(g =>
          g.id === id ? { ...g, title: editTitle, description: editDescription, type: editType } : g
        ))
        setEditingId(null)
        showMessage('Снимката е обновена!', 'success')
      }
    } catch {
      showMessage('Грешка при обновяване', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const filteredGallery = activeTab === 'ALL'
    ? gallery
    : gallery.filter(g => g.type === activeTab)

  const beforeCount = gallery.filter(g => g.type === 'BEFORE').length
  const afterCount = gallery.filter(g => g.type === 'AFTER').length

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Зареждане...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href={`/${locale}/specialist/dashboard`} className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Галерия на обекти</h1>
            <p className="text-gray-400 mt-1">Покажи своята работа — включително Преди/След трансформации</p>
          </div>
          <span className="text-gray-400 text-sm bg-[#1A1A2E] px-3 py-1 rounded-full border border-white/10">
            {gallery.length}/{MAX_IMAGES} снимки
          </span>
        </div>

        {message && (
          <div className={`border rounded-lg p-3 mb-6 transition-all ${messageType === 'success' ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          {(['ALL', 'NORMAL', 'BEFORE', 'AFTER'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[#1DB954] text-white'
                  : 'bg-[#1A1A2E] text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {tab === 'ALL' && `Всички (${gallery.length})`}
              {tab === 'NORMAL' && `📷 Обикновени (${gallery.filter(g => g.type === 'NORMAL').length})`}
              {tab === 'BEFORE' && `⬅️ Преди (${beforeCount})`}
              {tab === 'AFTER' && `✅ След (${afterCount})`}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        {filteredGallery.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Няма снимки в тази категория
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredGallery.map((img, i) => (
              <div key={img.id || i} className="bg-[#1A1A2E] rounded-2xl border border-white/10 overflow-hidden">
                <div className="relative aspect-video group">
                  <img
                    src={img.imageUrl}
                    alt={img.title || `Обект ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Type badge */}
                  <span className={`absolute top-3 left-3 ${TYPE_COLORS[img.type || 'NORMAL']} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                    {TYPE_LABELS[img.type || 'NORMAL']}
                  </span>
                  {img.isPrimary && (
                    <span className="absolute top-3 left-3 mt-7 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Главна
                    </span>
                  )}
                  <button
                    onClick={() => removeImage(img.imageUrl)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 backdrop-blur text-white rounded-full hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-4">
                  {editingId === img.id ? (
                    <div className="space-y-3">
                      {/* Type selector in edit mode */}
                      <div className="flex gap-2">
                        {(['NORMAL', 'BEFORE', 'AFTER'] as ImageType[]).map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setEditType(t)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              editType === t
                                ? 'bg-[#1DB954] border-[#1DB954] text-white'
                                : 'border-gray-600 text-gray-400 hover:border-gray-400'
                            }`}
                          >
                            {TYPE_LABELS[t]}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Заглавие на обекта"
                        className="w-full px-3 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white text-sm focus:border-[#1DB954] outline-none"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Описание на извършената работа"
                        rows={2}
                        className="w-full px-3 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white text-sm focus:border-[#1DB954] outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(img.id)}
                          disabled={saving}
                          className="flex-1 py-2 bg-[#1DB954] text-white rounded-lg text-sm hover:bg-[#169b43] disabled:opacity-50"
                        >
                          {saving ? 'Запазване...' : 'Запази'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
                        >
                          Отказ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-white font-semibold">
                        {img.title || <span className="text-gray-500 italic">Без заглавие</span>}
                      </h3>
                      {img.description && (
                        <p className="text-gray-400 text-sm mt-1">{img.description}</p>
                      )}
                      <button
                        onClick={() => startEdit(img)}
                        className="mt-3 text-[#1DB954] text-sm hover:underline"
                      >
                        ✏️ Редактирай
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload section */}
        {gallery.length < MAX_IMAGES ? (
          <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-dashed border-white/20">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📸</div>
              <h2 className="text-white font-semibold mb-1">Добави снимка</h2>
              <p className="text-gray-400 text-sm">JPG, PNG, WEBP до 8MB</p>
            </div>

            {/* Upload type selector */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3 text-center">Тип на снимката:</p>
              <div className="flex gap-3 justify-center">
                {(['NORMAL', 'BEFORE', 'AFTER'] as ImageType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setUploadType(t)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                      uploadType === t
                        ? 'bg-[#1DB954] border-[#1DB954] text-white'
                        : 'border-gray-600 text-gray-400 hover:border-gray-400 bg-[#0D0D1A]'
                    }`}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              {uploadType !== 'NORMAL' && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  {uploadType === 'BEFORE'
                    ? 'Снимката ще се покаже в секцията "Преди" — преди извършване на работата'
                    : 'Снимката ще се покаже в секцията "След" — крайният резултат'}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <UploadButton
                endpoint="galleryImages"
                onClientUploadComplete={async (files) => {
                  // After upload, update the type of the newly added image
                  await loadGallery()
                  // Find the newly added image and update its type if not NORMAL
                  if (uploadType !== 'NORMAL' && files?.[0]?.url) {
                    try {
                      const res = await fetch('/api/specialist/gallery/update-by-url', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageUrl: files[0].url, type: uploadType })
                      })
                      if (res.ok) await loadGallery()
                    } catch (e) {
                      console.error(e)
                    }
                  }
                  showMessage('Снимката е добавена успешно!', 'success')
                }}
                onUploadError={(error) => {
                  showMessage(error.message || 'Грешка при качване', 'error')
                }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center text-yellow-400 text-sm">
            Достигнат е максималният брой снимки ({MAX_IMAGES}). Изтрий снимка за да добавиш нова.
          </div>
        )}
      </div>
    </div>
  )
}