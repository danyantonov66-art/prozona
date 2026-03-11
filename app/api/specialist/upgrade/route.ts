import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { categories } from "../../../../lib/constants"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id
    const body = await request.json()
    const { categoryId, businessName, city, phone, description } = body ?? {}

    if (!categoryId) {
      return NextResponse.json({ error: "Missing categoryId" }, { status: 400 })
    }

    const selectedCategory = categories.find((c: any) => c.id === categoryId)
    if (!selectedCategory) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // Find or create category
    let categoryRecord = await prisma.category.findUnique({
      where: { slug: selectedCategory.slug },
    })
    if (!categoryRecord) {
      categoryRecord = await prisma.category.findUnique({
        where: { name: selectedCategory.name },
      })
    }
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: selectedCategory.name,
          slug: selectedCategory.slug,
          description: selectedCategory.description || selectedCategory.name,
          icon: selectedCategory.icon || null,
          updatedAt: new Date(),
        },
      })
    }

    const specialistData = {
      businessName: businessName || null,
      city: city || "",
      phone: phone || null,
      description: description || "",
      verified: false,
    }

    const existing = await prisma.specialist.findUnique({ where: { userId } })

    const specialist = existing
      ? await prisma.specialist.update({
          where: { userId },
          data: specialistData,
          include: { user: true },
        })
      : await prisma.specialist.create({
          data: { userId, ...specialistData },
          include: { user: true },
        })

    // Upsert SpecialistCategory relation
    await prisma.specialistCategory.upsert({
      where: {
        specialistId_categoryId_subcategoryId: {
          specialistId: specialist.id,
          categoryId: categoryRecord.id,
          subcategoryId: null,
        },
      },
      update: {},
      create: {
        specialistId: specialist.id,
        categoryId: categoryRecord.id,
      },
    })

    return NextResponse.json({ success: true, specialist })
  } catch (error) {
    console.error("Specialist upgrade error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}