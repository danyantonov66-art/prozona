import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id

    const specialist = await prisma.specialist.findUnique({
      where: { userId },
      include: {
        user: true,
        GalleryImage: true,
      },
    })

    if (!specialist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...specialist,
      gallery: specialist.GalleryImage || [],
    })
  } catch (error) {
    console.error("Specialist me error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
