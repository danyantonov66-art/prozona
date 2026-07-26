import { prisma } from "@/lib/prisma"
import { notFound, permanentRedirect } from "next/navigation"

export const dynamic = "force-dynamic"

interface Props {
  params: Promise<{
    locale: string
    id: string
  }>
}

export default async function SpecialistOldPluralPage({ params }: Props) {
  const { locale, id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    select: { slug: true },
  })

  if (!specialist) notFound()

  permanentRedirect(`/${locale}/specialist/${specialist.slug || id}`)
}
