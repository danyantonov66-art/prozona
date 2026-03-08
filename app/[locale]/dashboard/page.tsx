import Link from "next/link"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
      user: true,
    },
  })

  if (!specialist) {
    redirect(`/${locale}/dashboard`)
  }

  async function updateProfile(formData: FormData) {
    "use server"

    const session = await getServerSession(authOptions)
    if (!session) {
      redirect(`/${locale}/login`)
    }

    const userId = (session.user as any)?.id

    const name = String(formData.get("name") || "").trim()
    const businessName = String(formData.get("businessName") || "").trim()
    const city = String(formData.get("city") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const description = String(formData.get("description") || "").trim()

    const currentSpecialist = await prisma.specialist.findUnique({
      where: { userId },
    })

    if (!currentSpecialist) {
      redirect(`/${locale}/dashboard`)
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
      },
    })

    await prisma.specialist.update({
      where: { userId },
      data: {
        businessName,
        city,
        phone,
        description,
      },
    })

    revalidatePath(`/${locale}/dashboard`)
    revalidatePath(`/${locale}/dashboard/profile-edit`)
    revalidatePath(`/${locale}/specialist/${currentSpecialist.id}`)

    redirect(`/${locale}/dashboard`)
  }

  return (
    <main className="min-h-screen bg-[#0B1220] text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Редакция на профила</h1>
          <p className="mt-2 text-gray-400">
            Обнови основната информация за публичния си профил.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <form action={updateProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Име
              </label>
              <input
                type="text"
                name="name"
                defaultValue={specialist.user?.name || ""}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Име на бизнес / профил
              </label>
              <input
                type="text"
                name="businessName"
                defaultValue={specialist.businessName || ""}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Град
              </label>
              <input
                type="text"
                name="city"
                defaultValue={specialist.city || ""}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Телефон
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={specialist.phone || ""}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Описание
              </label>
              <textarea
                name="description"
                rows={6}
                defaultValue={specialist.description || ""}
                className="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none transition focus:border-[#1DB954]"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-[#1DB954] px-5 py-2.5 font-medium text-white transition hover:opacity-90"
              >
                Запази промените
              </button>

              <Link
                href={`/${locale}/dashboard`}
                className="inline-flex items-center rounded-lg border border-gray-600 px-5 py-2.5 text-gray-300 transition hover:bg-gray-700"
              >
                Назад към таблото
              </Link>

              <Link
                href={`/${locale}/specialist/${specialist.id}`}
                className="inline-flex items-center rounded-lg border border-white/10 px-5 py-2.5 text-gray-300 transition hover:bg-white/10"
              >
                Виж публичния профил
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
