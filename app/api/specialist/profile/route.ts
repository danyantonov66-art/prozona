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

function generateSlug(name: string, city: string, id: string): string {
  const translitMap: Record<string, string> = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
    'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
    'А':'a','Б':'b','В':'v','Г':'g','Д':'d','Е':'e','Ж':'zh','З':'z',
    'И':'i','Й':'y','К':'k','Л':'l','М':'m','Н':'n','О':'o','П':'p',
    'Р':'r','С':'s','Т':'t','У':'u','Ф':'f','Х':'h','Ц':'ts','Ч':'ch',
    'Ш':'sh','Щ':'sht','Ъ':'a','Ь':'','Ю':'yu','Я':'ya'
  }
  const transliterate = (str: string) =>
    str.split('').map(c => translitMap[c] || c).join('')

  const base = transliterate(`${name}-${city}`)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return `${base}-${id.slice(-6)}`
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = (session.user as any)?.id
    const body = await request.json()
    const { businessName, description, city: rawCity, phone, categoryId, subcategoryId, experience } = body ?? {}
    const city = rawCity?.trim() || ""

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

    // Генерирай slug за нов специалист
    if (!existing && !specialist.slug) {
      const name = specialist.businessName || specialist.user?.name || 'specialist'
      const slug = generateSlug(name, city, specialist.id)
      await prisma.specialist.update({
        where: { id: specialist.id },
        data: { slug }
      })
    }

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
    const { businessName, description, city, phone, experienceYears, serviceAreas, videoUrl, categories } = body ?? {}

    if (videoUrl !== undefined && videoUrl && !isValidVideoUrl(videoUrl)) {
      return NextResponse.json(
        { error: "Моля въведете валиден YouTube или TikTok линк." },
        { status: 400 }
      )
    }

    const specialist = await prisma.specialist.findUnique({ where: { userId } })
    if (!specialist) {
      return NextResponse.json({ error: "Профилът не е намерен." }, { status: 404 })
    }

    // Partial update — only touch fields that were actually sent, so one
    // form can't wipe out fields (serviceAreas, videoUrl, ...) that another
    // form on the site doesn't know about.
    const data: Record<string, any> = {}
    if (businessName !== undefined) data.businessName = businessName || null
    if (description !== undefined) {
      if (!description || !description.trim()) {
        return NextResponse.json({ error: "Описанието не може да е празно." }, { status: 400 })
      }
      data.description = description
    }
    if (city !== undefined) {
      const trimmedCity = city?.trim() || ""
      if (!trimmedCity) {
        return NextResponse.json({ error: "Градът не може да е празен." }, { status: 400 })
      }
      data.city = trimmedCity
    }
    if (phone !== undefined) {
      if (!phone || !String(phone).trim()) {
        return NextResponse.json({ error: "Телефонът не може да е празен." }, { status: 400 })
      }
      data.phone = phone
    }
    if (experienceYears !== undefined) data.experienceYears = experienceYears || null
    if (serviceAreas !== undefined) data.serviceAreas = Array.isArray(serviceAreas) ? serviceAreas : []
    if (videoUrl !== undefined) data.videoUrl = videoUrl || null

    // Validate + normalize category assignments against the DB (categories
    // are never taken from the hardcoded lib/constants list here).
    let validatedCategories: { categoryId: number; subcategoryId: number | null }[] | null = null
    if (categories !== undefined) {
      if (!Array.isArray(categories) || categories.length === 0) {
        return NextResponse.json({ error: "Избери поне една категория." }, { status: 400 })
      }
      const categoryIds = [...new Set(categories.map((c: any) => Number(c.categoryId)))]
      const dbCategories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        include: { Subcategory: true },
      })
      const categoryMap = new Map(dbCategories.map((c) => [c.id, c]))

      validatedCategories = []
      for (const c of categories) {
        const categoryId = Number(c.categoryId)
        const category = categoryMap.get(categoryId)
        if (!category) {
          return NextResponse.json({ error: "Невалидна категория." }, { status: 400 })
        }
        let subcategoryId: number | null = null
        if (c.subcategoryId) {
          subcategoryId = Number(c.subcategoryId)
          if (!category.Subcategory.some((s) => s.id === subcategoryId)) {
            return NextResponse.json({ error: "Невалидна подкатегория." }, { status: 400 })
          }
        }
        validatedCategories.push({ categoryId, subcategoryId })
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.specialist.update({
        where: { userId },
        data,
        include: { user: true },
      })

      if (validatedCategories) {
        await tx.specialistCategory.deleteMany({ where: { specialistId: specialist.id } })
        for (const c of validatedCategories) {
          await tx.specialistCategory.create({
            data: { specialistId: specialist.id, categoryId: c.categoryId, subcategoryId: c.subcategoryId },
          })
        }
      }

      return result
    })

    return NextResponse.json({ success: true, specialist: updated })
  } catch (error) {
    console.error("Specialist profile PUT error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}