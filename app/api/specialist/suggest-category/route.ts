import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { serviceName, categoryName, description } = body

    if (!serviceName || !description) {
      return NextResponse.json(
        { error: 'Моля, попълнете всички задължителни полета' },
        { status: 400 }
      )
    }

    await prisma.categorySuggestion.create({
      data: {
        name: serviceName,
        description,
        parentName: categoryName ?? null,
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