import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { categories } from "@/lib/constants"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Трябва да сте влезли в профила си" },
        { status: 401 }
      )
    }

    const userId = (session.user as any)?.id

    if (!userId) {
      return NextResponse.json(
        { error: "Липсва userId в сесията" },
        { status: 400 }
      )
    }

    const body = await request.json()

    const {
      businessName,
      description,
      city,
      categoryId,
      subcategoryId,
      phone
    } = body

    if (!description || !city || !categoryId || !subcategoryId || !phone) {
      return NextResponse.json(
        { error: "Моля, попълнете всички задължителни полета" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Потребителят не съществува" },
        { status: 404 }
      )
    }

    const existingSpecialist = await prisma.specialist.findUnique({
      where: { userId }
    })

    if (existingSpecialist) {
      return NextResponse.json(
        { error: "Вече имате създаден профил на специалист" },
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

    const selectedSubcategory = selectedCategory.subcategories.find(
      (s) => s.id === subcategoryId
    )

    if (!selectedSubcategory) {
      return NextResponse.json(
        { error: "Невалидна подкатегория" },
        { status: 404 }
      )
    }

    // 1) Търсим категория първо по slug
    let categoryRecord = await prisma.category.findUnique({
      where: { slug: selectedCategory.id }
    })

    // 2) Ако няма по slug, търсим по name
    if (!categoryRecord) {
      categoryRecord = await prisma.category.findUnique({
        where: { name: selectedCategory.name }
      })
    }

    // 3) Ако я намерим по name, но slug е различен/липсващ, синхронизираме slug
    if (categoryRecord && categoryRecord.slug !== selectedCategory.id) {
      categoryRecord = await prisma.category.update({
        where: { id: categoryRecord.id },
        data: {
          slug: selectedCategory.id,
          description:
            categoryRecord.description ||
            selectedCategory.description ||
            selectedCategory.name,
          icon: categoryRecord.icon || selectedCategory.icon || null,
          isActive: true
        }
      })
    }

    // 4) Ако изобщо няма категория, създаваме нова
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: selectedCategory.name,
          slug: selectedCategory.id,
          description: selectedCategory.description || selectedCategory.name,
          icon: selectedCategory.icon || null,
          sortOrder: 0,
          isActive: true
        }
      })
    }

    // Подкатегория
    let subcategoryRecord = await prisma.subcategory.findFirst({
      where: {
        categoryId: categoryRecord.id,
        slug: selectedSubcategory.id
      }
    })

    if (!subcategoryRecord) {
      subcategoryRecord = await prisma.subcategory.findFirst({
        where: {
          categoryId: categoryRecord.id,
          name: selectedSubcategory.name
        }
      })
    }

    if (!subcategoryRecord) {
      subcategoryRecord = await prisma.subcategory.create({
        data: {
          categoryId: categoryRecord.id,
          name: selectedSubcategory.name,
          slug: selectedSubcategory.id,
          description: selectedSubcategory.name,
          sortOrder: 0,
          isActive: true
        }
      })
    }

    const specialist = await prisma.specialist.create({
      data: {
        userId,
        businessName: businessName || null,
        description,
        city,
        serviceAreas: [city],
        phone: phone || null,
        verified: false,
        categories: {
          create: {
            categoryId: categoryRecord.id,
            subcategoryId: subcategoryRecord.id
          }
        }
      },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
            subcategory: true
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: "Профилът е създаден успешно и очаква одобрение",
        specialist
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Грешка при създаване на профил:", error)

    return NextResponse.json(
      {
        error:
          "Възникна грешка при създаване на профила: " +
          (error as Error).message
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any)?.id
    const body = await request.json()
    const { businessName, description, phone, experienceYears } = body

    const specialist = await prisma.specialist.update({
      where: { userId },
      data: {
        businessName: businessName || null,
        description,
        phone: phone || null,
        experienceYears: experienceYears || 0
      }
    })

    return NextResponse.json(specialist)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}