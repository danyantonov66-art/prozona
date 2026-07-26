import { prisma } from "@/lib/prisma"
import { notFound, permanentRedirect } from "next/navigation"

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function SpecialistOldPage({ params }: Props) {
  const { id } = await params

  const specialist = await prisma.specialist.findUnique({
    where: { id },
    select: { slug: true }
  })

  if (!specialist) notFound()

  permanentRedirect(`/bg/specialist/${specialist.slug || id}`)
}