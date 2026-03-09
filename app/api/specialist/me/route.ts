import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId },
      include: {
        user: true,
        GalleryImage: {
          orderBy: { sortOrder: "asc" }
        },
        SpecialistCategory: {
          include: {
            Category: true,
            Subcategory: true
          }
        }
      }
    })

    if (!specialist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json(specialist)
  } catch (error) {
    console.error("Specialist me error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}