import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { categories } from "../../../../lib/constants"
import { sendNewSpecialistNotification, sendSpecialistRegistrationConfirmation } from "../../../../lib/email"

const EARLY_PROGRAM_LIMIT = 200

function isValidVideoUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|tiktok\.com)/.test(url)
}

async function getOrCreateCategory(categoryId: string) {
  const selectedCategory = categories.find((c: any) => String(c.id) === String(categoryId))
  if (!selectedCategory) return null

  let categoryRecord = await prisma.category.findUnique({ where: { slug: selectedCategory.slug } })
  if (!categoryRecord) categoryRecord = await prisma.category.findUnique({ where: { name: selectedCategory.name } })
  if (!categoryRecord) {
    categoryRecord = await prisma.category.create({
      data: {
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description || selectedCategory.name,
        icon: selectedCategory.icon || null,
        updatedAt: new Date()
      },
    })
  }
  return { categoryRecord, selectedCategory }
}

async function getOrCreateSubcategory(selectedCategory: any, subcategoryId: string, categoryRecordId: number) {
  if (!subcategoryId) return null
  const selectedSubcategory = selectedCategory.subcategories?.find((s: any) => String(s.id) === String(subcategoryId))
  if (!selectedSubcategory) return null

  let subcategoryRecord = await prisma.subcategory.findFirst({ where: { categoryId: categoryRecordId, slug: selectedSubcategory.id } })
  if (!subcategoryRecord) subcategoryRecord = await prisma.subcategory.findFirst({ where: { categoryId: categoryRecordId, name: selectedSubcategory.name } })
  if (!subcategoryRecord) {
    subcategoryRecord = await prisma.subcategory.create({
      data: {
        categoryId: categoryRecordId,
        name: selectedSubcategory.name,
        slug: selectedSubcategory.id,
        description: selectedSubcategory.name,
        updatedAt: new Date()
      },
    })
  }
  return subcategoryRecord
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = (session.user as any)?.id
    const body = await request.json()
    const { businessName, description, city, phone, experience } = body ?? {}

    // Поддържа и стар формат (categoryId/subcategoryId) и нов (categories масив)
    const categoriesInput: { categoryId: string; subcategoryId?: string }[] =
      body.categories && Array.isArray(body.categories)
        ? body.categories
        : body.categoryId
        ? [{ categoryId: String(body.categoryId), subcategoryId: body.subcategoryId ? String(body.subcategoryId) : "" }]
        : []

    if (!description || !city || !phone || categoriesInput.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await prisma.specialist.findUnique({ where: { userId } })

    let earlyProgramBonus = {}
    if (!existing) {
      const totalSpecialists = await prisma.specialist.count()
      const isEarly = totalSpecialists < EARLY_PROGRAM_LIMIT
      const months = isEarly ? 6 : 3
      const premiumExpiry = new Date()
      premiumExpiry.setMonth(premiumExpiry.getMonth() + months)
      earlyProgramBonus = {
        subscriptionPlan: "PREMIUM",
        subscriptionExpiresAt: premiumExpiry,
        isFeatured: isEarly,
        featuredExpiresAt: isEarly ? premiumExpiry : null,
        priorityInquiries: isEarly,
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

    // Добавяне на всички категории
    for (const cat of categoriesInput) {
      if (!cat.categoryId) continue
      const result = await getOrCreateCategory(cat.categoryId)
      if (!result) continue
      const { categoryRecord, selectedCategory } = result

      const subcategoryRecord = cat.subcategoryId
        ? await getOrCreateSubcategory(selectedCategory, cat.subcategoryId, categoryRecord.id)
        : null

      await prisma.specialistCategory.upsert({
        where: {
          specialistId_categoryId_subcategoryId: {
            specialistId: specialist.id,
            categoryId: categoryRecord.id,
            subcategoryId: subcategoryRecord?.id ?? 0,
          }
        },
        update: {},
        create: {
          specialistId: specialist.id,
          categoryId: categoryRecord.id,
          subcategoryId: subcategoryRecord?.id ?? null,
        },
      })
    }

    if (!existing) {
      try {
        const firstCat = categoriesInput[0]
        const firstCatObj = categories.find((c: any) => String(c.id) === String(firstCat?.categoryId))
        await sendNewSpecialistNotification({
          specialistName: specialist.user?.name || 'Непознат',
          specialistEmail: specialist.user?.email || '',
          city,
          category: firstCatObj?.name || 'Неизвестна',
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
    const { businessName, description, city, phone, experienceYears, serviceAreas, videoUrl } = body ?? {}

    if (videoUrl && !isValidVideoUrl(videoUrl)) {
      return NextResponse.json(
        { error: "Моля въведете валиден YouTube или TikTok линк." },
        { status: 400 }
      )
    }

    const specialist = await prisma.specialist.update({
      where: { userId },
      data: {
        businessName: businessName || null,
        description: description || null,
        city: city || "",
        phone: phone || null,
        experienceYears: experienceYears || null,
        serviceAreas: Array.isArray(serviceAreas) ? serviceAreas : [],
        videoUrl: videoUrl || null,
      },
      include: { user: true },
    })

    return NextResponse.json({ success: true, specialist })
  } catch (error) {
    console.error("Specialist profile PUT error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}