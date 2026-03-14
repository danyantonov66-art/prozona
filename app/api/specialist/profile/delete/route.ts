import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id

    const specialist = await prisma.specialist.findUnique({
      where: { userId },
    })

    if (!specialist) {
      return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
    }

    await prisma.specialist.delete({ where: { id: specialist.id } })

    await prisma.user.update({
      where: { id: userId },
      data: { role: "CLIENT" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete specialist error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}