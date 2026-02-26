'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('stats')
  const [stats, setStats] = useState<Stats | null>(null)
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [session, status])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, specialistsRes, suggestionsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/specialists'),
        fetch('/api/admin/suggestions'),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (specialistsRes.ok) setSpecialists(await specialistsRes.json())
      if (suggestionsRes.ok) setSuggestions(await suggestionsRes.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const verifySpecialist = async (id: string, verified: boolean) => {
    await fetch(`/api/admin/specialists/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified }),
    })
    fetchData()
  }

  const handleSuggestion = async (id: string, status: string) => {
    await fetch(`/api/admin/suggestions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchData()
  }

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
      {/* Header */}
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
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {[
            { id: 'stats', label: '📊 Статистики' },
            { id: 'specialists', label: '👷 Специалисти' },
            { id: 'suggestions', label: '💡 Предложения' },
          ].map(tab => (
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

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Статистики</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Потребители', value: stats.users, color: 'bg-blue-500/20 text-blue-400' },
                { label: 'Специалисти', value: stats.specialists, color: 'bg-green-500/20 text-green-400' },
                { label: 'Клиенти', value: stats.clients, color: 'bg-purple-500/20 text-purple-400' },
                { label: 'Запитвания', value: stats.inquiries, color: 'bg-yellow-500/20 text-yellow-400' },
                { label: 'Чакат верификация', value: stats.pendingVerifications, color: 'bg-orange-500/20 text-orange-400' },
                { label: 'Предложения', value: stats.pendingSuggestions, color: 'bg-pink-500/20 text-pink-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#1A1A2E] rounded-lg p-6">
                  <div className={`text-4xl font-bold mb-2 ${stat.color.split(' ')[1]}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specialists Tab */}
        {activeTab === 'specialists' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Специалисти</h1>
            <div className="bg-[#1A1A2E] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-400 px-4 py-3">Име</th>
                    <th className="text-left text-gray-400 px-4 py-3">Имейл</th>
                    <th className="text-left text-gray-400 px-4 py-3">Град</th>
                    <th className="text-left text-gray-400 px-4 py-3">Статус</th>
                    <th className="text-left text-gray-400 px-4 py-3">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {specialists.map(s => (
                    <tr key={s.id} className="border-b border-gray-800 hover:bg-[#25253a]">
                      <td className="px-4 py-3 text-white">{s.user.name}</td>
                      <td className="px-4 py-3 text-gray-400">{s.user.email}</td>
                      <td className="px-4 py-3 text-gray-400">{s.city}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${s.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {s.verified ? 'Верифициран' : 'Чака'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {!s.verified ? (
                            <button
                              onClick={() => verifySpecialist(s.id, true)}
                              className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/40"
                            >
                              Одобри
                            </button>
                          ) : (
                            <button
                              onClick={() => verifySpecialist(s.id, false)}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/40"
                            >
                              Отхвърли
                            </button>
                          )}
                          <Link
                            href={`/bg/specialist/${s.id}`}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/40"
                          >
                            Виж
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {specialists.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Няма специалисти</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Предложени категории</h1>
            <div className="space-y-4">
              {suggestions.map(s => (
                <div key={s.id} className="bg-[#1A1A2E] rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">{s.type === 'category' ? 'Нова категория' : 'Нова подкатегория'}</span>
                      <h3 className="text-white font-semibold text-lg">{s.name}</h3>
                      <p className="text-gray-400 text-sm">от {s.specialist.user.name} ({s.specialist.user.email})</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      s.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      s.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {s.status === 'PENDING' ? 'Чака' : s.status === 'APPROVED' ? 'Одобрено' : 'Отхвърлено'}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2"><span className="text-gray-500">Описание:</span> {s.description}</p>
                  <p className="text-gray-300 mb-4"><span className="text-gray-500">Причина:</span> {s.reason}</p>
                  {s.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSuggestion(s.id, 'APPROVED')}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/40 text-sm"
                      >
                        ✓ Одобри
                      </button>
                      <button
                        onClick={() => handleSuggestion(s.id, 'REJECTED')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm"
                      >
                        ✗ Отхвърли
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
