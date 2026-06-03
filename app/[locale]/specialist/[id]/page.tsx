import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function SpecialistRedirectPage({ params }: Props) {
  const { locale, id } = await params

  // Ако изглежда като slug (съдържа букви и тирета) — вече е slug, пропусни
  const isSlug = /[a-z]/.test(id) && id.includes('-') && id.length > 10

  const specialist = await prisma.specialist.findFirst({
    where: isSlug ? { slug: id } : { id },
    select: { slug: true, id: true }
  })

  if (!specialist) notFound()

  // Ако има slug — redirect към него
  if (specialist.slug) {
    redirect(`/${locale}/specialist/${specialist.slug}`)
  }

  // Fallback — няма slug все още
  notFound()
}