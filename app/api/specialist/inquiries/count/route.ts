// app/api/specialist/inquiries/count/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Неоторизиран' }, { status: 401 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id }
    })

    if (!specialist) {
      return NextResponse.json({ count: 0 })
    }

    const count = await prisma.inquiry.count({
      where: { 
        specialistId: specialist.id,
        viewedBy: 0
      }
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting inquiries:', error)
    return NextResponse.json({ count: 0 })
  }
}