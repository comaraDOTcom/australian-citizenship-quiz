'use client';

import { useState } from 'react';
import type { DbAttempt } from '@/lib/db';
import { CATEGORY_LABELS, type Category } from '@/lib/questions';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function AttemptHistory({ attempts }: { attempts: DbAttempt[] }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const pages = Math.ceil(attempts.length / pageSize);
  const visible = attempts.slice(page * pageSize, (page + 1) * pageSize);

  if (attempts.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-400">
        <div className="text-3xl mb-2">📝</div>
        <p>No quiz attempts yet. Take a quiz to see your history here!</p>
      </div>
    );
  }

  function modeLabel(mode: string) {
    if (mode === 'mock_test') return 'Mock Test';
    return CATEGORY_LABELS[mode as Category] ?? mode;
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-lg">Attempt History</h2>
        <p className="text-xs text-gray-400 mt-0.5">{attempts.length} total attempts</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-left">
              <th className="px-4 py-3 text-gray-500 font-medium">Mode</th>
              <th className="px-4 py-3 text-gray-500 font-medium">Score</th>
              <th className="px-4 py-3 text-gray-500 font-medium">Result</th>
              <th className="px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Time</th>
              <th className="px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {modeLabel(a.mode)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className={`h-2 rounded-full ${a.percentage >= 75 ? 'bg-au-green' : 'bg-red-400'}`}
                        style={{ width: `${a.percentage}%` }}
                      />
                    </div>
                    <span className={`font-bold ${a.percentage >= 75 ? 'text-au-green' : 'text-red-500'}`}>
                      {a.percentage}%
                    </span>
                    <span className="text-gray-400 text-xs">({a.score}/{a.total_questions})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3 hidden sm:table-cell text-gray-400 text-xs">
                  {formatDuration(a.time_taken_seconds)}
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-gray-400 text-xs">
                  {new Date(a.completed_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Page {page + 1} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              disabled={page === pages - 1}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
