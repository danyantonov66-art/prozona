import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/bg/admin',
          '/bg/specialist/dashboard',
          '/bg/specialist/profile',
          '/bg/specialist/inquiries',
          '/bg/dashboard',
        ],
      },
    ],
    sitemap: 'https://www.prozona.bg/sitemap.xml',
  }
}