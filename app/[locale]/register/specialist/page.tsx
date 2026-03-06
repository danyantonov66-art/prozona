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

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)
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
        throw new Error(data.error || 'Р“СЂРµС€РєР° РїСЂРё СЂРµРіРёСЃС‚СЂР°С†РёСЏ')
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
        throw new Error('Р“СЂРµС€РєР° РїСЂРё СЃСЉР·РґР°РІР°РЅРµ РЅР° РїСЂРѕС„РёР»')
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
          <h1 className="text-3xl font-bold text-white mb-2">Р РµРіРёСЃС‚СЂР°С†РёСЏ Р·Р° СЃРїРµС†РёР°Р»РёСЃС‚Рё</h1>
          <p className="text-gray-400">РџСЂРµРґР»РѕР¶РµС‚Рµ РІР°С€РёС‚Рµ СѓСЃР»СѓРіРё РЅР° С…РёР»СЏРґРё РєР»РёРµРЅС‚Рё</p>
        </div>

        <div className="bg-[#1A1A2E] rounded-lg p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Р›РёС‡РЅРё РґР°РЅРЅРё</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">РРјРµ *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">РўРµР»РµС„РѕРЅ *</label>
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
                  <label className="block text-gray-300 mb-2">РРјРµР№Р» *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">РџР°СЂРѕР»Р° *</label>
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
              <h2 className="text-xl font-semibold text-white mb-4">РџСЂРѕС„РµСЃРёРѕРЅР°Р»РЅРё РґР°РЅРЅРё</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">РРјРµ РЅР° С„РёСЂРјР° (Р°РєРѕ РёРјР°С‚Рµ)</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    placeholder="РџСЂРёРјРµСЂ: РРІР°РЅ РРІР°РЅРѕРІ Р•Рў"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">РћРїРёСЃР°РЅРёРµ РЅР° СѓСЃР»СѓРіРёС‚Рµ *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    required
                    placeholder="РћРїРёС€РµС‚Рµ РєР°РєРІРѕ РїСЂРµРґР»Р°РіР°С‚Рµ, РІР°С€РёСЏ РѕРїРёС‚, СЃРµСЂС‚РёС„РёРєР°С‚Рё..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">РљР°С‚РµРіРѕСЂРёСЏ *</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value)
                        setSelectedSubcategory('')
                      }}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    >
                      <option value="">РР·Р±РµСЂРё РєР°С‚РµРіРѕСЂРёСЏ</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">РџРѕРґРєР°С‚РµРіРѕСЂРёСЏ *</label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      required
                      disabled={!selectedCategory}
                    >
                      <option value="">РР·Р±РµСЂРё РїРѕРґРєР°С‚РµРіРѕСЂРёСЏ</option>
                      {subcategories.map((sub: any) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Р“СЂР°Рґ *</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                      required
                    >
                      <option value="">РР·Р±РµСЂРё РіСЂР°Рґ</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Р“РѕРґРёРЅРё РѕРїРёС‚</label>
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

            {/* РќРћР’Рћ - РћС‚РјРµС‚РєР° Р·Р° СЃСЉРіР»Р°СЃРёРµ */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-[#1DB954] bg-[#0D0D1A] border-gray-700 rounded focus:ring-[#1DB954] focus:ring-2"
              />
              <label htmlFor="terms" className="text-gray-300 text-sm">
                РЎСЉРіР»Р°СЃСЏРІР°Рј СЃРµ СЃ{' '}
                <Link href="/terms" className="text-[#1DB954] hover:underline" target="_blank">
                  РћР±С‰РёС‚Рµ СѓСЃР»РѕРІРёСЏ
                </Link>{' '}
                Рё{' '}
                <Link href="/privacy" className="text-[#1DB954] hover:underline" target="_blank">
                  РџРѕР»РёС‚РёРєР°С‚Р° Р·Р° РїРѕРІРµСЂРёС‚РµР»РЅРѕСЃС‚
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1DB954] text-white rounded-lg font-medium hover:bg-[#169b43] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Р РµРіРёСЃС‚СЂР°С†РёСЏ...' : 'Р РµРіРёСЃС‚СЂРёСЂР°Р№ СЃРµ РєР°С‚Рѕ СЃРїРµС†РёР°Р»РёСЃС‚'}
            </button>

            <p className="text-center text-gray-400 mt-4">
              Р’РµС‡Рµ РёРјР°С‚Рµ РїСЂРѕС„РёР»?{' '}
              <Link href="/login" className="text-[#1DB954] hover:underline">
                Р’С…РѕРґ
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
