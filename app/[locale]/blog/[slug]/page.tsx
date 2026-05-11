import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) notFound()

  return (
    <main style={{ padding: '40px', color: 'white', background: '#0D0D1A', minHeight: '100vh' }}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  )
}