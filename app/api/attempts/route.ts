import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserAttempts, initDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const anonId = req.nextUrl.searchParams.get('anonId');
  const userId = session?.user?.id ?? anonId;

  if (!userId) {
    return NextResponse.json({ error: 'No user identity' }, { status: 400 });
  }

  initDb();
  const attempts = getUserAttempts(userId);
  return NextResponse.json({ attempts });
}
