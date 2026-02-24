// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Липсващи задължителни полета' },
        { status: 400 }
      )
    }

    // Проверка дали потребителят вече съществува
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Потребител с този имейл вече съществува' },
        { status: 400 }
      )
    }

    // Криптиране на паролата
    const hashedPassword = await bcrypt.hash(password, 10)

    // Създаване на потребител
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'CLIENT',
      }
    })

    // Ако е клиент, създаваме клиентски профил
    if (role === 'CLIENT' || !role) {
      await prisma.clientProfile.create({
        data: {
          userId: user.id,
        }
      })
    }

    return NextResponse.json(
      { message: 'Успешна регистрация', user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Възникна грешка при регистрацията' },
      { status: 500 }
    )
  }
}