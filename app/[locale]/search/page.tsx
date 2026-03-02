'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

type SearchResult = {
  type: string
  name: string
  link: string
  icon: string
  matchType: string
}

type Props = {
  params: Promise<{ locale: string }>
}

export default function SearchPage({ params }: Props) {
  const { locale } = use(params)

  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)

      const mockResults: SearchResult[] = [
        {
          type: 'category',
          name: 'Строителство и ремонт',
          link: `/${locale}/categories/construction`,
          icon: '🔨',
          matchType: 'category'
        },
        {
          type: 'specialist',
          name: 'Иван Иванов - Електротехник',
          link: `/${locale}/specialist/1`,
          icon: '👤',
          matchType: 'name'
        },
        {
          type: 'specialist',
          name: 'Петър Петров - Водопроводчик',
          link: `/${locale}/specialist/2`,
          icon: '👤',
          matchType: 'name'
        },
        {
          type: 'page',
          name: 'Как да стана специалист',
          link: `/${locale}/for-specialists`,
          icon: '📄',
          matchType: 'content'
        }
      ]

      const filtered = mockResults.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )

      const sortedResults = filtered.sort((a, b) => {
        if (a.matchType === 'category' && b.matchType !== 'category') return -1
        if (a.matchType === 'name' && b.matchType === 'content') return -1
        return 0
      })

      console.log('📊 Намерени резултати:', sortedResults.length)
      setResults(sortedResults)
      setLoading(false)
    }

    performSearch()
  }, [query, locale])

  return (
    <>
      <ProZonaHeader locale={locale} />
      <main className="min-h-screen bg-[#0D0D1A] pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">
            Резултати за: "{query}"
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#1DB954] text-xl">Търсене...</div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Няма намерени резултати за "{query}"
              </p>
              <Link
                href={`/${locale}`}
                className="inline-block mt-6 text-[#1DB954] hover:underline"
              >
                ← Начало
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Link
                  key={index}
                  href={result.link}
                  className="bg-[#1A1A2E] p-6 rounded-lg hover:bg-[#25253a] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{result.icon}</span>
                    <div>
                      <h3 className="text-white text-lg font-semibold group-hover:text-[#1DB954] transition-colors">
                        {result.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {result.type === 'category' && 'Категория'}
                        {result.type === 'specialist' && 'Специалист'}
                        {result.type === 'page' && 'Страница'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <ProZonaFooter />
    </>
  )
}