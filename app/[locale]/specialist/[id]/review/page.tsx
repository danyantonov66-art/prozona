import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"

import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import ReviewForm from "@/components/reviews/ReviewForm"

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function ReviewPage({ params }: Props) {
  const { locale, id } = await params

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(`/${locale}/login`)
  }

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    include: {
      user: true,
    },
  })

  if (!specialist) {
    notFound()
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      specialistId: id,
      user: {
        is: {
          id: (session.user as any).id,
        },
      },
    },
  })

  if (existingReview) {
    redirect(`/${locale}/specialist/${id}`)
  }

  const specialistName =
    specialist.businessName ||
    specialist.user?.name ||
    "Специалист"

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-[#151528] p-8">

          <h1 className="text-2xl font-bold text-white mb-2">
            Напишете отзив за
          </h1>

          <p className="text-xl text-[#1DB954] mb-6">
            {specialistName}
          </p>

          <ReviewForm
            specialistId={id}
            specialistName={specialistName}
          />

        </div>
      </div>

      <ProZonaFooter locale={locale} />
    </main>
  )
}