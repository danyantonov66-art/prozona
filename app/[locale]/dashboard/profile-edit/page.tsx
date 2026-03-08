import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
    redirect(`/${locale}/login`)
  }

  const userId = (session.user as any)?.id

  const specialist = await prisma.specialist.findUnique({
    where: { userId },
    include: {
      gallery: true,
    },
  })

  if (!specialist) {
    redirect(`/${locale}/dashboard`)
  }

  const initialData = {
    businessName: specialist.businessName || "",
    description: specialist.description || "",
    phone: specialist.phone || "",
    experienceYears: specialist.experienceYears || 0,
    city: specialist.city || "",
    profileImage: specialist.profileImage || "",
    galleryImages: specialist.gallery.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
    })),
  }

  return (
    <main className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Редакция на профила</h1>
            <p className="mt-2 text-gray-400">
              Обнови информацията и снимките на специалист профила си.
            </p>
          </div>

          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center rounded-lg border border-gray-600 px-4 py-2 text-gray-300 transition hover:bg-gray-700"
          >
            Назад
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <EditSpecialistProfileForm initialData={initialData} locale={locale} />
        </div>
      </div>
    </main>
  )
}