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
  
  // Форма данни
  const [suggestionType, setSuggestionType] = useState('category') // 'category' или 'subcategory'
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
        setMessage('Благодарим ви! Предложението е изпратено за преглед.')
        // Изчистване на формата
        setCategoryName('')
        setSubcategoryName('')
        setParentCategory('')
        setDescription('')
        setReason('')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Грешка при изпращане')
      }
    } catch (error) {
      setMessageType('error')
      setMessage('Възникна грешка. Опитайте отново.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
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

        <div className="bg-[#1A1A2E] rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Предложи нова категория</h1>
          <p className="text-gray-400 mb-8">
            Не намирате точната категория за вашите услуги? Предложете нова!
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
            {/* Тип предложение */}
            <div>
              <label className="block text-gray-300 mb-3">Какво искате да предложите?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="category"
                    checked={suggestionType === 'category'}
                    onChange={(e) => setSuggestionType(e.target.value)}
                    className="text-[#1DB954] focus:ring-[#1DB954]"
                  />
                  <span className="text-white">Нова категория</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="subcategory"
                    checked={suggestionType === 'subcategory'}
                    onChange={(e) => setSuggestionType(e.target.value)}
                    className="text-[#1DB954] focus:ring-[#1DB954]"
                  />
                  <span className="text-white">Нова подкатегория</span>
                </label>
              </div>
            </div>

            {suggestionType === 'category' ? (
              // Нова категория
              <div>
                <label className="block text-gray-300 mb-2">Име на категория *</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                  placeholder="Пример: Градински услуги"
                  required
                />
              </div>
            ) : (
              // Нова подкатегория
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Към коя категория? *</label>
                  <select
                    value={parentCategory}
                    onChange={(e) => setParentCategory(e.target.value)}
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
                  <label className="block text-gray-300 mb-2">Име на подкатегория *</label>
                  <input
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                    placeholder="Пример: Поддръжка на тревни площи"
                    required
                  />
                </div>
              </div>
            )}

            {/* Описание */}
            <div>
              <label className="block text-gray-300 mb-2">Описание на услугите *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                placeholder="Опишете какви услуги предлагате в тази категория..."
                required
              />
            </div>

            {/* Причина за предложението */}
            <div>
              <label className="block text-gray-300 mb-2">Защо предлагате това? *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-[#0D0D1A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#1DB954]"
                placeholder="Обяснете защо смятате, че тази категория е необходима..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Изпращане...' : 'Изпрати предложението'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}