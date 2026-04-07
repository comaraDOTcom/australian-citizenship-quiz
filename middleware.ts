import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// Protect dashboard and embed API (requires real account for Omni)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/embed/:path*',
  ],
};
