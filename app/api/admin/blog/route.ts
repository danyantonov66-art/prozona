// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return null
  return session
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[а-яёА-ЯЁ]/g, (char) => {
      const map: Record<string, string> = {
        'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
        'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
        'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
        'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } }
  })
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, excerpt, content, coverImage, published, metaTitle, metaDescription } = body

  if (!title || !content) {
    return NextResponse.json({ error: 'Заглавието и съдържанието са задължителни' }, { status: 400 })
  }

  let slug = generateSlug(title)
  // Ensure unique slug
  const existing = await prisma.blogPost.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`

  const post = await prisma.blogPost.create({
    data: {
      title, excerpt: excerpt || null, content, slug,
      coverImage: coverImage || null,
      published: published || false,
      publishedAt: published ? new Date() : null,
      authorId: (session.user as any).id,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || null,
    }
  })
  return NextResponse.json(post, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { id, title, excerpt, content, coverImage, published, metaTitle, metaDescription } = body

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const existing = await prisma.blogPost.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: title || existing.title,
      excerpt: excerpt ?? existing.excerpt,
      content: content || existing.content,
      coverImage: coverImage ?? existing.coverImage,
      published: published ?? existing.published,
      publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
      metaTitle: metaTitle || title || existing.metaTitle,
      metaDescription: metaDescription ?? existing.metaDescription,
    }
  })
  return NextResponse.json(post)
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await prisma.blogPost.delete({ where: { id } })
  return NextResponse.json({ success: true })
}