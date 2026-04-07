import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const CATEGORIES = [
  {
    id: 'people',
    label: 'Australia & Its People',
    icon: '🦘',
    description: 'History, geography, symbols and First Nations peoples',
    colour: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    id: 'democracy',
    label: "Democratic Beliefs",
    icon: '🗳️',
    description: 'Rights, freedoms, equality and democratic values',
    colour: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    id: 'government',
    label: 'Government & Law',
    icon: '⚖️',
    description: 'Parliament, courts, elections and the Constitution',
    colour: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    id: 'values',
    label: 'Australian Values',
    icon: '🤝',
    description: 'Mateship, fair go, tolerance and shared values',
    colour: 'bg-amber-50 border-amber-200 text-amber-700',
  },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/quiz');
  // Anon users see the landing page — CTA goes straight to quiz

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="quiz-gradient text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-4">🇦🇺</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Aussie Citizenship Quiz
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
            Prepare for the Australian citizenship test with{' '}
            <span className="text-au-gold font-semibold">80+ practice questions</span>,
            real-time analytics and a leaderboard. Built on{' '}
            <span className="text-au-gold font-semibold">Omni</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quiz" className="btn-gold text-lg px-8 py-4 rounded-xl font-bold">
              Start Practising →
            </Link>
            <Link href="/login" className="btn-secondary border-white/40 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-xl">
              Sign In
            </Link>
          </div>

          {/* Test overview pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 text-sm">
            {[
              '20 questions per mock test',
              '45-minute time limit',
              '75% needed to pass',
              '100% on values questions',
            ].map((fact) => (
              <span
                key={fact}
                className="bg-white/20 backdrop-blur px-4 py-2 rounded-full"
              >
                {fact}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Category overview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Four test categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`card p-6 border ${cat.colour} flex gap-4 items-start`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <h3 className="font-bold text-lg">{cat.label}</h3>
                <p className="text-sm mt-1 opacity-80">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics teaser */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Powered by Omni Analytics
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Track your scores, see where you need to improve, and compare your
            progress with others — all backed by{' '}
            <strong>MotherDuck</strong> and embedded{' '}
            <strong>Omni</strong> dashboards.
          </p>
          <Link href="/quiz" className="btn-primary text-lg inline-block">
            Start practising now →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-8">
        Built with Omni · Analytics powered by MotherDuck ·
        Questions based on{' '}
        <a
          href="https://immi.homeaffairs.gov.au/citizenship/test-and-interview/our-common-bond"
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Our Common Bond
        </a>
      </footer>
    </main>
  );
}
