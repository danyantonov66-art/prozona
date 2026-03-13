import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { categories } from "../../../../lib/constants"
import { sendNewSpecialistNotification, sendSpecialistRegistrationConfirmation } from "../../../../lib/email"

const EARLY_PROGRAM_LIMIT = 200

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = (session.user as any)?.id
    const body = await request.json()
    const { businessName, description, city, phone, categoryId, subcategoryId, experience } = body ?? {}

    if (!description || !city || !categoryId || !subcategoryId || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const selectedCategory = categories.find((c: any) => c.id === categoryId)
    if (!selectedCategory) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const selectedSubcategory = selectedCategory.subcategories?.find((s: any) => s.id === subcategoryId)
    if (!selectedSubcategory) {
      return NextResponse.json({ error: "Invalid subcategory" }, { status: 400 })
    }

    let categoryRecord = await prisma.category.findUnique({ where: { slug: selectedCategory.slug } })
    if (!categoryRecord) categoryRecord = await prisma.category.findUnique({ where: { name: selectedCategory.name } })
    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: { name: selectedCategory.name, slug: selectedCategory.slug, description: selectedCategory.description || selectedCategory.name, icon: selectedCategory.icon || null, updatedAt: new Date() },
      })
    }

    let subcategoryRecord = await prisma.subcategory.findFirst({ where: { categoryId: categoryRecord.id, slug: selectedSubcategory.id } })
    if (!subcategoryRecord) subcategoryRecord = await prisma.subcategory.findFirst({ where: { categoryId: categoryRecord.id, name: selectedSubcategory.name } })
    if (!subcategoryRecord) {
      subcategoryRecord = await prisma.subcategory.create({
        data: { categoryId: categoryRecord.id, name: selectedSubcategory.name, slug: selectedSubcategory.id, description: selectedSubcategory.name, updatedAt: new Date() },
      })
    }

    const existing = await prisma.specialist.findUnique({ where: { userId } })

    let earlyProgramBonus = {}
    if (!existing) {
      const totalSpecialists = await prisma.specialist.count()
      if (totalSpecialists < EARLY_PROGRAM_LIMIT) {
        const premiumExpiry = new Date()
        premiumExpiry.setMonth(premiumExpiry.getMonth() + 6)
        earlyProgramBonus = {
          subscriptionPlan: "PREMIUM",
          subscriptionExpiresAt: premiumExpiry,
          isFeatured: true,
          featuredExpiresAt: premiumExpiry,
          priorityInquiries: true,
        }
      }
    }

    const specialistData = {
      businessName: businessName || null,
      description,
      city,
      phone,
      experienceYears: experience || null,
      verified: false,
      ...earlyProgramBonus,
    }

    const specialist = existing
      ? await prisma.specialist.update({ where: { userId }, data: specialistData, include: { user: true } })
      : await prisma.specialist.create({ data: { userId, ...specialistData, credits: 20 }, include: { user: true } })

    await prisma.specialistCategory.upsert({
      where: { specialistId_categoryId_subcategoryId: { specialistId: specialist.id, categoryId: categoryRecord.id, subcategoryId: subcategoryRecord.id } },
      update: {},
      create: { specialistId: specialist.id, categoryId: categoryRecord.id, subcategoryId: subcategoryRecord.id },
    })

    if (!existing) {
      try {
        await sendNewSpecialistNotification({
          specialistName: specialist.user?.name || 'Непознат',
          specialistEmail: specialist.user?.email || '',
          city,
          category: selectedCategory.name,
          specialistId: specialist.id,
        })
        await sendSpecialistRegistrationConfirmation({
          specialistEmail: specialist.user?.email || '',
          specialistName: specialist.user?.name || 'Специалист',
        })
      } catch (emailError) {
        console.error('Email error:', emailError)
      }
    }

    const isEarlyMember = !existing && Object.keys(earlyProgramBonus).length > 0
    return NextResponse.json({ success: true, specialist, earlyProgram: isEarlyMember })
  } catch (error) {
    console.error("Specialist profile POST error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = (session.user as any)?.id
    const body = await request.json()
    const { businessName, description, city, phone, experienceYears, serviceAreas } = body ?? {}

    if (!description) {
      return NextResponse.json({ error: "Описанието е задължително" }, { status: 400 })
    }

    const specialist = await prisma.specialist.update({
      where: { userId },
      data: {
        businessName: businessName || null,
        description,
        city: city || "",
        phone: phone || null,
        experienceYears: experienceYears || null,
        serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [],
      },
      include: { user: true },
    })

    return NextResponse.json({ success: true, specialist })
  } catch (error) {
    console.error("Specialist profile PUT error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
