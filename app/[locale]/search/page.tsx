// app/search/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { categories, cities } from '@/lib/constants'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 Търсене за:', query)
    setLoading(true)
    
    // Ако няма query, покажи празни резултати
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const searchTerm = query.toLowerCase().trim()

    // Търсене в категориите
    const categoryResults = categories
      .filter(cat => 
        cat.name.toLowerCase().includes(searchTerm) ||
        cat.description.toLowerCase().includes(searchTerm)
      )
      .map(cat => ({
        type: 'category',
        name: cat.name,
        description: cat.description,
        imageUrl: cat.imageUrl,
        link: `/categories/${cat.slug}`,
        icon: '📁',
        matchType: 'category'
      }))

    // Търсене в услугите
    const serviceResults = categories.flatMap(cat => 
      cat.subcategories
        .filter(sub => sub.toLowerCase().includes(searchTerm))
        .map(sub => ({
          type: 'service',
          name: sub,
          category: cat.name,
          categorySlug: cat.slug,
          link: `/categories/${cat.slug}?service=${encodeURIComponent(sub)}`,
          icon: '🔧',
          matchType: 'service'
        }))
    )

    // Търсене в градовете
    const cityResults = cities
      .filter(c => c.toLowerCase().includes(searchTerm))
      .map(c => ({
        type: 'city',
        name: c,
        link: `/search?city=${encodeURIComponent(c)}`,
        icon: '📍',
        matchType: 'city'
      }))

    // Комбинирай и сортирай резултатите
    const allResults = [...categoryResults, ...serviceResults, ...cityResults]
    
    // Сортирай по релевантност (точни съвпадения първи)
    const sortedResults = allResults.sort((a, b) => {
      const aExact = a.name.toLowerCase() === searchTerm ? 1 : 0
      const bExact = b.name.toLowerCase() === searchTerm ? 1 : 0
      if (aExact !== bExact) return bExact - aExact
      
      // Ако няма точни съвпадения, сортирай по дължина (по-кратките първи)
      return a.name.length - b.name.length
    })

    console.log('📊 Намерени резултати:', sortedResults.length)
    setResults(sortedResults)
    setLoading(false)
  }, [query])

  // Функция за групиране на резултатите по тип
  const groupedResults = results.reduce((acc, result) => {
    const type = result.type === 'category' ? 'Категории' :
                 result.type === 'service' ? 'Услуги' : 'Градове'
    if (!acc[type]) acc[type] = []
    acc[type].push(result)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {query ? `Резултати за "${query}"` : 'Търсене'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Намерени: {results.length} резултата
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Зареждане...</div>
        ) : results.length === 0 ? (
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Няма намерени резултати за "{query}"</p>
            <p className="text-gray-500">Пробвайте с друга ключова дума</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedResults).map(([groupName, groupItems]) => (
              <div key={groupName}>
                <h2 className="text-xl font-semibold text-white mb-4">{groupName}</h2>
                <div className="space-y-4">
                  {groupItems.map((result, index) => (
                    <Link 
                      key={`${result.type}-${index}`}
                      href={result.link}
                      className="block bg-[#1A1A2E] rounded-lg p-6 hover:bg-[#25253a] transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{result.icon}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#1DB954] transition-colors">
                                {result.name}
                              </h3>
                              {result.type === 'service' && (
                                <p className="text-gray-400 text-sm">
                                  в категория <span className="text-[#1DB954]">{result.category}</span>
                                </p>
                              )}
                              {result.type === 'category' && (
                                <p className="text-gray-400 text-sm">{result.description}</p>
                              )}
                            </div>
                            {result.name.toLowerCase() === query.toLowerCase() && (
                              <span className="bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full">
                                Точно съвпадение
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-[#1DB954] text-sm group-hover:underline">
                              {result.type === 'category' && 'Разгледай категорията →'}
                              {result.type === 'service' && 'Виж специалисти →'}
                              {result.type === 'city' && 'Търси в града →'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}