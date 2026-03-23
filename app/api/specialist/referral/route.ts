// app/api/specialist/referral/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id },
      select: {
        refCode: true,
        referralCount: true,
        referralCreditsEarned: true,
      }
    })

    if (!specialist) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const refLink = specialist.refCode
      ? `https://www.prozona.bg/bg/register/specialist?ref=${specialist.refCode}`
      : null

    return NextResponse.json({
      refCode: specialist.refCode,
      refLink,
      referralCount: specialist.referralCount,
      referralCreditsEarned: specialist.referralCreditsEarned,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}