import type { MetadataRoute } from "next"
import { categories, cities } from "@/lib/constants"

const baseUrl = "https://prozona.bg"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/bg`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/bg/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bg/specialists`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bg/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bg/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bg/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/bg/become-specialist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bg/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/bg/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/bg/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/bg/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const subcategoryPages: MetadataRoute.Sitemap = categories.flatMap((category) =>
    category.subcategories.map((subcategory) => ({
      url: `${baseUrl}/bg/categories/${category.slug}/${subcategory.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  )

  const cityServicePages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    categories.flatMap((category) =>
      category.subcategories.map((subcategory) => ({
        url: `${baseUrl}/bg/uslugi/${encodeURIComponent(city)}/${subcategory.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }))
    )
  )

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...cityServicePages,
  ]
}