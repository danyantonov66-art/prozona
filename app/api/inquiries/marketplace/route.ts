import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const role = (session.user as any)?.role
    if (!session || (role !== "SPECIALIST" && role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city") || ""
    const categoryId = searchParams.get("categoryId") || ""

    const where: any = {
      status: "PENDING",
    }

    if (city) where.city = { contains: city, mode: "insensitive" }
    if (categoryId) where.categoryId = Number(categoryId)

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        Category: true,
        InquiryResponse: { select: { specialistId: true } },
      },
    })

    const specialistId = (session.user as any)?.specialistId

    const result = inquiries
      .filter((inq) => inq.InquiryResponse.length < 5) // max 5 специалисти
      .map((inq) => {
        const isUnlocked = inq.InquiryResponse.some((r) => r.specialistId === specialistId)
        const ageMs = Date.now() - new Date(inq.createdAt).getTime()
        const isNew = ageMs < 2 * 60 * 60 * 1000 // под 2 часа
        const isUrgent = inq.message.toLowerCase().includes("спешно") ||
          inq.message.toLowerCase().includes("спешна") ||
          inq.message.toLowerCase().includes("urgent")

        return {
          id: inq.id,
          title: inq.Category?.name || "Запитване",
          city: inq.city,
          message: inq.message,
          createdAt: inq.createdAt,
          categoryId: inq.categoryId,
          categoryName: inq.Category?.name || "",
          creditPrice: 2,
          unlockedCount: inq.InquiryResponse.length,
          isUnlocked,
          isNew,
          isUrgent,
          // Контактът се показва само ако е отключен
          contact: isUnlocked ? { name: inq.name, phone: inq.phone, email: inq.email } : null,
        }
      })

    return NextResponse.json({ inquiries: result })
  } catch (error) {
    console.error("Marketplace error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}