import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function toSlug(text: string): string {
  const cyrillicMap: Record<string, string> = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
    'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
  }
  return text
    .toLowerCase()
    .split('')
    .map(c => cyrillicMap[c] || c)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { type, name, description, categoryId } = body

  if (!name || !type) {
    return NextResponse.json({ error: 'Липсва name или type' }, { status: 400 })
  }

  const slug = toSlug(name)

  if (type === 'category') {
    const existing = await prisma.category.findFirst({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Категорията вече съществува' }, { status: 409 })
    }
    const category = await prisma.category.create({
      data: { name, slug, description: description ?? '', updatedAt: new Date() },
    })
    return NextResponse.json(category)
  }

  if (type === 'subcategory') {
    if (!categoryId) {
      return NextResponse.json({ error: 'Липсва categoryId' }, { status: 400 })
    }
    const existing = await prisma.subcategory.findFirst({ where: { slug, categoryId } })
    if (existing) {
      return NextResponse.json({ error: 'Подкатегорията вече съществува' }, { status: 409 })
    }
    const subcategory = await prisma.subcategory.create({
      data: { name, slug, description: description ?? '', categoryId, updatedAt: new Date() },
    })
    return NextResponse.json(subcategory)
  }

  return NextResponse.json({ error: 'Невалиден type' }, { status: 400 })
}