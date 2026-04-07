import { NextResponse } from 'next/server';
import { getLeaderboard, initDb } from '@/lib/db';

export async function GET() {
  initDb();
  const leaderboard = getLeaderboard();
  return NextResponse.json({ leaderboard });
}
