import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth')
  const isAuthPage = request.nextUrl.pathname === '/'
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')

  // Allow API routes to handle their own auth
  if (isApiRoute) {
    return NextResponse.next()
  }

  // If user is not authenticated and trying to access protected route
  if (!authCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is authenticated and trying to access auth page
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/live', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}