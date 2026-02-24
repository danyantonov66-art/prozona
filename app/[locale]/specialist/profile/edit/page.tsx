// app/specialist/profile/edit/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // Форма данни
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'SPECIALIST') {
      router.push('/login')
    } else {
      loadProfile()
    }
  }, [session, status, router])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/specialist/profile/me')
      const data = await res.json()
      if (res.ok) {
        setBusinessName(data.businessName || '')
        setDescription(data.description || '')
        setPhone(data.phone || '')
        setExperience(data.experienceYears?.toString() || '')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/specialist/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          description,
          phone,
          experience: parseInt(experience) || 0
        })
      })

      if (res.ok) {
        setMessage('Профилът е обновен успешно!')
      } else {
        setMessage('Грешка при обновяване')
      }
    } catch (error) {
      setMessage('Възникна грешка')
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
        <Link href="/specialist/dashboard" className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Редактирай профил</h1>

        {message && (
          <div className="bg-[#1DB954]/10 border border-[#1DB954] text-[#1DB954] rounded-lg p-3 mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1A1A2E] rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Име на фирма</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Описание *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Години опит</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white"
              min="0"
              max="50"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50"
          >
            {saving ? 'Запазване...' : 'Запази промените'}
          </button>
        </form>
      </div>
    </div>
  )
}