import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname

  // Позволи достъп само до maintenance страницата и статичните файлове
  if (
    url === '/maintenance' ||
    url.startsWith('/_next') ||
    url.startsWith('/favicon') ||
    url.startsWith('/api')
  ) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}