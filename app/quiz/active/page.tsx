import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import QuizEngine from '@/components/QuizEngine';

export default async function ActiveQuizPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return <QuizEngine />;
}
