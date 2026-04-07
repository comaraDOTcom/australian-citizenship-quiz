import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { QUESTIONS, scoreQuiz } from '@/lib/questions';
import { saveAttempt, initDb } from '@/lib/db';

interface SubmitBody {
  mode: string;
  /** Map of questionId → selected option index */
  answers: Record<string, number>;
  questionIds: string[];
  timeTakenSeconds: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: SubmitBody = await req.json();
  const { mode, answers, questionIds, timeTakenSeconds } = body;

  if (!mode || !answers || !questionIds) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Re-hydrate questions from server-side truth
  const questionMap = new Map(QUESTIONS.map((q) => [q.id, q]));
  const questions = questionIds
    .map((id) => questionMap.get(id))
    .filter(Boolean) as typeof QUESTIONS;

  if (questions.length === 0) {
    return NextResponse.json({ error: 'No valid questions found' }, { status: 400 });
  }

  const result = scoreQuiz(questions, answers);
  const attemptId = crypto.randomUUID();

  initDb();

  const dbAnswers = questions.map((q) => ({
    attempt_id: attemptId,
    question_id: q.id,
    category: q.category,
    user_answer_index: answers[q.id] ?? -1,
    correct_index: q.correctIndex,
    is_correct: answers[q.id] === q.correctIndex,
  }));

  await saveAttempt(
    {
      id: attemptId,
      user_id: session.user.id,
      user_name: session.user.name,
      user_email: session.user.email,
      mode,
      score: result.correct,
      total_questions: result.total,
      percentage: result.percentage,
      passed: result.passed,
      values_correct: result.valuesCorrect,
      values_total: result.valuesTotal,
      time_taken_seconds: timeTakenSeconds,
    },
    dbAnswers,
  );

  // Return full result including correct answers and explanations
  const detailedAnswers = questions.map((q) => ({
    questionId: q.id,
    question: q.question,
    category: q.category,
    options: q.options,
    correctIndex: q.correctIndex,
    userAnswerIndex: answers[q.id] ?? -1,
    isCorrect: answers[q.id] === q.correctIndex,
    explanation: q.explanation,
  }));

  return NextResponse.json({
    attemptId,
    mode,
    score: result.correct,
    total: result.total,
    percentage: result.percentage,
    passed: result.passed,
    valuesCorrect: result.valuesCorrect,
    valuesTotal: result.valuesTotal,
    byCategory: result.byCategory,
    timeTakenSeconds,
    answers: detailedAnswers,
  });
}
