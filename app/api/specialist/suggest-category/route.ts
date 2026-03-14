import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { categoryName, subcategoryName, parentCategory, description, city, phone, email } = body

    if (!categoryName || !description) {
      return NextResponse.json(
        { error: 'Моля, попълнете всички задължителни полета' },
        { status: 400 }
      )
    }

    await prisma.categorySuggestion.create({
      data: {
        categoryName: categoryName ?? null,
        subcategoryName: subcategoryName ?? null,
        parentCategory: parentCategory ?? null,
        description,
        city: city ?? null,
        phone: phone ?? null,
        email: email ?? null,
        specialistId: null,
        reason: null,
        type: null,
      }
    })

    return NextResponse.json(
      { message: 'Предложението е изпратено успешно' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting suggestion:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при изпращане на предложението' },
      { status: 500 }
    )
  }
}