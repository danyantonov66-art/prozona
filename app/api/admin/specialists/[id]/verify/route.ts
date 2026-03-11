import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Props {
  params: Promise<{
    id: string
  }>
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.specialist.findUnique({
      where: { id },
      select: { id: true, verified: true },
    })

    if (!existing) {
      return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
    }

    const specialist = await prisma.specialist.update({
      where: { id },
      data: {
        verified: !existing.verified,
      },
    })

    return NextResponse.json({
      success: true,
      specialist,
    })
  } catch (error) {
    console.error("Verify specialist error:", error)
    return NextResponse.json(
      { error: "Failed to verify specialist" },
      { status: 500 }
    )
  }
}
