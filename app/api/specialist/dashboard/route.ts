import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const specialist = await prisma.specialist.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        credits: true,
        viewsCount: true,
        inquiryCount: true,
        completedJobs: true,
        reviewCount: true,
        rating: true,
      }
    })

    if (!specialist) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const inquiries = await prisma.inquiry.findMany({
      where: { specialistId: specialist.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        city: true,
        message: true,
        createdAt: true,
        categoryId: true,
        InquiryResponse: {
          where: { specialistId: specialist.id },
          select: { id: true }
        }
      }
    })

    const formattedInquiries = inquiries.map((inq) => ({
      id: inq.id,
      name: inq.name,
      city: inq.city,
      message: inq.message,
      createdAt: inq.createdAt,
      categoryId: inq.categoryId,
      unlocked: inq.InquiryResponse.length > 0,
    }))

    return NextResponse.json({
      credits: specialist.credits,
      inquiries: formattedInquiries,
      stats: {
        viewsCount: specialist.viewsCount,
        inquiryCount: specialist.inquiryCount,
        completedJobs: specialist.completedJobs,
        reviewCount: specialist.reviewCount,
        rating: specialist.rating,
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}