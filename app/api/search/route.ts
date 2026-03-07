import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const q = (searchParams.get('q') || '').trim()
    const city = (searchParams.get('city') || '').trim()

    if (!q) {
      return NextResponse.json({ results: [] })
    }

    const specialists = await prisma.specialist.findMany({
      where: {
        verified: true,
        ...(city
          ? {
              city: {
                contains: city,
                mode: 'insensitive',
              },
            }
          : {}),
        OR: [
          {
            businessName: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: q,
              mode: 'insensitive',
            },
          },
          {
            user: {
              name: {
                contains: q,
                mode: 'insensitive',
              },
            },
          },
          {
            categories: {
              some: {
                category: {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
          {
            categories: {
              some: {
                subcategory: {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
            subcategory: true,
          },
        },
      },
      take: 20,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const results = specialists.map((s) => ({
      type: 'specialist',
      id: s.id,
      name: s.businessName || s.user.name || 'Специалист',
      icon: '👤',
      matchType: 'specialist',
      city: s.city,
      verified: s.verified,
      description: s.description,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)

    return NextResponse.json(
      { error: 'Грешка при търсене' },
      { status: 500 }
    )
  }
}