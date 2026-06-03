import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ClientInquiriesPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect(`/${locale}/login`)
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) redirect(`/${locale}/login`)

  const inquiries = await prisma.inquiry.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      InquiryResponse: {
        orderBy: { createdAt: 'asc' },
        include: {
          Specialist: {
            select: { id: true, slug: true, user: { select: { name: true } } }
          }
        }
      },
      specialist: {
        select: { id: true, slug: true, user: { select: { name: true } } }
      }
    }
  })

  return (
    <main className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Моите запитвания</h1>
            <p className="text-sm text-gray-400 mt-1">Общо: {inquiries.length}</p>
          </div>
          <Link href={`/${locale}/dashboard`} className="text-[#1DB954] hover:underline text-sm">
            ← Към таблото
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="bg-[#1A1A2E] rounded-lg p-8 text-center">
            <p className="text-gray-400 text-xl mb-2">Все още няма изпратени запитвания</p>
            <p className="text-gray-500 text-sm mb-4">Намери специалист и изпрати запитване.</p>
            <Link
              href={`/${locale}/search`}
              className="inline-block px-6 py-2 bg-[#1DB954] text-black font-medium rounded-lg hover:bg-[#169b43]"
            >
              Търси специалисти
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-[#1A1A2E] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">
                      {new Date(inquiry.createdAt).toLocaleString('bg-BG', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    {inquiry.specialist && (
                      <Link
                        href={`/${locale}/specialist/${inquiry.specialist.slug || inquiry.specialist.id}`}
                        className="text-[#1DB954] hover:underline text-sm mt-1 inline-block"
                      >
                        Специалист: {inquiry.specialist.user.name}
                      </Link>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    inquiry.status === 'PENDING'   ? 'bg-[#1DB954]/20 text-[#1DB954]' :
                    inquiry.status === 'VIEWED'    ? 'bg-yellow-500/20 text-yellow-400' :
                    inquiry.status === 'REPLIED'   ? 'bg-blue-500/20 text-blue-400' :
                    inquiry.status === 'COMPLETED' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {inquiry.status === 'PENDING'   ? 'Изпратено' :
                     inquiry.status === 'VIEWED'    ? 'Прочетено' :
                     inquiry.status === 'REPLIED'   ? 'Получен отговор' :
                     inquiry.status === 'COMPLETED' ? 'Завършено' : inquiry.status}
                  </span>
                </div>

                <div className="mb-3 rounded-xl border border-white/5 bg-[#0D0D1A] px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Вашето запитване</p>
                  <p className="text-gray-300 whitespace-pre-line">{inquiry.message}</p>
                </div>

                {inquiry.InquiryResponse.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Отговори от специалиста</p>
                    {inquiry.InquiryResponse.map((resp) => (
                      <div key={resp.id} className="rounded-xl border border-[#1DB954]/20 bg-[#1DB954]/5 px-4 py-3">
                        <p className="text-xs text-[#1DB954] mb-1 font-medium">
                          {resp.Specialist?.user?.name || 'Специалист'}
                        </p>
                        <p className="text-gray-200 whitespace-pre-line text-sm">{resp.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(resp.createdAt).toLocaleString('bg-BG', {
                            day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    Все още няма отговор. Ще получиш имейл при отговор.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}