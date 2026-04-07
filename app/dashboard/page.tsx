import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserAttempts, getLeaderboard, initDb } from '@/lib/db';
import Link from 'next/link';
import OmniEmbed from '@/components/OmniEmbed';
import AttemptHistory from '@/components/AttemptHistory';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  initDb();
  const [attempts, leaderboard] = await Promise.all([
    getUserAttempts(session.user.id),
    getLeaderboard(),
  ]);

  const stats = {
    totalAttempts: attempts.length,
    bestScore: attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0,
    avgScore: attempts.length
      ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length)
      : 0,
    passCount: attempts.filter((a) => a.passed).length,
  };

  const myRank =
    leaderboard.findIndex((u) => u.user_name === session.user.name) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/quiz" className="flex items-center gap-2 font-bold text-au-green text-lg">
            🇦🇺 Citizenship Quiz
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600 hidden sm:block">{session.user.name}</span>
            <Link href="/quiz" className="btn-primary text-sm px-4 py-2">
              Take Quiz
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-gray-500 mb-8">Track your progress toward citizenship.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Quizzes', value: stats.totalAttempts, icon: '📝', colour: 'text-blue-600' },
            { label: 'Best Score', value: `${stats.bestScore}%`, icon: '⭐', colour: 'text-au-gold-600' },
            { label: 'Average Score', value: `${stats.avgScore}%`, icon: '📊', colour: 'text-purple-600' },
            { label: 'Tests Passed', value: stats.passCount, icon: '✅', colour: 'text-au-green' },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-2xl font-bold ${s.colour}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Omni embedded analytics */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-lg">Analytics</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Powered by{' '}
                    <span className="font-semibold text-au-green">Omni</span> ·{' '}
                    data in{' '}
                    <span className="font-semibold">MotherDuck</span>
                  </p>
                </div>
              </div>
              <OmniEmbed />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <div className="card p-5">
              <h2 className="font-bold text-lg mb-4">🏆 Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <p className="text-gray-400 text-sm">No scores yet — be the first!</p>
              ) : (
                <ol className="space-y-2">
                  {leaderboard.map((u, i) => (
                    <li
                      key={u.user_name}
                      className={`flex items-center justify-between text-sm p-2 rounded-lg ${
                        u.user_name === session.user.name
                          ? 'bg-au-green-50 font-semibold'
                          : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-6 text-center font-bold ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                        </span>
                        {u.user_name}
                      </span>
                      <span className="text-au-green font-bold">{u.best_percentage}%</span>
                    </li>
                  ))}
                </ol>
              )}
              {myRank > 0 && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  You&apos;re ranked #{myRank}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Attempt history */}
        <div className="mt-6">
          <AttemptHistory attempts={attempts} />
        </div>
      </div>
    </div>
  );
}
