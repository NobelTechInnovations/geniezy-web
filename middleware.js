import { NextResponse } from 'next/server';

export function middleware(request) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Protect checkout and account pages
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
