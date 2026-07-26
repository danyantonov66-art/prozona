const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname),
    }
    return config
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.prozona.bg" }],
        destination: "https://prozona.bg/:path*",
        permanent: true,
      },
      {
        source: "/:locale/dashboard/profile-edit",
        destination: "/:locale/specialist/profile",
        statusCode: 301,
      },
      {
        source: "/:locale/specialist/profile/edit",
        destination: "/:locale/specialist/profile",
        statusCode: 301,
      },
    ]
  },
}

module.exports = nextConfig