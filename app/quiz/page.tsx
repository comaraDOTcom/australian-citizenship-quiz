'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/lib/user-context';
import QuizHub from '@/components/QuizHub';
import type { DbAttempt } from '@/lib/db';

export default function QuizPage() {
  const user = useUser();
  const [attempts, setAttempts] = useState<DbAttempt[]>([]);
  const [incorrectQuestionCount, setIncorrectQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const params = user.type === 'anon' ? `?anonId=${user.id}` : '';
    fetch(`/api/attempts${params}`)
      .then((r) => r.json())
      .then((d) => {
        setAttempts(d.attempts ?? []);
        setIncorrectQuestionCount(d.incorrectQuestionCount ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const stats = {
    totalAttempts: attempts.length,
    bestScore: attempts.length ? Math.max(...attempts.map((a) => a.percentage)) : 0,
    passCount: attempts.filter((a) => a.passed).length,
    lastAttempt: attempts[0] ?? null,
  };

  return (
    <QuizHub
      user={user}
      stats={stats}
      recentAttempts={attempts.slice(0, 5)}
      incorrectQuestionCount={incorrectQuestionCount}
    />
  );
}
