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
      city,
      categoryId,
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
        SpecialistCategory: {
          include: { Category: true },
          take: 1,
        },
      },
    })

    if (!specialist) {
      return NextResponse.json(
        { error: "Specialist not found" },
        { status: 404 }
      )
    }

    const resolvedCategoryId =
      categoryId ??
      specialist.SpecialistCategory?.[0]?.categoryId ??
      1

    const resolvedCity = city ?? specialist.city ?? ""

    const inquiry = await prisma.inquiry.create({
      data: {
        specialistId: specialist.id,
        name,
        email,
        phone: phone || null,
        message,
        city: resolvedCity,
        categoryId: resolvedCategoryId,
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