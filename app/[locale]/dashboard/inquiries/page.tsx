'use client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function InquiriesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || 'bg'
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`)
    if (status === 'authenticated') {
      fetch('/api/inquiries/my')
        .then(r => r.json())
        .then(data => { setInquiries(Array.isArray(data) ? data : []); setLoading(false) })
        .catch(() => setLoading(false))
    }
  }, [status])

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/${locale}/dashboard`} className="text-gray-400 hover:text-white">← Назад</Link>
          <h1 className="text-3xl font-bold text-white">Моите запитвания</h1>
        </div>
        {loading ? (
          <p className="text-gray-400">Зареждане...</p>
        ) : inquiries.length === 0 ? (
          <div className="bg-[#1A1A2E] rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">Нямате запитвания все още</p>
            <Link href={`/${locale}/specialists`} className="px-6 py-3 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]">
              Намери специалист
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inq: any) => (
              <div key={inq.id} className="bg-[#1A1A2E] rounded-xl p-6 border border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-semibold">{inq.specialist?.user?.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">{inq.message}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{new Date(inq.createdAt).toLocaleDateString('bg-BG')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
