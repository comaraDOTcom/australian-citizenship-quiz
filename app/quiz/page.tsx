import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserAttempts, initDb } from '@/lib/db';
import QuizHub from '@/components/QuizHub';

export default async function QuizPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  initDb();
  const attempts = await getUserAttempts(session.user.id);

  const stats = {
    totalAttempts: attempts.length,
    bestScore: attempts.length
      ? Math.max(...attempts.map((a) => a.percentage))
      : 0,
    passCount: attempts.filter((a) => a.passed).length,
    lastAttempt: attempts[0] ?? null,
  };

  return (
    <QuizHub
      userName={session.user.name}
      stats={stats}
      recentAttempts={attempts.slice(0, 5)}
    />
  );
}
