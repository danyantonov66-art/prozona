import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://prozona.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/bg",
    "/bg/categories",
    "/bg/specialists",
    "/bg/for-professionals",
    "/bg/add-service",
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" || path === "/bg" ? 1 : 0.7,
  }));
}