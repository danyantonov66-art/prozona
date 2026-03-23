// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug, published: true },
        include: { author: { select: { name: true, image: true } } }
      })
      if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(post)
    }

    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, slug: true, title: true, excerpt: true,
        coverImage: true, publishedAt: true, createdAt: true,
        author: { select: { name: true } }
      }
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}