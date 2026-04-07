'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { DbAttempt } from '@/lib/db';

const MODES = [
  {
    id: 'mock_test',
    label: 'Mock Test',
    icon: '🎯',
    description: '20 questions · 45 min · Real test format',
    colour: 'from-au-green to-au-green-700 text-white',
    badge: 'RECOMMENDED',
  },
  {
    id: 'people',
    label: 'Australia & Its People',
    icon: '🦘',
    description: '10 questions · 15 min · History, geography & symbols',
    colour: 'from-blue-500 to-blue-700 text-white',
    badge: null,
  },
  {
    id: 'democracy',
    label: 'Democratic Beliefs',
    icon: '🗳️',
    description: '10 questions · 15 min · Rights, freedoms & equality',
    colour: 'from-teal-500 to-teal-700 text-white',
    badge: null,
  },
  {
    id: 'government',
    label: 'Government & Law',
    icon: '⚖️',
    description: '10 questions · 15 min · Parliament, courts & elections',
    colour: 'from-purple-500 to-purple-700 text-white',
    badge: null,
  },
  {
    id: 'values',
    label: 'Australian Values',
    icon: '🤝',
    description: '10 questions · 15 min · Must get 100% in real test!',
    colour: 'from-amber-500 to-orange-600 text-white',
    badge: '⚠️ HIGH STAKES',
  },
];

interface Props {
  userName: string;
  stats: {
    totalAttempts: number;
    bestScore: number;
    passCount: number;
    lastAttempt: DbAttempt | null;
  };
  recentAttempts: DbAttempt[];
}

export default function QuizHub({ userName, stats, recentAttempts }: Props) {
  const router = useRouter();
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function startQuiz(mode: string) {
    setStarting(mode);
    setError('');
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      if (!res.ok) throw new Error('Failed to start quiz');
      const data = await res.json();
      // Store quiz session in sessionStorage for the quiz engine
      sessionStorage.setItem('quizSession', JSON.stringify(data));
      router.push('/quiz/active');
    } catch {
      setError('Could not start quiz. Please try again.');
      setStarting(null);
    }
  }

  const firstName = userName.split(' ')[0];
  const passRate =
    stats.totalAttempts > 0
      ? Math.round((stats.passCount / stats.totalAttempts) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-au-green text-lg">
            🇦🇺 Citizenship Quiz
          </div>
          <div className="flex gap-3 items-center">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-au-green transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            G&apos;day, {firstName}! 👋
          </h1>
          {stats.totalAttempts === 0 ? (
            <p className="text-gray-500 mt-1">
              Ready to start practising? Pick a mode below.
            </p>
          ) : (
            <p className="text-gray-500 mt-1">
              {stats.passCount > 0
                ? `You've passed ${stats.passCount} mock test${stats.passCount > 1 ? 's' : ''}. Keep it up!`
                : `Best score so far: ${stats.bestScore}%. You need 75% to pass.`}
            </p>
          )}
        </div>

        {/* Quick stats */}
        {stats.totalAttempts > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Quizzes taken', value: stats.totalAttempts },
              { label: 'Best score', value: `${stats.bestScore}%` },
              { label: 'Pass rate', value: `${passRate}%` },
            ].map((s) => (
              <div key={s.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-au-green">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Mode selection */}
        <h2 className="font-bold text-lg mb-4">Choose a quiz mode</h2>
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => startQuiz(mode.id)}
              disabled={starting !== null}
              className={`
                relative text-left p-5 rounded-2xl bg-gradient-to-br ${mode.colour}
                shadow hover:shadow-md active:scale-[0.98] transition-all duration-150
                disabled:opacity-60
                ${mode.id === 'mock_test' ? 'md:col-span-2' : ''}
              `}
            >
              {mode.badge && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                  {mode.badge}
                </span>
              )}
              <div className="text-3xl mb-2">{mode.icon}</div>
              <div className="font-bold text-lg">{mode.label}</div>
              <div className="text-sm opacity-80 mt-1">{mode.description}</div>
              {starting === mode.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                  <div className="text-white font-bold">Loading…</div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Recent attempts */}
        {recentAttempts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Recent attempts</h2>
              <Link href="/dashboard" className="text-sm text-au-green hover:underline">
                View all →
              </Link>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Mode</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Score</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Result</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 capitalize font-medium">
                        {a.mode.replace('_', ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${a.percentage >= 75 ? 'text-au-green' : 'text-red-500'}`}>
                          {a.percentage}%
                        </span>
                        <span className="text-gray-400 ml-1 text-xs">
                          ({a.score}/{a.total_questions})
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {a.passed ? (
                          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            PASSED
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            NOT YET
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                        {new Date(a.completed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
