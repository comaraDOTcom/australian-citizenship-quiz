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

// Protect quiz, dashboard, and API routes (except auth endpoints)
export const config = {
  matcher: [
    '/quiz/:path*',
    '/dashboard/:path*',
    '/api/quiz/:path*',
    '/api/attempts/:path*',
    '/api/leaderboard/:path*',
    '/api/embed/:path*',
  ],
};
