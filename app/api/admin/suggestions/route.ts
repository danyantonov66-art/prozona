import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const suggestions = await prisma.categorySuggestion.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Suggestions fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    )
  }
}
