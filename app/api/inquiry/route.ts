import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      specialistId,
      name,
      email,
      phone,
      message,
    } = body

    if (!specialistId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const specialist = await prisma.specialist.findUnique({
      where: { id: specialistId },
      include: {
        user: true,
      },
    })

    if (!specialist) {
      return NextResponse.json(
        { error: "Specialist not found" },
        { status: 404 }
      )
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        specialistId: specialist.id,
        categoryId: specialist.categoryId ?? null,
        clientName: name,
        clientEmail: email,
        clientPhone: phone || null,
        message,
        status: "PENDING",
      },
    })

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("Inquiry create error:", error)
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    )
  }
}