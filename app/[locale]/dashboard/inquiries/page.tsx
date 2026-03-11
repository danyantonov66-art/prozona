import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function SpecialistInquiriesPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  console.log('DASHBOARD SESSION:', session)

  if (!session?.user?.email) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard/inquiries`)
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      specialist: true,
    },
  })

  console.log('DASHBOARD USER:', user)
  console.log('DASHBOARD SPECIALIST:', user?.specialist)

  if (!user?.specialist) {
    redirect(`/${locale}`)
  }

  const inquiries = await prisma.inquiry.findMany({
    where: {
      specialistId: user.specialist.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  console.log('DASHBOARD INQUIRIES:', inquiries)

  return (
    <main className="min-h-screen bg-[#0D0D1A]">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PZ</span>
            </div>
            <span className="text-white font-semibold text-xl">ProZona</span>
          </Link>

          <Link
            href={`/${locale}/specialist/${user.specialist.id}`}
            className="text-[#1DB954] hover:underline"
          >
            Към профила
          </Link>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Получени запитвания</h1>
          <p className="text-gray-400 mb-8">Общо: {inquiries.length}</p>

          {inquiries.length === 0 ? (
            <div className="bg-[#1A1A2E] rounded-lg p-8 text-center text-gray-400">
              Все още нямате получени запитвания.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-[#1A1A2E] rounded-lg p-6 border border-gray-800"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{inquiry.name}</h2>
                      <p className="text-gray-300">{inquiry.email}</p>
                      <p className="text-gray-300">{inquiry.phone}</p>
                    </div>

                    <div className="text-sm text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleString('bg-BG')}
                    </div>
                  </div>

                  <div className="bg-[#0D0D1A] rounded-lg p-4 border border-gray-800">
                    <p className="text-gray-200 whitespace-pre-line">{inquiry.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}