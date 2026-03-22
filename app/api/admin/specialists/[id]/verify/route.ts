import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { id: params.id }
    })

    if (!specialist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const updated = await prisma.specialist.update({
      where: { id: params.id },
      data: {
        verified: !specialist.verified,
        verifiedAt: !specialist.verified ? new Date() : null,
      }
    })

    return NextResponse.json({ success: true, verified: updated.verified })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}