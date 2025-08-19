import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Normalize legacy route-group URLs like /(main)/dashboard -> /dashboard
  if (pathname.startsWith('/(main)/')) {
    const normalized = pathname.replace('/(main)/', '/')
    return NextResponse.redirect(new URL(normalized, request.url))
  }

  // Allow public routes
  const publicRoutes = ['/login', '/signup', '/forgot-password', '/reset-password']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow static files and API routes (temporarily disable auth for API testing)
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api/') || 
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next()
  }

  // Check for session token (NextAuth JWT cookie or legacy token)
  const sessionToken =
    request.cookies.get('__Secure-next-auth.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('session_token')?.value

  // If no session token and trying to access protected route, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - temporarily disabled auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
