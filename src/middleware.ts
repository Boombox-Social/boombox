import { NextResponse, NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/settings', 
];

// Define auth routes (redirect to dashboard if already authenticated)
const authRoutes = [
  '/signin',
  '/auth/register', 
  '/auth/forgot-password',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets/')
  ) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Get authentication token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  // Check if user is authenticated
  const isAuthenticated = !!token;
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/signin', request.url);
    // Add redirect parameter to return user to intended page after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If user is authenticated and trying to access auth routes
  if (isAuthenticated && isAuthRoute) {
    // Check if there's a redirect parameter
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};