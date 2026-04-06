import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await request.json()
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 })

    await prisma.user.update({
      where: { id: userId },
      data: { role: "SPECIALIST" },
    })

    const existing = await prisma.specialist.findUnique({ where: { userId } })
    if (!existing) {
      await prisma.specialist.create({
        data: {
          user: { connect: { id: userId } },
          verified: false,
          description: "",
          city: "",
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Change role error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}