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

    const specialist = await prisma.specialist.update({
      where: { id },
      data: {
        isVerified: true,
      },
    })

    return NextResponse.json({
      success: true,
      specialist,
    })
  } catch (error) {
    console.error("Approve specialist error:", error)
    return NextResponse.json(
      { error: "Failed to approve specialist" },
      { status: 500 }
    )
  }
}