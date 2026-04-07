import { NextRequest, NextResponse } from 'next/server';
import { buildMockTest, getRandomQuestions, type Category } from '@/lib/questions';

/** Returns a set of questions for a new quiz session.
 * Questions are stripped of the correct answer before sending. */
export async function POST(req: NextRequest) {
  const { mode } = await req.json();

  const validModes = ['mock_test', 'people', 'democracy', 'government', 'values'];
  if (!validModes.includes(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  let questions;
  if (mode === 'mock_test') {
    questions = buildMockTest();
  } else {
    questions = getRandomQuestions(10, mode as Category);
  }

  // Strip correctIndex and explanation before sending to client
  const sanitised = questions.map(({ id, category, question, options }) => ({
    id,
    category,
    question,
    options,
  }));

  return NextResponse.json({
    sessionId: crypto.randomUUID(),
    mode,
    questions: sanitised,
    timeLimit: mode === 'mock_test' ? 45 * 60 : 15 * 60,
    startedAt: new Date().toISOString(),
  });
}
