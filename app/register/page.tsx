'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const anonId = typeof window !== 'undefined' ? localStorage.getItem('quiz_anon_id') : null;
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password, anonId }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Registration failed.');
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    await signIn('credentials', { email, password, redirect: false });
    router.push('/quiz');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="card w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🇦🇺</div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-gray-500 mt-1">Free to join, start practising instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-au-green"
              placeholder="Jess Currey"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-au-green"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-au-green"
              placeholder="at least 6 characters"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-center">
            {loading ? 'Creating account…' : 'Create account →'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-au-green font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
