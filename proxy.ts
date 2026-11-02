import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const segments = pathname.split("/").filter(Boolean)
  const first = segments[0]

  if (first === ".well-known") return NextResponse.next()

  // Фалшив първи сегмент с точка (напр. /og-image.jpg/uslugi/...) -> 404 преди рендиране
  if (first && segments.length > 1 && first.includes(".")) {
    return new NextResponse("Not Found", { status: 404 })
  }

  // Admin защита
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || (token as any).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Locale redirect
  const hasLocale = /^\/(bg|en)(\/|$)/.test(pathname)
  if (!hasLocale && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    return NextResponse.redirect(new URL(`/bg${pathname}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\.(?:ico|png|jpe?g|svg|webp|gif|avif|css|js|map|txt|xml|json|woff2?|ttf|webmanifest)$).*)",
  ],
}
