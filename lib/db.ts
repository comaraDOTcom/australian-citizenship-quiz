/**
 * Database layer using better-sqlite3 for the operational store.
 *
 * All quiz attempts are ALSO written to MotherDuck (cloud DuckDB) so that
 * Omni can connect to MotherDuck and provide embedded analytics dashboards.
 *
 * Schema is auto-created on first use.
 */
import Database from 'better-sqlite3';
import path from 'path';
import { syncAttemptToMotherDuck } from './motherduck';

export interface DbUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  is_admin: number;
  created_at: string;
}

export interface DbAttempt {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  mode: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean | number;
  values_correct: number;
  values_total: number;
  time_taken_seconds: number;
  completed_at: string;
}

export interface DbAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  category: string;
  user_answer_index: number;
  correct_index: number;
  is_correct: boolean | number;
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  const dbPath =
    process.env.SQLITE_PATH ??
    (process.env.VERCEL ? '/tmp/quiz.db' : path.join(process.cwd(), 'quiz.db'));
  _db = new Database(dbPath);
  _db.pragma('journal_mode = WAL');
  initDb();
  return _db;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

export function initDb(): void {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id           TEXT PRIMARY KEY,
      email        TEXT UNIQUE NOT NULL,
      name         TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin     INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id                 TEXT PRIMARY KEY,
      user_id            TEXT NOT NULL,
      user_name          TEXT NOT NULL,
      user_email         TEXT NOT NULL,
      mode               TEXT NOT NULL,
      score              INTEGER NOT NULL,
      total_questions    INTEGER NOT NULL,
      percentage         REAL NOT NULL,
      passed             INTEGER NOT NULL,
      values_correct     INTEGER NOT NULL,
      values_total       INTEGER NOT NULL,
      time_taken_seconds INTEGER NOT NULL,
      completed_at       TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quiz_answers (
      id                 TEXT PRIMARY KEY,
      attempt_id         TEXT NOT NULL,
      question_id        TEXT NOT NULL,
      category           TEXT NOT NULL,
      user_answer_index  INTEGER NOT NULL,
      correct_index      INTEGER NOT NULL,
      is_correct         INTEGER NOT NULL
    );
  `);

  // Migration: add is_admin column if missing
  const cols = db.pragma('table_info(users)') as { name: string }[];
  if (!cols.some((c) => c.name === 'is_admin')) {
    db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0`);
  }
}

export function isAdmin(userId: string): boolean {
  const db = getDb();
  const row = db
    .prepare(`SELECT is_admin FROM users WHERE id = ? LIMIT 1`)
    .get(userId) as { is_admin: number } | undefined;
  return row?.is_admin === 1;
}

export function migrateAnonAttempts(anonId: string, userId: string, userName: string, userEmail: string): number {
  const db = getDb();
  const result = db
    .prepare(
      `UPDATE quiz_attempts SET user_id = ?, user_name = ?, user_email = ? WHERE user_id = ?`,
    )
    .run(userId, userName, userEmail, anonId);
  db.prepare(`UPDATE quiz_answers SET attempt_id = attempt_id WHERE attempt_id IN (SELECT id FROM quiz_attempts WHERE user_id = ?)`)
    .run(userId);
  return result.changes;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export function createUser(user: {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)`,
  ).run(user.id, user.email, user.name, user.passwordHash);
}

export function getUserByEmail(email: string): DbUser | null {
  const db = getDb();
  return (
    (db
      .prepare(`SELECT * FROM users WHERE email = ? LIMIT 1`)
      .get(email) as DbUser | undefined) ?? null
  );
}

export function getUserById(id: string): DbUser | null {
  const db = getDb();
  return (
    (db
      .prepare(`SELECT * FROM users WHERE id = ? LIMIT 1`)
      .get(id) as DbUser | undefined) ?? null
  );
}

export function getAllUsers(): { id: string; email: string; name: string }[] {
  const db = getDb();
  return db
    .prepare(`SELECT id, email, name FROM users`)
    .all() as { id: string; email: string; name: string }[];
}

// ─── Attempts ─────────────────────────────────────────────────────────────────

export async function saveAttempt(
  attempt: Omit<DbAttempt, 'completed_at'>,
  answers: Omit<DbAnswer, 'id'>[],
): Promise<void> {
  const db = getDb();

  db.prepare(
    `INSERT INTO quiz_attempts
       (id, user_id, user_name, user_email, mode, score, total_questions,
        percentage, passed, values_correct, values_total, time_taken_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    attempt.id,
    attempt.user_id,
    attempt.user_name,
    attempt.user_email,
    attempt.mode,
    attempt.score,
    attempt.total_questions,
    attempt.percentage,
    attempt.passed ? 1 : 0,
    attempt.values_correct,
    attempt.values_total,
    attempt.time_taken_seconds,
  );

  const insertAnswer = db.prepare(
    `INSERT INTO quiz_answers
       (id, attempt_id, question_id, category, user_answer_index, correct_index, is_correct)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  for (const ans of answers) {
    insertAnswer.run(
      crypto.randomUUID(),
      ans.attempt_id,
      ans.question_id,
      ans.category,
      ans.user_answer_index,
      ans.correct_index,
      ans.is_correct ? 1 : 0,
    );
  }

  // Fire-and-forget sync to MotherDuck for Omni analytics
  syncAttemptToMotherDuck(attempt, answers).catch((err) =>
    console.error('[MotherDuck sync]', err),
  );
}

export function getAttemptById(id: string): DbAttempt | null {
  const db = getDb();
  return (
    (db
      .prepare(`SELECT * FROM quiz_attempts WHERE id = ? LIMIT 1`)
      .get(id) as DbAttempt | undefined) ?? null
  );
}

export function getUserAttempts(userId: string): DbAttempt[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM quiz_attempts
       WHERE user_id = ?
       ORDER BY completed_at DESC
       LIMIT 50`,
    )
    .all(userId) as DbAttempt[];
}

export function getLeaderboard(): {
  user_name: string;
  best_percentage: number;
  attempts: number;
  passed_count: number;
}[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT
         user_name,
         MAX(percentage)                              AS best_percentage,
         COUNT(*)                                     AS attempts,
         SUM(CASE WHEN passed = 1 THEN 1 ELSE 0 END) AS passed_count
       FROM quiz_attempts
       WHERE mode = 'mock_test'
       GROUP BY user_name
       ORDER BY best_percentage DESC, attempts ASC
       LIMIT 20`,
    )
    .all() as {
    user_name: string;
    best_percentage: number;
    attempts: number;
    passed_count: number;
  }[];
}

export function getUserWeeklyStats(userId: string): {
  attempts_this_week: number;
  best_score_this_week: number;
  avg_score_this_week: number;
  passed_this_week: number;
} {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT
         COUNT(*)                                              AS attempts_this_week,
         COALESCE(MAX(percentage), 0)                          AS best_score_this_week,
         COALESCE(ROUND(AVG(percentage), 1), 0)                AS avg_score_this_week,
         COALESCE(SUM(CASE WHEN passed=1 THEN 1 ELSE 0 END),0) AS passed_this_week
       FROM quiz_attempts
       WHERE user_id = ?
         AND completed_at >= datetime('now', '-7 days')`,
    )
    .get(userId) as
    | {
        attempts_this_week: number;
        best_score_this_week: number;
        avg_score_this_week: number;
        passed_this_week: number;
      }
    | undefined;

  return row ?? {
    attempts_this_week: 0,
    best_score_this_week: 0,
    avg_score_this_week: 0,
    passed_this_week: 0,
  };
}

/** Get all question IDs a user has seen in a given mode (most recent attempts first). */
export function getSeenQuestionIds(userId: string, mode?: string): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT DISTINCT qa.question_id
       FROM quiz_answers qa
       JOIN quiz_attempts att ON att.id = qa.attempt_id
       WHERE att.user_id = ?
         ${mode ? `AND att.mode = ?` : ''}
       ORDER BY att.completed_at DESC`,
    )
    .all(...(mode ? [userId, mode] : [userId])) as { question_id: string }[];
  return rows.map((r) => r.question_id);
}

/** Get question IDs the user has answered incorrectly (across all attempts).
 *  Excludes questions they later answered correctly. */
export function getIncorrectQuestionIds(userId: string): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT DISTINCT qa.question_id
       FROM quiz_answers qa
       JOIN quiz_attempts att ON att.id = qa.attempt_id
       WHERE att.user_id = ? AND qa.is_correct = 0
         AND qa.question_id NOT IN (
           SELECT qa2.question_id
           FROM quiz_answers qa2
           JOIN quiz_attempts att2 ON att2.id = qa2.attempt_id
           WHERE att2.user_id = ? AND qa2.is_correct = 1
         )`,
    )
    .all(userId, userId) as { question_id: string }[];
  return rows.map((r) => r.question_id);
}
