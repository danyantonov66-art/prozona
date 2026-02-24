// app/api/specialist/suggest-category/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, categoryName, subcategoryName, parentCategory, description, reason, specialistId } = body

    // Валидация
    if (!type || !description || !reason || !specialistId) {
      return NextResponse.json(
        { error: 'Моля, попълнете всички задължителни полета' },
        { status: 400 }
      )
    }

    if (type === 'category' && !categoryName) {
      return NextResponse.json(
        { error: 'Моля, въведете име на категория' },
        { status: 400 }
      )
    }

    if (type === 'subcategory' && (!subcategoryName || !parentCategory)) {
      return NextResponse.json(
        { error: 'Моля, въведете име на подкатегория и изберете родителска категория' },
        { status: 400 }
      )
    }

    // Тук ще запазим предложението в базата
    // Засега просто връщаме успех
    // В бъдеще ще създадем модел CategorySuggestion

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