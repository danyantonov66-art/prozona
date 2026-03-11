'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'

export default function GalleryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'bg'

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [gallery, setGallery] = useState<{ id: number; imageUrl: string; isPrimary: boolean }[]>([])

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
      await fetch('/api/specialist/gallery/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      })
      setGallery(prev => prev.filter(g => g.imageUrl !== imageUrl))
      setMessage('Снимката е изтрита')
      setMessageType('success')
    } catch {
      setMessage('Грешка при изтриване')
      setMessageType('error')
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
      <div className="container mx-auto max-w-3xl">
        <Link href={`/${locale}/specialist/dashboard`} className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Галерия</h1>
          <span className="text-gray-400 text-sm">{gallery.length}/5 снимки</span>
        </div>

        {message && (
          <div className={`border rounded-lg p-3 mb-6 ${messageType === 'success' ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {gallery.map((img, i) => (
            <div key={img.id || i} className="relative aspect-square group">
              <img
                src={img.imageUrl}
                alt={`Галерия ${i + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              {img.isPrimary && (
                <span className="absolute top-2 left-2 bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full">
                  Главна
                </span>
              )}
              <button
                onClick={() => removeImage(img.imageUrl)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {gallery.length < 5 && (
          <div className="bg-[#1A1A2E] rounded-xl p-6 border border-white/10">
            <h2 className="text-white font-semibold mb-4">Добави снимка</h2>
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

        <p className="text-gray-500 text-sm mt-4">
          Максимум 5 снимки. JPG, PNG и WEBP. Максимален размер 8MB.
        </p>
      </div>
    </div>
  )
}