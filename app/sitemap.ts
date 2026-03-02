import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const specialists = await prisma.specialist.findMany({
    select: { id: true, updatedAt: true }
  })

  const specialistUrls = specialists.map((s) => ({
    url: `https://www.prozona.bg/bg/specialist/${s.id}`,
    lastModified: s.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true }
  })

  const categoryUrls = categories.map((c) => ({
    url: `https://www.prozona.bg/bg/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: 'https://www.prozona.bg',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.prozona.bg/bg',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.prozona.bg/bg/specialists',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.prozona.bg/bg/categories',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.prozona.bg/bg/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://www.prozona.bg/bg/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://www.prozona.bg/bg/how-it-works',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.prozona.bg/bg/for-specialists',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...specialistUrls,
    ...categoryUrls,
  ]
}