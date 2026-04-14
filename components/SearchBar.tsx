"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

interface SearchBarProps {
  locale?: string
}

type LocalSearchItem = {
  type: "category" | "subcategory" | "city"
  id: string
  label: string
  href: string
  subtitle: string
}

type SpecialistSearchItem = {
  type: "specialist"
  id: string
  label: string
  href: string
  subtitle: string
}

type SearchItem = LocalSearchItem | SpecialistSearchItem

const cities = [
  "София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора",
  "Плевен", "Видин", "Враца", "Монтана", "Благоевград", "Шумен",
  "Добрич", "Перник", "Хасково", "Ямбол", "Пазарджик", "Сливен",
  "Габрово", "Велико Търново",
]

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
}

export default function SearchBar({ locale = "bg" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [specialistResults, setSpecialistResults] = useState<SpecialistSearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [dbCategories, setDbCategories] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setDbCategories).catch(() => {})
  }, [])

  const searchIndex = useMemo<LocalSearchItem[]>(() => {
    const items: LocalSearchItem[] = []

    for (const category of dbCategories) {
      items.push({
        type: "category",
        id: `category-${category.id}`,
        label: category.name,
        href: `/${locale}/categories/${category.slug}`,
        subtitle: "Категория",
      })

      for (const sub of (category.Subcategory || [])) {
        items.push({
          type: "subcategory",
          id: `subcategory-${category.id}-${sub.id}`,
          label: sub.name,
          href: `/${locale}/categories/${category.slug}/${sub.slug}`,
          subtitle: `Подкатегория · ${category.name}`,
        })
      }
    }

    for (const city of cities) {
      items.push({
        type: "city",
        id: `city-${city}`,
        label: city,
        href: `/${locale}/search?q=${encodeURIComponent(city)}&city=${encodeURIComponent(city)}`,
        subtitle: "Град",
      })
    }

    return items
  }, [locale, dbCategories])

  useEffect(() => {
    const loadSpecialists = async () => {
      const q = query.trim()
      if (!q) { setSpecialistResults([]); return }
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: "no-store" })
        const data = await res.json().catch(() => null)
        if (!res.ok || !data?.results) { setSpecialistResults([]); return }
        const mapped: SpecialistSearchItem[] = data.results
          .filter((item: any) => item.type === "specialist")
          .map((item: any) => ({
            type: "specialist",
            id: `specialist-${item.id}`,
            label: item.name,
            href: `/${locale}/specialist/${item.id}`,
            subtitle: item.city ? `Специалист · ${item.city}` : "Специалист",
          }))
        setSpecialistResults(mapped.slice(0, 5))
      } catch {
        setSpecialistResults([])
      } finally {
        setLoading(false)
      }
    }
    const timeout = setTimeout(loadSpecialists, 250)
    return () => clearTimeout(timeout)
  }, [query, locale])

  const localResults = useMemo(() => {
    const q = normalize(query)
    if (!q) return []
    const startsWithMatches = searchIndex.filter(item => normalize(item.label).startsWith(q))
    const containsMatches = searchIndex.filter(item => {
      const value = normalize(item.label)
      return value.includes(q) && !value.startsWith(q)
    })
    const merged = [...startsWithMatches, ...containsMatches]
    return merged.filter((item, index, arr) => arr.findIndex(x => x.id === item.id) === index).slice(0, 6)
  }, [query, searchIndex])

  const results = useMemo(() => {
    const merged: SearchItem[] = [...specialistResults, ...localResults]
    return merged.filter((item, index, arr) => arr.findIndex(x => x.id === item.id) === index).slice(0, 8)
  }, [specialistResults, localResults])

  const showDropdown = isFocused && query.trim().length > 0

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Търси категория, подкатегория, специалист или град..."
          className="w-full rounded-2xl border border-white/10 bg-[#151528] px-5 py-4 text-white outline-none transition focus:border-[#1DB954]/50"
        />
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
          🔍
        </div>
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#151528] shadow-2xl">
          {results.length > 0 ? (
            <>
              {results.map((item) => (
                <Link key={item.id} href={item.href}
                  className="block border-b border-white/5 px-4 py-3 last:border-b-0 hover:bg-[#20203A]">
                  <div className="text-white font-medium">
                    {item.type === "specialist" && "👤 "}
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-400">{item.subtitle}</div>
                </Link>
              ))}
              <Link href={`/${locale}/search?q=${encodeURIComponent(query)}`}
                className="block px-4 py-3 text-sm text-[#1DB954] hover:bg-[#20203A]">
                Виж всички резултати →
              </Link>
            </>
          ) : (
            <div className="px-4 py-4 text-sm text-gray-400">
              {loading ? "Търсене..." : "Няма намерени резултати"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
