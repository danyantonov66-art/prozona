import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/prisma"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = (session.user as any)?.id
    const { id, title, description } = await request.json()

    const specialist = await prisma.specialist.findUnique({ where: { userId } })
    if (!specialist) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const image = await prisma.galleryImage.update({
      where: { id, specialistId: specialist.id },
      data: { title: title || null, description: description || null },
    })

    return NextResponse.json({ success: true, image })
  } catch (error) {
    console.error("Gallery update error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}