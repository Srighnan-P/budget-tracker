import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Simple middleware that just allows all requests
  // Auth redirects will be handled in the components
  return NextResponse.next();
}

// Specify which paths to run the middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}; 