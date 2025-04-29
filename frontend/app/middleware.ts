import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/appointments',
  '/medical-records',
  '/prescriptions',
  '/profile'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute) {
    // Check for auth token in cookies
    const token = request.cookies.get('healcard_token')?.value;
    
    if (!token) {
      // Redirect to login if no token found
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // In a real app, you would verify the token's validity here
    // For this demo, we're just checking for its presence
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, manifest.json, robots.txt (static files)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|public).*)',
  ],
}; 