import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/prisma"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const userId = (session.user as any)?.id
    const { imageUrl, type } = await request.json()

    const specialist = await prisma.specialist.findUnique({ where: { userId } })
    if (!specialist) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.galleryImage.updateMany({
      where: { specialistId: specialist.id, imageUrl },
      data: { type }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update by URL error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}