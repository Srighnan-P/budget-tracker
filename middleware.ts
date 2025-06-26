import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If user is not logged in and trying to access a protected route
  if (!token && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is logged in and tries to access the login page
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Specify which paths to run the middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};