import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const specialists = await prisma.specialist.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        GalleryImage: {
          select: {
            id: true,
            imageUrl: true,
            title: true,
          },
        },
        SpecialistCategory: {
          select: {
            Category: { select: { id: true, name: true } },
            Subcategory: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(specialists)
  } catch (error) {
    console.error('Admin specialists error:', error)
    return NextResponse.json(
      { error: 'Failed to load specialists' },
      { status: 500 }
    )
  }
}
