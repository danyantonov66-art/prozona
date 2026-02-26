import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [users, specialists, clients, inquiries, pendingVerifications, pendingSuggestions] = await Promise.all([
    prisma.user.count(),
    prisma.specialist.count(),
    prisma.clientProfile.count(),
    prisma.inquiry.count(),
    prisma.specialist.count({ where: { verified: false } }),
    prisma.categorySuggestion.count({ where: { status: 'PENDING' } }),
  ])
  return NextResponse.json({ users, specialists, clients, inquiries, pendingVerifications, pendingSuggestions })
}
