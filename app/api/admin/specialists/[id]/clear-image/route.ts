import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const specialist = await prisma.specialist.findUnique({
    where: { id: params.id },
    select: { userId: true }
  })

  if (!specialist) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await prisma.user.update({
    where: { id: specialist.userId },
    data: { image: null }
  })

  return NextResponse.json({ success: true })
}