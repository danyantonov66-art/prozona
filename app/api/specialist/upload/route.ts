import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id
    const { imageUrl, type } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Missing imageUrl" }, { status: 400 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId },
      include: { GalleryImage: true },
    })

    if (!specialist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (type === "gallery" && (specialist.GalleryImage?.length || 0) >= 5) {
      return NextResponse.json(
        { error: "Gallery limit reached" },
        { status: 400 }
      )
    }

    const isPrimary = type !== "gallery" || specialist.GalleryImage.length === 0

    await prisma.galleryImage.create({
      data: {
        specialistId: specialist.id,
        imageUrl,
        isPrimary,
        sortOrder: specialist.GalleryImage.length,
      },
    })

    const updated = await prisma.specialist.findUnique({
      where: { userId },
      include: { GalleryImage: true },
    })

    return NextResponse.json({ success: true, specialist: updated })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}