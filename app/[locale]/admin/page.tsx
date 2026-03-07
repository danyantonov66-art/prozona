'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface Stats {
  users: number
  specialists: number
  clients: number
  inquiries: number
  pendingVerifications: number
  pendingSuggestions: number
}

interface Specialist {
  id: string
  businessName: string | null
  city: string
  verified: boolean
  createdAt: string
  user: { name: string; email: string }
}

interface CategorySuggestion {
  id: string
  type: string
  name: string
  description: string
  reason: string
  status: string
  createdAt: string
  specialist: { user: { name: string; email: string } }
}

type SpecialistFilter = 'all' | 'pending' | 'verified'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState<Stats | null>(null)
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [specialistFilter, setSpecialistFilter] = useState<SpecialistFilter>('all')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if ((session.user as any)?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    setLoading(true)

    try {
      const [statsRes, specialistsRes, suggestionsRes] = await Promise.all([
        fetch('/api/admin/stats', { cache: 'no-store' }),
        fetch('/api/admin/specialists', { cache: 'no-store' }),
        fetch('/api/admin/suggestions', { cache: 'no-store' }),
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (specialistsRes.ok) setSpecialists(await specialistsRes.json())
      if (suggestionsRes.ok) setSuggestions(await suggestionsRes.json())
    } catch (error) {
      console.error('Admin fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const verifySpecialist = async (id: string, verified: boolean) => {
    try {
      setActionLoadingId(id)

      const res = await fetch(`/api/admin/specialists/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        alert(data?.error || 'Възникна грешка при обновяване на статуса')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Verify specialist error:', error)
      alert('Възникна грешка при връзка със сървъра')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleSuggestion = async (id: string, status: string) => {
    try {
      setActionLoadingId(id)

      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        alert(data?.error || 'Възникна грешка при обработка на предложението')
        return
      }

      await fetchData()
    } catch (error) {
      console.error('Suggestion update error:', error)
      alert('Възникна грешка при връзка със сървъра')
    } finally {
      setActionLoadingId(null)
    }
  }

  const pendingSpecialists = useMemo(
    () => specialists.filter((s) => !s.verified),
    [specialists]
  )

  const verifiedSpecialists = useMemo(
    () => specialists.filter((s) => s.verified),
    [specialists]
  )

  const filteredSpecialists = useMemo(() => {
    if (specialistFilter === 'pending') return pendingSpecialists
    if (specialistFilter === 'verified') return verifiedSpecialists
    return specialists
  }, [specialists, pendingSpecialists, verifiedSpecialists, specialistFilter])

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center">
        <div className="text-white text-xl">Зареждане...</div>
      </div>
    )
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') return null

  return (
    <div className="min-h-screen bg-[#0D0D1A]">
      <header className="border-b border-gray-800 bg-[#0D0D1A] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1DB954] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PZ</span>
              </div>
              <span className="text-white font-semibold">ProZona</span>
            </Link>
            <span className="text-gray-600">|</span>
            <span className="text-[#1DB954] font-semibold">Admin панел</span>
          </div>
          <span className="text-gray-400 text-sm">{session.user?.email}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'stats', label: '📊 Статистики' },
            { id: 'specialists', label: `👷 Специалисти (${specialists.length})` },
            {
              id: 'suggestions',
              label: `💡 Предложения (${suggestions.filter((s) => s.status === 'PENDING').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#1DB954] border-b-2 border-[#1DB954]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'stats' && stats && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Статистики</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Потребители', value: stats.users, color: 'text-blue-400' },
                { label: 'Специалисти', value: stats.specialists, color: 'text-green-400' },
                { label: 'Клиенти', value: stats.clients, color: 'text-purple-400' },
                { label: 'Запитвания', value: stats.inquiries, color: 'text-yellow-400' },
                {
                  label: 'Чакат верификация',
                  value: stats.pendingVerifications,
                  color: 'text-orange-400',
                },
                { label: 'Предложения', value: stats.pendingSuggestions, color: 'text-pink-400' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#1A1A2E] rounded-lg p-6 border border-gray-800">
                  <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specialists' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Специалисти</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Общо: {specialists.length} | Чакащи: {pendingSpecialists.length} | Верифицирани:{' '}
                  {verifiedSpecialists.length}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSpecialistFilter('all')}
                  className={`px-4 py-2 rounded text-sm ${
                    specialistFilter === 'all'
                      ? 'bg-[#1DB954] text-white'
                      : 'bg-[#1A1A2E] text-gray-300 hover:text-white border border-gray-700'
                  }`}
                >
                  Всички
                </button>
                <button
                  onClick={() => setSpecialistFilter('pending')}
                  className={`px-4 py-2 rounded text-sm ${
                    specialistFilter === 'pending'
                      ? 'bg-yellow-500 text-black'
                      : 'bg-[#1A1A2E] text-gray-300 hover:text-white border border-gray-700'
                  }`}
                >
                  Чакащи
                </button>
                <button
                  onClick={() => setSpecialistFilter('verified')}
                  className={`px-4 py-2 rounded text-sm ${
                    specialistFilter === 'verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-[#1A1A2E] text-gray-300 hover:text-white border border-gray-700'
                  }`}
                >
                  Верифицирани
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#1A1A2E] border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Общо специалисти</div>
                <div className="text-2xl font-bold text-white">{specialists.length}</div>
              </div>
              <div className="bg-[#1A1A2E] border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Чакат одобрение</div>
                <div className="text-2xl font-bold text-yellow-400">{pendingSpecialists.length}</div>
              </div>
              <div className="bg-[#1A1A2E] border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Одобрени</div>
                <div className="text-2xl font-bold text-green-400">{verifiedSpecialists.length}</div>
              </div>
            </div>

            <div className="bg-[#1A1A2E] rounded-lg overflow-hidden border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-700 bg-[#151526]">
                      <th className="text-left text-gray-400 px-4 py-3">Име</th>
                      <th className="text-left text-gray-400 px-4 py-3">Бизнес</th>
                      <th className="text-left text-gray-400 px-4 py-3">Имейл</th>
                      <th className="text-left text-gray-400 px-4 py-3">Град</th>
                      <th className="text-left text-gray-400 px-4 py-3">Създаден</th>
                      <th className="text-left text-gray-400 px-4 py-3">Статус</th>
                      <th className="text-left text-gray-400 px-4 py-3">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpecialists.map((s) => (
                      <tr key={s.id} className="border-b border-gray-800 hover:bg-[#25253a]">
                        <td className="px-4 py-3 text-white font-medium">{s.user.name}</td>
                        <td className="px-4 py-3 text-gray-300">{s.businessName || '—'}</td>
                        <td className="px-4 py-3 text-gray-400">{s.user.email}</td>
                        <td className="px-4 py-3 text-gray-400">{s.city}</td>
                        <td className="px-4 py-3 text-gray-400">{formatDate(s.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              s.verified
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {s.verified ? 'Верифициран' : 'Чака одобрение'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {!s.verified ? (
                              <button
                                onClick={() => verifySpecialist(s.id, true)}
                                disabled={actionLoadingId === s.id}
                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/40 disabled:opacity-50"
                              >
                                {actionLoadingId === s.id ? 'Обработка...' : 'Одобри'}
                              </button>
                            ) : (
                              <button
                                onClick={() => verifySpecialist(s.id, false)}
                                disabled={actionLoadingId === s.id}
                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/40 disabled:opacity-50"
                              >
                                {actionLoadingId === s.id ? 'Обработка...' : 'Върни в чакащи'}
                              </button>
                            )}

                            <Link
                              href={`/bg/specialist/${s.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/40"
                            >
                              Виж профил
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredSpecialists.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                          Няма специалисти за този филтър
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Предложени категории</h1>

            <div className="space-y-4">
              {suggestions.map((s) => (
                <div key={s.id} className="bg-[#1A1A2E] rounded-lg p-6 border border-gray-800">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">
                        {s.type === 'category' ? 'Нова категория' : 'Нова подкатегория'}
                      </span>
                      <h3 className="text-white font-semibold text-lg">{s.name}</h3>
                      <p className="text-gray-400 text-sm">
                        от {s.specialist.user.name} ({s.specialist.user.email})
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        s.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : s.status === 'APPROVED'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {s.status === 'PENDING'
                        ? 'Чака'
                        : s.status === 'APPROVED'
                          ? 'Одобрено'
                          : 'Отхвърлено'}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-2">
                    <span className="text-gray-500">Описание:</span> {s.description}
                  </p>

                  <p className="text-gray-300 mb-4">
                    <span className="text-gray-500">Причина:</span> {s.reason}
                  </p>

                  {s.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSuggestion(s.id, 'APPROVED')}
                        disabled={actionLoadingId === s.id}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40 text-sm disabled:opacity-50"
                      >
                        {actionLoadingId === s.id ? 'Обработка...' : '✓ Одобри'}
                      </button>
                      <button
                        onClick={() => handleSuggestion(s.id, 'REJECTED')}
                        disabled={actionLoadingId === s.id}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm disabled:opacity-50"
                      >
                        {actionLoadingId === s.id ? 'Обработка...' : '✗ Отхвърли'}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {suggestions.length === 0 && (
                <div className="text-center text-gray-400 py-8">Няма предложения</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}