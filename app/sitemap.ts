import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://prozona.bg"

  const cities = [
    "sofia", "plovdiv", "varna", "burgas", "ruse",
    "stara-zagora", "pleven", "veliko-tarnovo", "blagoevgrad",
    "pazardzhik", "haskovo", "shumen", "pernik", "dobrich",
    "sliven", "vratsa", "gabrovo", "yambol",
  ]

  const serviceSlugs = [
    "elektrotehnik", "vik", "pochistvane", "pokrivi",
    "hamali", "klimatik", "shpaklovka", "gradina",
    "gipsokarton", "drebni-remonti", "remont-pokrivi", "klimatici",
  ]

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/bg`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/bg/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/bg/specialists`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/bg/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/bg/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/bg/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/bg/become-specialist`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bg/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/bg/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/bg/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
  ]

  const categoryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/bg/categories/remonti`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bg/categories/pochistvane`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bg/categories/montaj`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bg/categories/gradina`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ]

  const subcategoryPages: MetadataRoute.Sitemap = [
    "vik", "elektro", "boyadisvane", "shpaklovka-zidariya",
    "remont-banya", "gipsokarton", "dovarshitelni-remonti",
  ].map((slug) => ({
    url: `${baseUrl}/bg/categories/remonti/${slug}`,
    lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8,
  })).concat(
    ["domashno", "osnovno", "sled-remont", "ofis", "naem"].map((slug) => ({
      url: `${baseUrl}/bg/categories/pochistvane/${slug}`,
      lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8,
    }))
  ).concat(
    ["mebeli", "klimatici", "osvetlenie", "elektrouredi", "drebni-remonti", "premestvane-hamali"].map((slug) => ({
      url: `${baseUrl}/bg/categories/montaj/${slug}`,
      lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8,
    }))
  ).concat(
    ["kosene", "poddrazhka-dvor", "podryazvane", "ozelenyavane", "pochistvane-dvor"].map((slug) => ({
      url: `${baseUrl}/bg/categories/gradina/${slug}`,
      lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8,
    }))
  )

  const cityServicePages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    serviceSlugs.map((serviceSlug) => ({
      url: `${baseUrl}/bg/uslugi/${city}/${serviceSlug}`,
      lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7,
    }))
  )

  // Динамични специалисти от базата данни
  let specialistPages: MetadataRoute.Sitemap = []
  try {
    const specialists = await prisma.specialist.findMany({
      where: { verified: true },
      select: { id: true, updatedAt: true },
    })
    specialistPages = specialists.map((s) => ({
      url: `${baseUrl}/bg/specialists/${s.id}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error("Sitemap: specialists error", e)
  }

  // Динамични блог постове
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })
    blogPages = posts.map((p) => ({
      url: `${baseUrl}/bg/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.error("Sitemap: blog error", e)
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...cityServicePages,
    ...specialistPages,
    ...blogPages,
  ]
}