'use client'

import { use, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProZonaHeader from '@/components/header/ProZonaHeader'
import ProZonaFooter from '@/components/footer/ProZonaFooter'

type SearchResult = {
  type: 'specialist' | 'category' | 'page'
  id?: string
  name: string
  icon: string
  matchType: string
  city?: string | null
  verified?: boolean
  description?: string | null
}

type Props = {
  params: Promise<{ locale: string }>
}

export default function SearchPage({ params }: Props) {
  const { locale } = use(params)
  const searchParams = useSearchParams()

  const query = searchParams.get('q') || ''
  const city = searchParams.get('city') || ''

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`,
          { cache: 'no-store' }
        )

        const data = await res.json().catch(() => null)

        if (!res.ok) {
          setError(data?.error || 'Грешка при търсене')
          setResults([])
          return
        }

        setResults(Array.isArray(data?.results) ? data.results : [])
      } catch (err) {
        console.error(err)
        setError('Възникна грешка при зареждане на резултатите')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [query, city])

  return (
    <>
      <ProZonaHeader locale={locale} />

      <main className="min-h-screen bg-[#0D0D1A] pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-3">
            Резултати за: "{query}"
          </h1>

          {city && (
            <p className="text-gray-400 mb-8">
              Град: <span className="text-white">{city}</span>
            </p>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="text-[#1DB954] text-xl">Търсене...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">{error}</p>
              <Link
                href={`/${locale}`}
                className="inline-block mt-6 text-[#1DB954] hover:underline"
              >
                ← Начало
              </Link>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Няма намерени резултати за "{query}"
                {city ? ` в ${city}` : ''}
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
                  key={result.id || `${result.type}-${index}`}
                  href={
                    result.type === 'specialist' && result.id
                      ? `/${locale}/specialist/${result.id}`
                      : `/${locale}/search?q=${encodeURIComponent(result.name)}`
                  }
                  className="bg-[#1A1A2E] p-6 rounded-lg hover:bg-[#25253a] transition-colors group border border-white/5"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{result.icon || '👤'}</span>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-white text-lg font-semibold group-hover:text-[#1DB954] transition-colors">
                          {result.name}
                        </h3>

                        {result.verified && (
                          <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                            Верифициран
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-2">
                        {result.type === 'specialist' ? 'Специалист' : 'Резултат'}
                        {result.city ? ` • ${result.city}` : ''}
                      </p>

                      {result.description && (
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {result.description}
                        </p>
                      )}
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