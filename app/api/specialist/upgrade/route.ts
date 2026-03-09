import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { categories } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { categoryId, businessName, city, phone, description } = body ?? {}

    if (!categoryId) {
      return NextResponse.json(
        { error: "Липсва категория" },
        { status: 400 }
      )
    }

    const existingSpecialist = await prisma.specialist.findUnique({
      where: { userId }
    })

    if (existingSpecialist) {
      return NextResponse.json(
        { error: "Вече имате профил на специалист" },
        { status: 400 }
      )
    }

    const selectedCategory = categories.find((c) => c.id === categoryId)

    if (!selectedCategory) {
      return NextResponse.json(
        { error: "Невалидна категория" },
        { status: 404 }
      )
    }

    const categorySlug = selectedCategory.slug

    let categoryRecord = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!categoryRecord) {
      categoryRecord = await prisma.category.findUnique({
        where: { name: selectedCategory.name }
      })
    }

    if (categoryRecord && categoryRecord.slug !== categorySlug) {
      categoryRecord = await prisma.category.update({
        where: { id: categoryRecord.id },
        data: {
          slug: categorySlug,
          name: selectedCategory.name,
          description:
            categoryRecord.description ||
            selectedCategory.description ||
            selectedCategory.name,
          icon: categoryRecord.icon || selectedCategory.icon || null,
          isActive: true,
          updatedAt: new Date()
        }
      })
    }

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: selectedCategory.name,
          slug: categorySlug,
          description: selectedCategory.description || selectedCategory.name,
          icon: selectedCategory.icon || null,
          sortOrder: 0,
          isActive: true,
          updatedAt: new Date()
        }
      })
    }

    const specialist = await prisma.specialist.create({
      data: {
        id: userId,
        userId,
        businessName: businessName || null,
        description: description || null,
        city: city || null,
        serviceAreas: city ? [city] : [],
        phone: phone || null,
        verified: false,
        credits: 0,
        totalCreditsUsed: 0,
        maxPriceListItems: 0,
        creditPrice: 2.99,
        SpecialistCategory: {
          create: {
            categoryId: categoryRecord.id
          }
        }
      },
      include: {
        user: true,
        SpecialistCategory: {
          include: {
            Category: true,
            Subcategory: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        success: true,
        specialist
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Specialist upgrade error:", error)
    return NextResponse.json(
      { error: "Failed to upgrade specialist" },
      { status: 500 }
    )
  }
}