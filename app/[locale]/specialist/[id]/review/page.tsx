// app/specialist/[id]/review/page.tsx
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ReviewForm from './ReviewForm'
import Link from 'next/link'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ReviewPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  console.log('🔍 Review Page - ID от params:', id) // ← ДОБАВИ ТОВА

  // Само клиенти могат да пишат отзиви
  if (!session || session.user?.role !== 'CLIENT') {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-[#1A1A2E] rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Нямате достъп</h1>
          <p className="text-gray-400 mb-6">Само клиенти могат да пишат отзиви.</p>
          <Link href={`/specialist/${id}`} className="text-[#1DB954] hover:underline">
            ← Назад към профила
          </Link>
        </div>
      </div>
    )
  }

  // Намери специалиста
  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!specialist) {
    notFound()
  }

  // Провери дали клиентът вече е писал отзив
  const existingReview = await prisma.review.findUnique({
    where: {
      specialistId_clientId: {
        specialistId: id,
        clientId: session.user.id
      }
    }
  })

  if (existingReview) {
    return (
      <div className="min-h-screen bg-[#0D0D1A] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-[#1A1A2E] rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Вече сте написали отзив</h1>
          <p className="text-gray-400 mb-6">
            Можете да напишете само един отзив за {specialist.user.name}.
          </p>
          <Link href={`/specialist/${id}`} className="text-[#1DB954] hover:underline">
            ← Назад към профила
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D1A] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Link href={`/specialist/${id}`} className="text-[#1DB954] hover:underline mb-4 inline-block">
          ← Назад към профила
        </Link>

        <div className="bg-[#1A1A2E] rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Напишете отзив за</h1>
          <p className="text-xl text-[#1DB954] mb-6">{specialist.user.name}</p>

          {/* ТУК СЕ ПОДАВА ID-ТО */}
          <ReviewForm specialistId={id} specialistName={specialist.user.name} />
        </div>
      </div>
    </div>
  )
}