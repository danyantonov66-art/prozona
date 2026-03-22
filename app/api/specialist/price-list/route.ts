import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const specialist = await prisma.specialist.findUnique({
      where: { userId: (session.user as any).id }
    })
    if (!specialist) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { name, price, description, unit } = await request.json()
    if (!name) return NextResponse.json({ error: 'Името е задължително' }, { status: 400 })

    const item = await prisma.priceListItem.create({
      data: {
        specialistId: specialist.id,
        name,
        price: price || null,
        description: description || null,
        unit: unit || 'лв.',
        updatedAt: new Date(),
      }
    })

    return NextResponse.json({ success: true, item })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}