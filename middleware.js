import { NextResponse } from 'next/server';

export function middleware(request) {
  const currentUser = request.cookies.get('token')?.value;
  const checkoutPath = '/checkout';
  const loginPath = '/login';

  if (request.nextUrl.pathname === checkoutPath && !currentUser) {
    const loginUrl = new URL(loginPath, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === loginPath && currentUser) {
     return NextResponse.redirect(new URL('/checkout', request.url)); 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout', '/login'], 
}; 