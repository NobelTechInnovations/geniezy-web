import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Protect checkout and account pages.
  // /order-success is deliberately NOT gated here: it already does its own
  // client-side auth check against localStorage's geniezy_token (the same
  // source of truth every other page/API call in this app uses). Gating it
  // here too against a *separate* isLoggedIn cookie created a fragile
  // dual-auth-source setup — any desync between the cookie and localStorage
  // (different expiry, a request that only sets one, etc.) would silently
  // bounce a customer straight back to /login right after placing an order,
  // even though the app's own token said they were still logged in.
  const protectedPaths = ['/checkout', '/account'];
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // If not logged in and trying to access protected routes, redirect to login
  if (!isLoggedIn && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access login page, redirect to home
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/checkout', '/account/:path*'],
};
