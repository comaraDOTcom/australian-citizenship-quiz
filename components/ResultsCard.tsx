'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QuestionCard from './QuestionCard';
import { CATEGORY_LABELS, type Category } from '@/lib/questions';
import { useUser } from '@/lib/user-context';

interface AnswerResult {
  questionId: string;
  question: string;
  category: Category;
  options: string[];
  correctIndex: number;
  userAnswerIndex: number;
  isCorrect: boolean;
  explanation: string;
}

interface SubmitResult {
  attemptId: string;
  mode: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  valuesCorrect: number;
  valuesTotal: number;
  byCategory: Record<Category, { correct: number; total: number }>;
  timeTakenSeconds: number;
  answers: AnswerResult[];
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

export default function ResultsCard({ result }: { result: SubmitResult }) {
  const confettiFired = useRef(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const user = useUser();
  const isAnon = user?.type === 'anon';

  useEffect(() => {
    if (result.passed && !confettiFired.current) {
      confettiFired.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.4 },
          colors: ['#00843D', '#FFCD00', '#ffffff', '#00008B'],
        });
      });
    }
  }, [result.passed]);

  const categories = Object.entries(result.byCategory) as [
    Category,
    { correct: number; total: number },
  ][];

  const incorrectAnswers = result.answers.filter((a) => !a.isCorrect);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/quiz" className="text-au-green font-bold flex items-center gap-1">
            ← Back to quiz hub
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Result hero */}
        <div
          className={`card p-8 text-center mb-6 animate-bounce-in ${
            result.passed ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'
          }`}
        >
          <div className="text-6xl mb-3">
            {result.passed ? '🎉' : '😤'}
          </div>
          <h1 className="text-3xl font-extrabold mb-1">
            {result.passed ? 'You passed!' : 'Not quite yet'}
          </h1>
          <p className="text-gray-500 mb-6">
            {result.passed
              ? "Excellent work — you're ready for the real thing!"
              : 'Review the questions you missed and try again.'}
          </p>

          {/* Big score */}
          <div
            className={`text-7xl font-black mb-2 ${
              result.passed ? 'text-au-green' : 'text-red-500'
            }`}
          >
            {result.percentage}%
          </div>
          <div className="text-gray-500">
            {result.score} / {result.total} correct
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Completed in {formatTime(result.timeTakenSeconds)}
          </div>

          {/* Pass requirements */}
          {!result.passed && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg p-3 text-left">
              <strong>To pass:</strong> you need 75% overall
              {result.valuesTotal > 0 && ` and 100% on values questions`}.
              {result.percentage < 75 && (
                <span> You need {Math.ceil(result.total * 0.75) - result.score} more correct.</span>
              )}
              {result.valuesTotal > 0 &&
                result.valuesCorrect < result.valuesTotal && (
                  <span>
                    {' '}
                    You got {result.valuesCorrect}/{result.valuesTotal} values
                    questions right — you need them all.
                  </span>
                )}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        {categories.some(([, v]) => v.total > 0) && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Score by category</h2>
            <div className="space-y-3">
              {categories.map(([cat, { correct, total }]) => {
                if (total === 0) return null;
                const pct = Math.round((correct / total) * 100);
                const isValuesPass =
                  cat === 'values' ? correct === total : pct >= 75;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{CATEGORY_LABELS[cat]}</span>
                      <span
                        className={`font-bold ${
                          isValuesPass ? 'text-au-green' : 'text-red-500'
                        }`}
                      >
                        {correct}/{total} ({pct}%)
                        {cat === 'values' && !isValuesPass && ' ⚠️'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isValuesPass ? 'bg-au-green' : 'bg-red-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Incorrect answers review */}
        {incorrectAnswers.length > 0 && (
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-lg mb-1">
              Questions to review ({incorrectAnswers.length})
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Click any question to see the explanation.
            </p>
            <div className="space-y-4">
              {incorrectAnswers.map((a, i) => (
                <div key={a.questionId}>
                  <button
                    onClick={() =>
                      setReviewIndex(reviewIndex === i ? null : i)
                    }
                    className="w-full text-left text-sm font-medium text-red-600 flex items-start gap-2 hover:text-red-700"
                  >
                    <span className="flex-shrink-0">✗</span>
                    <span>{a.question}</span>
                    <span className="ml-auto flex-shrink-0">
                      {reviewIndex === i ? '▲' : '▼'}
                    </span>
                  </button>
                  {reviewIndex === i && (
                    <div className="mt-3 animate-fade-in">
                      <QuestionCard
                        question={{
                          id: a.questionId,
                          category: a.category,
                          question: a.question,
                          options: a.options,
                        }}
                        selectedOption={a.userAnswerIndex}
                        onSelect={() => {}}
                        correctIndex={a.correctIndex}
                        explanation={a.explanation}
                        showExplanation
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save progress prompt for anon users */}
        {isAnon && (
          <div className="bg-au-gold/10 border border-au-gold/30 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-sm text-gray-800">Want to track your progress?</p>
              <p className="text-xs text-gray-500">Create a free account to save scores across devices and see analytics.</p>
            </div>
            <Link href="/register" className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
              Sign up free
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/quiz" className="btn-primary text-center flex-1">
            Try again →
          </Link>
          {!isAnon && (
            <Link href="/dashboard" className="btn-secondary text-center flex-1">
              View dashboard
            </Link>
          )}
        </div>

        {/* Share */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              const text = `I scored ${result.percentage}% on the Australian Citizenship Quiz! ${result.passed ? '🎉 I passed!' : 'Practising hard 💪'} Can you beat me? 🇦🇺`;
              navigator.clipboard.writeText(text);
              alert('Score copied to clipboard! Share it with friends 🇦🇺');
            }}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
          >
            📋 Copy score to share
          </button>
        </div>
      </div>
    </div>
  );
}
