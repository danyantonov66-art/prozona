'use client'

import { useState } from 'react'
import Link from 'next/link'
import { UploadButton } from '@/lib/uploadthing'

interface Props {
  locale: string
  specialist: {
    businessName: string
    description: string
    city: string
    phone: string
    experienceYears: number
    userName: string
    userImage: string | null
  }
}

const BULGARIAN_CITIES = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Сливен", "Добрич", "Шумен", "Перник", "Хасково",
  "Ямбол", "Пазарджик", "Благоевград", "Велико Търново", "Враца",
  "Габрово", "Асеновград", "Видин", "Казанлък", "Кюстендил",
  "Монтана", "Силистра", "Ловеч", "Търговище", "Разград", "Смолян"
]

export default function ProfileEditForm({ locale, specialist }: Props) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [profileImage, setProfileImage] = useState<string | null>(specialist.userImage)
  const [businessName, setBusinessName] = useState(specialist.businessName)
  const [description, setDescription] = useState(specialist.description)
  const [city, setCity] = useState(specialist.city)
  const [phone, setPhone] = useState(specialist.phone)
  const [experienceYears, setExperienceYears] = useState(specialist.experienceYears?.toString() || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/specialist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName, description, city, phone, experienceYears: parseInt(experienceYears) || 0 })
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

  return (
    <div>
      <Link href={`/${locale}/dashboard`} className="text-[#1DB954] hover:underline mb-6 inline-block">
        Назад към таблото
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">Редакция на профил</h1>

      {message && (
        <div className={`border rounded-lg p-3 mb-4 ${messageType === 'success' ? 'bg-[#1DB954]/10 border-[#1DB954] text-[#1DB954]' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="bg-[#1A1A2E] rounded-xl p-6 mb-6 border border-white/10">
        <h2 className="text-white font-semibold mb-4">Профилна снимка</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-[#25253a] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt="Профил" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-[#1DB954]">{specialist.userName.charAt(0)}</span>
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

      <form onSubmit={handleSubmit} className="bg-[#1A1A2E] rounded-xl p-6 space-y-4 border border-white/10">
        <h2 className="text-white font-semibold mb-2">Основна информация</h2>

        <div>
          <label className="block text-gray-300 mb-2">Име на фирма</label>
          <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none" />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Описание *</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none" />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Град</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none"
          >
            <option value="">Изберете град</option>
            {BULGARIAN_CITIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Телефон</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none" />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Години опит</label>
          <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} min="0" max="50"
            className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:border-[#1DB954] outline-none" />
        </div>

        <button type="submit" disabled={saving}
          className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50 font-semibold">
          {saving ? 'Запазване...' : 'Запази промените'}
        </button>
      </form>
    </div>
  )
}