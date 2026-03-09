import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const specialists = await prisma.specialist.findMany({
      where: { verified: false },
      include: {
        user: true,
        SpecialistCategory: {
          include: {
            Category: true,
            Subcategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(specialists)
  } catch (error) {
    console.error("Pending specialists error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pending specialists" },
      { status: 500 }
    )
  }
}