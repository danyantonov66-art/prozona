'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { UploadButton } from '@/lib/uploadthing'

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
  const [city, setCity] = useState('')
  const [experience, setExperience] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [serviceAreasInput, setServiceAreasInput] = useState('')

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
        setCity(data.city || '')
        setExperience(data.experienceYears?.toString() || '')
        setProfileImage(data.user?.image || null)
        setServiceAreasInput((data.serviceAreas || []).join(', '))
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

    const serviceAreas = serviceAreasInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const res = await fetch('/api/specialist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          description,
          phone,
          city,
          experienceYears: parseInt(experience) || 0,
          serviceAreas,
        })
      })
      if (res.ok) {
        setMessage('Профилът е обновен успешно!')
        setMessageType('success')
      } else {
        const data = await res.json()
        setMessage(data.error || 'Грешка при обновяване')
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
        <Link href={`/${locale}/specialist/dashboard`} className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към таблото
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Редактирай профил</h1>

        {message && (
          <div className={`border rounded-lg p-3 mb-4 ${messageType === 'success' ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
            {message}
          </div>
        )}

        {/* Profile image */}
        <div className="bg-[#1A1A2E] rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Профилна снимка</h2>
          <div className="flex items-center gap-6 mb-4">
            <div className="w-24 h-24 bg-[#25253a] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {profileImage ? (
                <img src={profileImage} alt="Профил" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-[#1DB954]">
                  {(session?.user?.name || 'П').charAt(0)}
                </span>
              )}
            </div>
            <UploadButton
              endpoint="profileImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) setProfileImage(res[0].url)
                setMessage('Профилната снимка е обновена!')
                setMessageType('success')
              }}
              onUploadError={(error) => {
                setMessage(error.message || 'Грешка при качване')
                setMessageType('error')
              }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#1A1A2E] rounded-xl p-6 space-y-4">
          <h2 className="text-white font-semibold mb-2">Основна информация</h2>

          <div>
            <label className="block text-gray-300 mb-2">Име на фирма</label>
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
              required
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Град</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Работни райони
              <span className="ml-2 text-xs text-gray-500">разделени със запетая</span>
            </label>
            <input
              type="text"
              value={serviceAreasInput}
              onChange={(e) => setServiceAreasInput(e.target.value)}
              placeholder="Пример: Враца, Мездра, Бяла Слатина"
              className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Градовете и районите, в които предоставяш услуги
            </p>
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