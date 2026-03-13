import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { specialistId, name, email, phone, message, city, categoryId } = body

    if (!name || !email || !message || !city || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Ако е посочен специалист — проверяваме дали съществува
    if (specialistId) {
      const specialist = await prisma.specialist.findUnique({ where: { id: specialistId } })
      if (!specialist) {
        return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        specialistId: specialistId || null,
        name,
        email,
        phone: phone || null,
        message,
        city,
        categoryId: Number(categoryId),
        status: "PENDING",
      },
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("Inquiry create error:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}