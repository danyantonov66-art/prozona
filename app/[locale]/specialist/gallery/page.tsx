'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'

interface GalleryImage {
  id: number
  imageUrl: string
  isPrimary: boolean
  title: string | null
  description: string | null
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
  const [saving, setSaving] = useState(false)

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
    try {
      const res = await fetch('/api/specialist/gallery/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })
      if (res.ok) {
        setGallery(prev => prev.filter(g => g.imageUrl !== imageUrl))
        setMessage('Снимката е изтрита')
        setMessageType('success')
      }
    } catch {
      setMessage('Грешка при изтриване')
      setMessageType('error')
    }
  }

  const startEdit = (img: GalleryImage) => {
    setEditingId(img.id)
    setEditTitle(img.title || '')
    setEditDescription(img.description || '')
  }

  const saveEdit = async (id: number) => {
    setSaving(true)
    try {
      const res = await fetch('/api/specialist/gallery/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: editTitle, description: editDescription })
      })
      if (res.ok) {
        setGallery(prev => prev.map(g => g.id === id ? { ...g, title: editTitle, description: editDescription } : g))
        setEditingId(null)
        setMessage('Снимката е обновена!')
        setMessageType('success')
      }
    } catch {
      setMessage('Грешка при обновяване')
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
      <div className="container mx-auto max-w-4xl">
        <Link href={`/${locale}/specialist/dashboard`} className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Галерия на обекти</h1>
            <p className="text-gray-400 mt-1">Покажи своята работа на потенциалните клиенти</p>
          </div>
          <span className="text-gray-400 text-sm bg-[#1A1A2E] px-3 py-1 rounded-full border border-white/10">
            {gallery.length}/5 снимки
          </span>
        </div>

        {message && (
          <div className={`border rounded-lg p-3 mb-6 ${messageType === 'success' ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {gallery.map((img, i) => (
            <div key={img.id || i} className="bg-[#1A1A2E] rounded-2xl border border-white/10 overflow-hidden">
              <div className="relative aspect-video group">
                <img
                  src={img.imageUrl}
                  alt={img.title || `Обект ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {img.isPrimary && (
                  <span className="absolute top-3 left-3 bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full font-medium">
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

        {/* Upload */}
        {gallery.length < 5 && (
          <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-dashed border-white/20 text-center">
            <div className="text-4xl mb-3">📸</div>
            <h2 className="text-white font-semibold mb-2">Добави снимка на завършен обект</h2>
            <p className="text-gray-400 text-sm mb-6">JPG, PNG, WEBP до 8MB</p>
            <UploadButton
              endpoint="galleryImages"
              onClientUploadComplete={() => {
                setMessage('Снимката е добавена успешно!')
                setMessageType('success')
                loadGallery()
              }}
              onUploadError={(error) => {
                setMessage(error.message || 'Грешка при качване')
                setMessageType('error')
              }}
            />
          </div>
        )}

        {gallery.length === 5 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center text-yellow-400 text-sm">
            Достигнат е максималният брой снимки (5). Изтрий снимка за да добавиш нова.
          </div>
        )}
      </div>
    </div>
  )
}