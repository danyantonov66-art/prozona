import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: "Неоторизиран" }, { status: 401 })

    const specialist = await prisma.specialist.findUnique({
      where: { userId: (session.user as any).id },
      include: {
        user: true,
        gallery: { orderBy: { sortOrder: "asc" } }
      }
    })

    if (!specialist) return NextResponse.json({ error: "Специалистът не е намерен" }, { status: 404 })

    return NextResponse.json(specialist)
  } catch (error) {
    console.error("Error fetching specialist:", error)
    return NextResponse.json({ error: "Грешка при зареждане" }, { status: 500 })
  }
}
