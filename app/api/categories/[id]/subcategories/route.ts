import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const subcategories = await prisma.subcategory.findMany({
    where: { categoryId: Number(id), isActive: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(subcategories)
}