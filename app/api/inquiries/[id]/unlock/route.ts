import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const CREDIT_PRICE = 1

interface Props {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "SPECIALIST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any)?.id

    const specialist = await prisma.specialist.findUnique({ where: { userId } })
    if (!specialist) {
      return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
    }

    if (specialist.credits < CREDIT_PRICE) {
      return NextResponse.json(
        { error: "Нямаш достатъчно кредити" },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { InquiryResponse: true },
    })

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }

    // Вече отключено
    const alreadyUnlocked = inquiry.InquiryResponse.some(
      (r) => r.specialistId === specialist.id
    )
    if (alreadyUnlocked) {
      return NextResponse.json(
        { error: "Вече е отключено" },
        { status: 400 }
      )
    }

    // Максимум 5 специалиста
    if (inquiry.InquiryResponse.length >= 5) {
      return NextResponse.json(
        { error: "Максималният брой специалисти е достигнат" },
        { status: 400 }
      )
    }

    await prisma.$transaction([
      prisma.specialist.update({
        where: { id: specialist.id },
        data: {
          credits: { decrement: CREDIT_PRICE },
          totalCreditsUsed: { increment: CREDIT_PRICE },
        },
      }),
      prisma.inquiryResponse.create({
        data: {
          id: `${specialist.id}-${id}-${Date.now()}`,
          inquiryId: id,
          specialistId: specialist.id,
          message: "unlocked",
          creditsSpent: CREDIT_PRICE,
        },
      }),
      prisma.creditTransaction.create({
        data: {
          id: `tx-${specialist.id}-${id}-${Date.now()}`,
          specialistId: specialist.id,
          amount: -CREDIT_PRICE,
          type: "USAGE",
          description: `Отключено запитване ${id}`,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      contact: {
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
      },
    })
  } catch (error) {
    console.error("Unlock error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}