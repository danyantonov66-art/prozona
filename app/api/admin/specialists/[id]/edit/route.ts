// app/api/admin/specialists/[id]/edit/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json()
    const { description, city, businessName, categoryId, subcategoryId, categories } = body

    // Обнови основните полета
    const specialist = await prisma.specialist.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(city !== undefined && { city }),
        ...(businessName !== undefined && { businessName }),
      },
    })

    // Поддържа и стар формат (categoryId) и нов (categories масив)
    const categoriesInput = categories && Array.isArray(categories)
      ? categories
      : categoryId !== undefined
      ? [{ categoryId: Number(categoryId), subcategoryId: subcategoryId ? Number(subcategoryId) : null }]
      : null

    if (categoriesInput && categoriesInput.length > 0) {
      // Изтрий старите категории
      await prisma.specialistCategory.deleteMany({ where: { specialistId: id } })

      // Добави новите категории
      for (const cat of categoriesInput) {
        if (!cat.categoryId) continue
        await prisma.specialistCategory.create({
          data: {
            specialistId: id,
            categoryId: Number(cat.categoryId),
            subcategoryId: cat.subcategoryId ? Number(cat.subcategoryId) : null,
          },
        })
      }
    }

    return NextResponse.json({ success: true, specialist })
  } catch (error) {
    console.error("Admin edit specialist error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}