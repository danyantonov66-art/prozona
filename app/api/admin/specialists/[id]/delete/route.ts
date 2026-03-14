import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const specialist = await prisma.specialist.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!specialist) {
      return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
    }

    // Изтриваме специалиста (каскадно изтрива свързаните записи)
    await prisma.specialist.delete({ where: { id } })

    // Сменяме ролята на потребителя обратно на CLIENT
    await prisma.user.update({
      where: { id: specialist.userId },
      data: { role: "CLIENT" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete specialist error:", error)
    return NextResponse.json({ error: "Failed to delete specialist" }, { status: 500 })
  }
}