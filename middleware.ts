import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Ако URL-ът не започва с locale, добави /bg/
  const hasLocale = /^\/(bg|en)(\/|$)/.test(pathname)
  
  if (!hasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL(`/bg${pathname}`, request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
