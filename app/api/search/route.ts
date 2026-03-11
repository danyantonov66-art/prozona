import { prisma } from "../../../lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get("q")?.trim() || ""
    const city = searchParams.get("city")?.trim() || ""

    const specialists = await prisma.specialist.findMany({
      where: {
        isVerified: true,
        city: city || undefined,
        OR: [
          {
            businessName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            user: {
              is: {
                name: {
                  contains: q,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(
      specialists.map((specialist) => ({
        id: specialist.id,
        name: specialist.businessName || specialist.user?.name || "Специалист",
        city: specialist.city,
        description: specialist.description,
        image: specialist.images?.[0] || specialist.user?.image || null,
      }))
    )
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search" }, { status: 500 })
  }
}