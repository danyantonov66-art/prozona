import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import InquiryActions from './InquiryActions'

export default async function SpecialistInquiriesPage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  const specialist = await prisma.specialist.findUnique({
    where: { userId: session.user.id }
  })

  if (!specialist) redirect('/become-specialist')

  const inquiries = await prisma.inquiry.findMany({
    where: { specialistId: specialist.id },
    orderBy: { createdAt: 'desc' },
    include: {
      responses: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Получени запитвания</h1>
            <p className="text-gray-400 mt-1">Кредити: <span className="text-[#1DB954] font-bold">{specialist.credits}</span></p>
          </div>
          <Link href="/specialist/dashboard" className="text-[#1DB954] hover:underline">
            ← Назад към таблото
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <p className="text-gray-400 text-xl mb-2">Все още няма запитвания</p>
            <p className="text-gray-500 text-sm">Когато клиент изпрати запитване, ще се появи тук.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{inquiry.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString('bg-BG', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    inquiry.status === 'PENDING' ? 'bg-[#1DB954] text-white' :
                    inquiry.status === 'VIEWED' ? 'bg-yellow-500/20 text-yellow-400' :
                    inquiry.status === 'REPLIED' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {inquiry.status === 'PENDING' ? 'Ново' :
                     inquiry.status === 'VIEWED' ? 'Прочетено' :
                     inquiry.status === 'REPLIED' ? 'Отговорено' : inquiry.status}
                  </span>
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-line">{inquiry.message}</p>

                <div className="flex gap-4 text-sm text-gray-400 mb-2">
                  <span>📧 {inquiry.email}</span>
                  {inquiry.phone && <span>📞 {inquiry.phone}</span>}
                  <span>📍 {inquiry.city}</span>
                </div>

                {inquiry.responses[0] && (
                  <div className="mt-3 p-3 bg-[#0D0D1A] rounded-lg border-l-2 border-[#1DB954]">
                    <p className="text-gray-400 text-xs mb-1">Твоят отговор:</p>
                    <p className="text-gray-300 text-sm">{inquiry.responses[0].message}</p>
                  </div>
                )}

                <InquiryActions inquiryId={inquiry.id} status={inquiry.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}