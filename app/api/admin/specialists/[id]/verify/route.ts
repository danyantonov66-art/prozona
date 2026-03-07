import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const verified = Boolean(body?.verified)

    const existing = await prisma.specialist.findUnique({
      where: { id },
      select: { id: true, isVerified: true },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Специалистът не е намерен' },
        { status: 404 }
      )
    }

    const specialist = await prisma.specialist.update({
      where: { id },
      data: {
        isVerified: verified,
      },
    })

    return NextResponse.json(specialist)
  } catch (error) {
    console.error('Verify specialist error:', error)

    return NextResponse.json(
      {
        error:
          'Failed to update verification status: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    )
  }
}