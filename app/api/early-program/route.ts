import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const EARLY_PROGRAM_LIMIT = 200

export async function GET() {
  const count = await prisma.specialist.count()
  return NextResponse.json({
    count,
    limit: EARLY_PROGRAM_LIMIT,
    spotsLeft: Math.max(0, EARLY_PROGRAM_LIMIT - count),
    active: count < EARLY_PROGRAM_LIMIT,
  })
}