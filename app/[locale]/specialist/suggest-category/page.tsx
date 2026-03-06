// app/specialist/suggest-category/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { categories } from '@/lib/constants'

export default function SuggestCategoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  
  // Р¤РѕСЂРјР° РґР°РЅРЅРё
  const [suggestionType, setSuggestionType] = useState('category') // 'category' РёР»Рё 'subcategory'
  const [categoryName, setCategoryName] = useState('')
  const [subcategoryName, setSubcategoryName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [description, setDescription] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'SPECIALIST') {
      router.push('/login')
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/specialist/suggest-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: suggestionType,
          categoryName: suggestionType === 'category' ? categoryName : undefined,
          subcategoryName: suggestionType === 'subcategory' ? subcategoryName : undefined,
          parentCategory: suggestionType === 'subcategory' ? parentCategory : undefined,
          description,
          reason,
          specialistId: session?.user?.id
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessageType('success')
        setMessage('Р‘Р»Р°РіРѕРґР°СЂРёРј РІРё! РџСЂРµРґР»РѕР¶РµРЅРёРµС‚Рѕ Рµ РёР·РїСЂР°С‚РµРЅРѕ Р·Р° РїСЂРµРіР»РµРґ.')
        // РР·С‡РёСЃС‚РІР°РЅРµ РЅР° С„РѕСЂРјР°С‚Р°
        setCategoryName('')
        setSubcategoryName('')
        setParentCategory('')
        setDescription('')
        setReason('')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Р“СЂРµС€РєР° РїСЂРё РёР·РїСЂР°С‰Р°РЅРµ')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Р’СЉР·РЅРёРєРЅР° РіСЂРµС€РєР°. РћРїРёС‚Р°Р№С‚Рµ РѕС‚РЅРѕРІРѕ.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white">Р—Р°СЂРµР¶РґР°РЅРµ...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href="/specialist/dashboard" className="text-[#1DB954] hover:underline mb-4 inline-block">
          в†ђ РќР°Р·Р°Рґ РєСЉРј С‚Р°Р±Р»РѕС‚Рѕ
        </Link>

        <div className="bg-[#1A1A2E] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-4">РџСЂРµРґР»РѕР¶Рё РЅРѕРІР° РєР°С‚РµРіРѕСЂРёСЏ</h1>
          <p className="text-gray-400 mb-8">
            РќРµ РЅР°РјРёСЂР°С‚Рµ С‚РѕС‡РЅР°С‚Р° РєР°С‚РµРіРѕСЂРёСЏ Р·Р° РІР°С€РёС‚Рµ СѓСЃР»СѓРіРё? РџСЂРµРґР»РѕР¶РµС‚Рµ РЅРѕРІР°!
          </p>

          {message && (
            <div className={`${
              messageType === 'success' 
                ? 'bg-green-500/10 border-green-500 text-green-500' 
                : 'bg-red-500/10 border-red-500 text-red-500'
              } border rounded-lg p-4 mb-6`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* РўРёРї РїСЂРµРґР»РѕР¶РµРЅРёРµ */}
            <div>
              <label className="block text-gray-300 mb-3">РљР°РєРІРѕ РёСЃРєР°С‚Рµ РґР° РїСЂРµРґР»РѕР¶РёС‚Рµ?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="category"
                    checked={suggestionType === 'category'}
                    onChange={(e) => setSuggestionType(e.target.value)}
                    className="text-[#1DB954] focus:ring-[#1DB954]"
                  />
                  <span className="text-white">РќРѕРІР° РєР°С‚РµРіРѕСЂРёСЏ</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="subcategory"
                    checked={suggestionType === 'subcategory'}
                    onChange={(e) => setSuggestionType(e.target.value)}
                    className="text-[#1DB954] focus:ring-[#1DB954]"
                  />
                  <span className="text-white">РќРѕРІР° РїРѕРґРєР°С‚РµРіРѕСЂРёСЏ</span>
                </label>
              </div>
            </div>

            {suggestionType === 'category' ? (
              // РќРѕРІР° РєР°С‚РµРіРѕСЂРёСЏ
              <div>
                <label className="block text-gray-300 mb-2">РРјРµ РЅР° РєР°С‚РµРіРѕСЂРёСЏ *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                  placeholder="РџСЂРёРјРµСЂ: Р“СЂР°РґРёРЅСЃРєРё СѓСЃР»СѓРіРё"
                  required
                />
              </div>
            ) : (
              // РќРѕРІР° РїРѕРґРєР°С‚РµРіРѕСЂРёСЏ
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">РљСЉРј РєРѕСЏ РєР°С‚РµРіРѕСЂРёСЏ? *</label>
                  <select
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
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
                  <label className="block text-gray-300 mb-2">РРјРµ РЅР° РїРѕРґРєР°С‚РµРіРѕСЂРёСЏ *</label>
                  <input
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    placeholder="РџСЂРёРјРµСЂ: РџРѕРґРґСЂСЉР¶РєР° РЅР° С‚СЂРµРІРЅРё РїР»РѕС‰Рё"
                    required
                  />
                </div>
              </div>
            )}

            {/* РћРїРёСЃР°РЅРёРµ */}
            <div>
              <label className="block text-gray-300 mb-2">РћРїРёСЃР°РЅРёРµ РЅР° СѓСЃР»СѓРіРёС‚Рµ *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                placeholder="РћРїРёС€РµС‚Рµ РєР°РєРІРё СѓСЃР»СѓРіРё РїСЂРµРґР»Р°РіР°С‚Рµ РІ С‚Р°Р·Рё РєР°С‚РµРіРѕСЂРёСЏ..."
                required
              />
            </div>

            {/* РџСЂРёС‡РёРЅР° Р·Р° РїСЂРµРґР»РѕР¶РµРЅРёРµС‚Рѕ */}
            <div>
              <label className="block text-gray-300 mb-2">Р—Р°С‰Рѕ РїСЂРµРґР»Р°РіР°С‚Рµ С‚РѕРІР°? *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                placeholder="РћР±СЏСЃРЅРµС‚Рµ Р·Р°С‰Рѕ СЃРјСЏС‚Р°С‚Рµ, С‡Рµ С‚Р°Р·Рё РєР°С‚РµРіРѕСЂРёСЏ Рµ РЅРµРѕР±С…РѕРґРёРјР°..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50 transition-colors"
            >
              {loading ? 'РР·РїСЂР°С‰Р°РЅРµ...' : 'РР·РїСЂР°С‚Рё РїСЂРµРґР»РѕР¶РµРЅРёРµС‚Рѕ'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
