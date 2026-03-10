import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import ProfileEditForm from "@/components/dashboard/ProfileEditForm"

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

  const userId = (session.user as any).id

  const specialist = await prisma.specialist.findUnique({
    where: { userId },
    include: {
      user: true,
    },
  })

  if (!specialist) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />

      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Редакция на профил</h1>

        <ProfileEditForm
          specialist={{
            id: specialist.id,
            businessName: specialist.businessName,
            description: specialist.description,
            city: specialist.city,
            phone: specialist.phone,
            experienceYears: specialist.experience,
            images: (specialist.images || []).map((imageUrl) => ({
              imageUrl,
            })),
            user: {
              name: specialist.user?.name,
              image: specialist.user?.image,
            },
          }}
        />
      </section>

      <ProZonaFooter locale={locale} />
    </main>
  )
}
