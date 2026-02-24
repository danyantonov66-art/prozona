// app/register/specialist/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { categories, cities } from '@/lib/constants'

export default function SpecialistRegisterPage() {
  const router = useRouter()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [experience, setExperience] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedCategoryData = categories.find(c => c.slug === selectedCategory)
  const subcategories = selectedCategoryData?.subcategories || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          phone,
          role: 'SPECIALIST'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Грешка при регистрация')
      }

      const specialistRes = await fetch('/api/specialist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          businessName,
          description,
          city: selectedCity,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          experience: parseInt(experience) || 0,
          phone
        })
      })

      if (!specialistRes.ok) {
        throw new Error('Грешка при създаване на профил')
      }

      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/specialist/dashboard'
      })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PZ</span>
            </div>
            <span className="text-white font-semibold">ProZona</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Регистрация за специалисти</h1>
          <p className="text-gray-400">Предложете вашите услуги на хиляди клиенти</p>
        </div>

        <div className="bg-[#1A1A2E] rounded-lg p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Лични данни</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Име *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Телефон *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                    placeholder="0888 123 456"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Имейл *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Парола *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Професионални данни</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Име на фирма (ако имате)</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    placeholder="Пример: Иван Иванов ЕТ"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Описание на услугите *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                    placeholder="Опишете какво предлагате, вашия опит, сертификати..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Категория *</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setSelectedSubcategory('')
                      }}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    >
                      <option value="">Избери категория</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Подкатегория *</label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      required
                      disabled={!selectedCategory}
                    >
                      <option value="">Избери подкатегория</option>
                      {subcategories.map((sub: string) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Град *</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    >
                      <option value="">Избери град</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Години опит</label>
                    <input
                      type="number"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* НОВО - Отметка за съгласие */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-[#1DB954] bg-[#0D0D1A] border-gray-700 rounded focus:ring-[#1DB954] focus:ring-2"
              />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                Съгласявам се с{' '}
                <Link href="/terms" className="text-[#1DB954] hover:underline" target="_blank">
                  Общите условия
                </Link>{' '}
                и{' '}
                <Link href="/privacy" className="text-[#1DB954] hover:underline" target="_blank">
                  Политиката за поверителност
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1DB954] text-white rounded-lg font-medium hover:bg-[#169b43] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Регистрация...' : 'Регистрирай се като специалист'}
            </button>

            <p className="text-center text-gray-400 mt-4">
              Вече имате профил?{' '}
              <Link href="/login" className="text-[#1DB954] hover:underline">
                Вход
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}