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

// Edge-compatible JWT verification
async function verifyJWTToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined');
      return false;
    }

    // Split the JWT token
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode payload to check expiration
    const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const secretKey = encoder.encode(secret);

    // Import the secret key
    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode the signature
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map(c => c.charCodeAt(0))
    );

    // Verify the signature
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      data
    );

    return isValid;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
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
  
  // Verify token is valid and not expired
  let isAuthenticated = false;
  if (token) {
    isAuthenticated = await verifyJWTToken(token);
  }
  
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
    
    // Clear invalid cookie
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth-token');
    return response;
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