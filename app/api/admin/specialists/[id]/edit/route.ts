// app/api/admin/specialists/[id]/edit/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function containsContactInfo(text: string): boolean {
  const patterns = [
    /(\+359|08|00359)\s?[\d\s\-]{8,}/,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /(https?:\/\/|www\.)/i,
    /facebook\.com|instagram\.com|viber|whatsapp/i,
  ]
  return patterns.some((p) => p.test(text))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { description, city, businessName } = await request.json()

    const specialist = await prisma.specialist.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(city !== undefined && { city }),
        ...(businessName !== undefined && { businessName }),
      }
    })

    return NextResponse.json({ success: true, specialist })
  } catch (error) {
    console.error("Admin edit specialist error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}