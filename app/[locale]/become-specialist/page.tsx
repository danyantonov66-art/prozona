'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { categories, cities } from '@/lib/constants'

export default function BecomeSpecialistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [experience, setExperience] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedCategoryData = categories.find(c => c.slug === selectedCategory)
  const subcategories = selectedCategoryData?.subcategories || []

  if (status === 'loading') {
    return <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center text-white">Зареждане...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="bg-[#1A1A2E] p-8 rounded-lg text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Трябва да сте влезли в профила си</h1>
          <Link href="/login" className="bg-[#1DB954] text-white px-6 py-3 rounded-lg hover:bg-[#169b43]">
            Вход
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/specialist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (session.user as any).id,
          businessName,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          description,
          city: selectedCity,
          experience: Number(experience),
          phone,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Нещо се обърка')
      }

      router.push('/specialist/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-8">Станете специалист в ProZona</h1>

        <form onSubmit={handleSubmit} className="bg-[#1A1A2E] rounded-lg p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white mb-2">Име на фирма (ако имате)</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Пример: Иван Иванов ЕТ"
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Категория *</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setSelectedSubcategory('')
              }}
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              required
            >
              <option value="">Изберете категория</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Подкатегория *</label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              required
              disabled={!selectedCategory}
            >
              <option value="">Изберете подкатегория</option>
              {subcategories.map((sub: string) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Описание на услугите *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Опишете какво предлагате, опита си, квалификации..."
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Град *</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              required
            >
              <option value="">Изберете град</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Опит (години)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="5"
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              min="0"
              max="50"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Телефон за връзка *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0888 123 456"
              className="w-full bg-[#25253a] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1DB954]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1DB954] text-white py-3 rounded-lg font-semibold hover:bg-[#169b43] transition-colors disabled:opacity-50"
          >
            {loading ? 'Изпращане...' : 'Изпрати заявка'}
          </button>
        </form>
      </div>
    </div>
  )
}