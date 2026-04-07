import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { buildMockTest, getRandomQuestions, getQuestionsByIds, type Category } from '@/lib/questions';
import { getSeenQuestionIds, getIncorrectQuestionIds } from '@/lib/db';

/** Returns a set of questions for a new quiz session.
 * Questions are stripped of the correct answer before sending.
 * Avoids repeating questions the user has already seen (when possible). */
export async function POST(req: NextRequest) {
  const { mode, anonId } = await req.json();

  const validModes = ['mock_test', 'people', 'democracy', 'government', 'values', 'weak_areas'];
  if (!validModes.includes(mode)) {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  // Determine user identity for history lookup
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? anonId;

  // Get previously-seen question IDs to avoid repeats
  const seenIds = userId ? getSeenQuestionIds(userId, mode === 'weak_areas' ? undefined : mode) : [];

  let questions;
  if (mode === 'weak_areas') {
    // Practice mode targeting questions the user got wrong
    const incorrectIds = userId ? getIncorrectQuestionIds(userId) : [];
    if (incorrectIds.length === 0) {
      return NextResponse.json({ error: 'No incorrect questions to review. Try a quiz first!' }, { status: 400 });
    }
    const allWeak = getQuestionsByIds(incorrectIds);
    // Shuffle and take up to 10
    const shuffled = [...allWeak].sort(() => Math.random() - 0.5);
    questions = shuffled.slice(0, Math.min(10, shuffled.length));
  } else if (mode === 'mock_test') {
    questions = buildMockTest(seenIds);
  } else {
    questions = getRandomQuestions(10, mode as Category, seenIds);
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
