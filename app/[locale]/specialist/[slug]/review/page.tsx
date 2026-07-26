import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import ProZonaHeader from "@/components/header/ProZonaHeader"
import ProZonaFooter from "@/components/footer/ProZonaFooter"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import ReviewForm from "./ReviewForm"

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export const dynamic = "force-dynamic"

export default async function WriteReviewPage({ params }: Props) {
  const { locale, slug } = await params

  const specialist = await prisma.specialist.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { user: true },
  })

  if (!specialist) notFound()

  if (specialist.slug && specialist.slug !== slug) {
    redirect(`/${locale}/specialist/${specialist.slug}/review`)
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/specialist/${slug}/review`)
  }

  const name = specialist.businessName || specialist.user?.name || "Специалист"

  return (
    <main className="min-h-screen bg-[#0D0D1A] text-white">
      <ProZonaHeader locale={locale} />
      <section className="mx-auto max-w-2xl px-4 py-10">
        <Link href={`/${locale}/specialist/${specialist.slug || specialist.id}`} className="text-[#1DB954] hover:underline mb-6 inline-block text-sm">
          ← Назад към профила
        </Link>

        <div className="bg-[#151528] border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">Напиши отзив за {name}</h1>
          <p className="text-gray-400 mb-6 text-sm">
            Отзивите са достъпни само за клиенти със завършена работа със специалиста.
          </p>
          <ReviewForm
            specialistId={specialist.id}
            specialistName={name}
            specialistSlug={specialist.slug || undefined}
          />
        </div>
      </section>
      <ProZonaFooter locale={locale} />
    </main>
  )
}
