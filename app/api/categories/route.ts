import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      Subcategory: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }
    }
  })
  return NextResponse.json(categories)
}