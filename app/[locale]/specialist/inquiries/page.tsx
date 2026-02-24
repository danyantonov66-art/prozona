// app/specialist/inquiries/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SpecialistInquiriesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  // Намери специалиста
  const specialist = await prisma.specialist.findUnique({
    where: { userId: session.user.id }
  })

  if (!specialist) {
    redirect('/become-specialist')
  }

  console.log('🔍 Specialist ID:', specialist.id)

  // Вземи всички запитвания за този специалист
  const inquiries = await prisma.inquiry.findMany({
    where: { specialistId: specialist.id },
    orderBy: { createdAt: 'desc' },
    include: {
      client: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      }
    }
  })

  console.log('📦 Намерени запитвания:', inquiries.length)

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Получени запитвания</h1>
          <Link href="/specialist/dashboard" className="text-[#1DB954] hover:underline">
            ← Назад към таблото
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <p className="text-gray-400">Все още няма получени запитвания.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{inquiry.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(inquiry.createdAt).toLocaleDateString('bg-BG')}
                    </p>
                  </div>
                  {inquiry.viewedBy === 0 && (
                    <span className="bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full">
                      Ново
                    </span>
                  )}
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-line">{inquiry.message}</p>

                <div className="flex gap-4 text-sm text-gray-400">
                  <span>📧 {inquiry.email}</span>
                  {inquiry.phone && <span>📞 {inquiry.phone}</span>}
                </div>

                <div className="mt-4 flex gap-3">
                  <button 
                    className="px-4 py-2 bg-[#1DB954] text-white rounded-lg hover:bg-[#169b43]"
                    onClick={() => {
                      // Тук ще добавим функция за отговор
                    }}
                  >
                    Отговори (1 кредит)
                  </button>
                  <button 
                    className="px-4 py-2 bg-[#1A1A2E] border border-gray-700 text-white rounded-lg hover:bg-[#25253a]"
                    onClick={() => {
                      // Тук ще добавим маркиране като прочетено
                    }}
                  >
                    Маркирай като прочетено
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}