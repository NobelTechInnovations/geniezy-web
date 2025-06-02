import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname === '/login') {
    const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
    if (isLoggedIn === 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login'],
}; 