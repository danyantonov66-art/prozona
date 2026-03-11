import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"
import { categories } from "../../../lib/constants"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id
    const body = await request.json()

    const {
      businessName,
      description,
      city,
      phone,
      categoryId,
      subcategoryId,
      experience,
    } = body ?? {}

    if (!description || !city || !categoryId || !subcategoryId || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const selectedCategory = categories.find((c: any) => c.id === categoryId)

    if (!selectedCategory) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      )
    }

    const selectedSubcategory = selectedCategory.subcategories?.find(
      (s: any) => s.id === subcategoryId
    )

    if (!selectedSubcategory) {
      return NextResponse.json(
        { error: "Invalid subcategory" },
        { status: 400 }
      )
    }

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
        },
      })
    }

    let subcategoryRecord = await prisma.subcategory.findFirst({
      where: {
        categoryId: categoryRecord.id,
        slug: selectedSubcategory.id,
      },
    })

    if (!subcategoryRecord) {
      subcategoryRecord = await prisma.subcategory.findFirst({
        where: {
          categoryId: categoryRecord.id,
          name: selectedSubcategory.name,
        },
      })
    }

    if (!subcategoryRecord) {
      subcategoryRecord = await prisma.subcategory.create({
        data: {
          categoryId: categoryRecord.id,
          name: selectedSubcategory.name,
          slug: selectedSubcategory.id,
          description: selectedSubcategory.name,
        },
      })
    }

    const existing = await prisma.specialist.findUnique({
      where: { userId },
    })

    const specialist = existing
      ? await prisma.specialist.update({
          where: { userId },
          data: {
            businessName: businessName || null,
            description,
            city,
            phone,
            experience: experience || null,
            categoryId: categoryRecord.id,
            subcategoryId: subcategoryRecord.id,
            isVerified: false,
          },
          include: {
            user: true,
          },
        })
      : await prisma.specialist.create({
          data: {
            userId,
            businessName: businessName || null,
            description,
            city,
            phone,
            experience: experience || null,
            categoryId: categoryRecord.id,
            subcategoryId: subcategoryRecord.id,
            isVerified: false,
          },
          include: {
            user: true,
          },
        })

    return NextResponse.json({ success: true, specialist })
  } catch (error) {
    console.error("Specialist profile error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}