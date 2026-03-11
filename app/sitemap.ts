import { MetadataRoute } from "next"

function cityToSlug(city: string) {
  return city
    .trim()
    .toLowerCase()
    .replace(/а/g, "a")
    .replace(/б/g, "b")
    .replace(/в/g, "v")
    .replace(/г/g, "g")
    .replace(/д/g, "d")
    .replace(/е/g, "e")
    .replace(/ж/g, "zh")
    .replace(/з/g, "z")
    .replace(/и/g, "i")
    .replace(/й/g, "y")
    .replace(/к/g, "k")
    .replace(/л/g, "l")
    .replace(/м/g, "m")
    .replace(/н/g, "n")
    .replace(/о/g, "o")
    .replace(/п/g, "p")
    .replace(/р/g, "r")
    .replace(/с/g, "s")
    .replace(/т/g, "t")
    .replace(/у/g, "u")
    .replace(/ф/g, "f")
    .replace(/х/g, "h")
    .replace(/ц/g, "ts")
    .replace(/ч/g, "ch")
    .replace(/ш/g, "sh")
    .replace(/щ/g, "sht")
    .replace(/ъ/g, "a")
    .replace(/ь/g, "y")
    .replace(/ю/g, "yu")
    .replace(/я/g, "ya")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://prozona.bg"

  const cities = [
    "София",
    "Пловдив",
    "Варна",
    "Бургас",
    "Русе",
    "Стара Загора",
    "Плевен",
    "Видин",
    "Велико Търново",
    "Благоевград",
    "Перник",
    "Хасково",
    "Ямбол",
    "Пазарджик",
    "Добрич",
    "Шумен",
    "Сливен",
    "Враца",
    "Габрово",
    "Кърджали",
  ]

  const serviceSlugs = [
    "vik",
    "elektro",
    "boyadisvane",
    "shpaklovka-zidariya",
    "remont-banya",
    "gipsokarton",
    "dovarshitelni-remonti",
    "domashno",
    "osnovno",
    "sled-remont",
    "ofis",
    "naem",
    "mebeli",
    "klimatici",
    "osvetlenie",
    "elektrouredi",
    "drebni-remonti",
    "premestvane-hamali",
    "kosene",
    "poddrazhka-dvor",
    "podryazvane",
    "ozelenyavane",
    "pochistvane-dvor",
  ]

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

  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/bg/categories/remonti`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bg/categories/pochistvane`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bg/categories/montaj`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bg/categories/gradina`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const subcategoryPages: MetadataRoute.Sitemap = [
    "vik",
    "elektro",
    "boyadisvane",
    "shpaklovka-zidariya",
    "remont-banya",
    "gipsokarton",
    "dovarshitelni-remonti",
  ].map((slug) => ({
    url: `${baseUrl}/bg/categories/remonti/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))
    .concat(
      ["domashno", "osnovno", "sled-remont", "ofis", "naem"].map((slug) => ({
        url: `${baseUrl}/bg/categories/pochistvane/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )
    .concat(
      [
        "mebeli",
        "klimatici",
        "osvetlenie",
        "elektrouredi",
        "drebni-remonti",
        "premestvane-hamali",
      ].map((slug) => ({
        url: `${baseUrl}/bg/categories/montaj/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )
    .concat(
      [
        "kosene",
        "poddrazhka-dvor",
        "podryazvane",
        "ozelenyavane",
        "pochistvane-dvor",
      ].map((slug) => ({
        url: `${baseUrl}/bg/categories/gradina/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }))
    )

  const cityServicePages: MetadataRoute.Sitemap = cities.flatMap((city) => {
    const citySlug = cityToSlug(city)

    return serviceSlugs.map((serviceSlug) => ({
      url: `${baseUrl}/bg/uslugi/${citySlug}/${serviceSlug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  })

  return [
    ...staticPages,
    ...categoryPages,
    ...subcategoryPages,
    ...cityServicePages,
  ]
}
