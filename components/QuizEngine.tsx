'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from './QuestionCard';
import ResultsCard from './ResultsCard';
import type { Category } from '@/lib/questions';

interface QuizQuestion {
  id: string;
  category: Category;
  question: string;
  options: string[];
}

interface QuizSession {
  sessionId: string;
  mode: string;
  questions: QuizQuestion[];
  timeLimit: number;
  startedAt: string;
}

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

export default function QuizEngine() {
  const router = useRouter();
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const stored = sessionStorage.getItem('quizSession');
    if (!stored) {
      router.replace('/quiz');
      return;
    }
    const s: QuizSession = JSON.parse(stored);
    setSession(s);
    setTimeLeft(s.timeLimit);
    startTimeRef.current = Date.now();
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (!session || result) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          void submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, result]);

  const submitQuiz = useCallback(async () => {
    if (!session || submitting) return;
    setSubmitting(true);

    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: session.mode,
          answers,
          questionIds: session.questions.map((q) => q.id),
          timeTakenSeconds,
        }),
      });
      if (!res.ok) throw new Error('Submit failed');
      const data: SubmitResult = await res.json();
      sessionStorage.removeItem('quizSession');
      setResult(data);
    } catch {
      alert('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  }, [session, answers, submitting]);

  function handleSelectOption(index: number) {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);
    if (session) {
      const question = session.questions[currentIndex];
      setAnswers((prev) => ({ ...prev, [question.id]: index }));
    }
  }

  function handleNext() {
    if (!session) return;
    setSelectedOption(null);
    setShowFeedback(false);
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      void submitQuiz();
    }
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading quiz…</div>
      </div>
    );
  }

  if (result) {
    return <ResultsCard result={result} />;
  }

  const question = session.questions[currentIndex];
  const progress = ((currentIndex + 1) / session.questions.length) * 100;
  const isLast = currentIndex === session.questions.length - 1;
  const timeWarning = timeLeft < 120; // last 2 minutes

  // For feedback: we don't have the correct answer on the client.
  // We show the selection as "locked" and reveal on submit.
  // (In the results we get the full breakdown.)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Quiz header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-600 capitalize">
            {session.mode.replace('_', ' ')}
          </div>
          <div
            className={`text-sm font-bold tabular-nums ${
              timeWarning ? 'text-red-500 animate-pulse' : 'text-gray-700'
            }`}
          >
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-au-green transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Question counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">
            Question <span className="font-bold text-gray-800">{currentIndex + 1}</span>{' '}
            of {session.questions.length}
          </span>
          <div className="flex gap-1">
            {session.questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentIndex
                    ? answers[session.questions[i].id] !== undefined
                      ? 'bg-au-green'
                      : 'bg-gray-300'
                    : i === currentIndex
                    ? 'bg-au-gold'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <QuestionCard
          question={question}
          selectedOption={selectedOption}
          onSelect={handleSelectOption}
        />

        {/* Next button (shown after selecting) */}
        {showFeedback && (
          <div className="mt-6 animate-fade-in">
            <button
              onClick={handleNext}
              disabled={submitting}
              className="btn-primary w-full text-center"
            >
              {submitting
                ? 'Submitting…'
                : isLast
                ? 'Finish & see results →'
                : 'Next question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
