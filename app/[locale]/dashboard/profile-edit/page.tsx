import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import EditSpecialistProfileForm from "../EditSpecialistProfileForm"

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function ProfileEditPage({ params }: Props) {
  const { locale } = await params
  const session = await getServerSession(authOptions)

  if (!session) {
    notFound()
  }

  const userId = (session.user as any)?.id

  const specialist = await prisma.specialist.findUnique({
    where: { userId },
    include: {
      user: true,
      galleryImages: true
    }
  })

  if (!specialist) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] pt-24">
      <div className="container mx-auto px-4 py-10 max-w-3xl">

        <Link
          href={`/${locale}/dashboard`}
          className="text-[#1DB954] hover:underline mb-6 inline-block"
        >
          ← Назад към таблото
        </Link>

        <div className="bg-[#151528] border border-white/10 rounded-2xl p-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Редакция на профила
          </h1>

          <p className="text-gray-400 mb-8">
            Промени информацията за твоя специалист профил
          </p>

          <EditSpecialistProfileForm
            specialist={{
              id: specialist.id,
              businessName: specialist.businessName,
              description: specialist.description,
              city: specialist.city,
              phone: specialist.phone,
              experienceYears: specialist.experienceYears,
              images: specialist.GalleryImage
            }}
          />

        </div>
      </div>
    </main>
  )
}