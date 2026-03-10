import type { MetadataRoute } from "next"

const baseUrl = "https://prozona.bg"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/_next/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}