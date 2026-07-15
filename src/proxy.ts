import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session cookie — BetterAuth stores session as a cookie
  const sessionCookie =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  // Try to read role from the session data cookie cache
  let userRole: string | null = null;
  let isLoggedIn = false;

  if (sessionCookie) {
    // Read role from cookie cache if available
    const sessionDataCookie =
      request.cookies.get('better-auth.session_data')?.value ||
      request.cookies.get('__Secure-better-auth.session_data')?.value;

    if (sessionDataCookie) {
      try {
        // BetterAuth cookie cache stores data as base64url encoded JSON
        const decoded = atob(
          sessionDataCookie.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')
        );
        const sessionData = JSON.parse(decoded);
        if (sessionData?.user) {
          userRole = sessionData.user.role || 'user';
          isLoggedIn = true;
        }
      } catch {
        // ignore
      }
    }

    if (!isLoggedIn) {
      // Fallback: fetch session from the auth API
      try {
        const baseUrl =
          process.env.BETTER_AUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/auth/get-session`, {
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            userRole = data.user.role || 'user';
            isLoggedIn = true;
          }
        }
      } catch {
        // If we can't verify, treat as not logged in for protected routes
      }
    }
  }

  // ─── /admin/* → only admin ───
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ─── /cart, /wishlist, /checkout → only logged-in user ───
  if (['/cart', '/wishlist', '/checkout'].some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // ─── /profile, /orders → must be logged in ───
  if (pathname.startsWith('/profile') || pathname.startsWith('/orders')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ─── /login, /register → redirect if already logged in ───
  if (pathname === '/login' || pathname === '/register') {
    if (isLoggedIn) {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/cart/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/login',
    '/register',
  ],
};
