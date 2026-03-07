import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const specialist = await prisma.specialist.update({
      where: { id },
      data: {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: (session.user as any)?.id || null
      }
    })

    return NextResponse.json(specialist)
  } catch (error) {
    console.error("Approve error:", error)
    return NextResponse.json({ error: "Approve failed" }, { status: 500 })
  }
}