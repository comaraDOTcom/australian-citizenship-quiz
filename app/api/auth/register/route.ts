import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, migrateAnonAttempts, initDb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    const { ok } = rateLimit(`register:${ip}`, 5, 60_000);
    if (!ok) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 },
      );
    }

    const { email, name, password, anonId } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name and password are required.' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 },
      );
    }

    initDb();

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();

    createUser({ id, email, name, passwordHash });

    // Migrate anonymous quiz attempts to the new account
    if (anonId) {
      migrateAnonAttempts(anonId, id, name, email);
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 },
    );
  }
}
