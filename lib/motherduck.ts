/**
 * MotherDuck write-ahead sync.
 *
 * Every quiz attempt is mirrored to MotherDuck so that Omni can build
 * analytics dashboards over the data.
 *
 * Uses the MotherDuck HTTPS API (no native binary required).
 * Set MOTHERDUCK_TOKEN in your env to enable syncing.
 *
 * MotherDuck API reference:
 * https://motherduck.com/docs/integrations/language-apis-and-drivers/python/
 * (Uses the SQL-over-HTTP endpoint that MotherDuck exposes.)
 */
import type { DbAttempt, DbAnswer } from './db';

const MOTHERDUCK_API = 'https://app.motherduck.com/query';

async function mdQuery(sql: string): Promise<void> {
  const token = process.env.MOTHERDUCK_TOKEN;
  if (!token) return; // Silently skip if not configured

  const res = await fetch(MOTHERDUCK_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: sql,
      database: 'citizenship_quiz',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MotherDuck query failed (${res.status}): ${text}`);
  }
}

/** Ensure MotherDuck tables exist. Call once at app startup. */
export async function initMotherDuck(): Promise<void> {
  const token = process.env.MOTHERDUCK_TOKEN;
  if (!token) return;

  await mdQuery(`
    CREATE DATABASE IF NOT EXISTS citizenship_quiz;

    CREATE TABLE IF NOT EXISTS citizenship_quiz.quiz_attempts (
      id                 VARCHAR PRIMARY KEY,
      user_id            VARCHAR NOT NULL,
      user_name          VARCHAR NOT NULL,
      user_email         VARCHAR NOT NULL,
      mode               VARCHAR NOT NULL,
      score              INTEGER NOT NULL,
      total_questions    INTEGER NOT NULL,
      percentage         DOUBLE NOT NULL,
      passed             BOOLEAN NOT NULL,
      values_correct     INTEGER NOT NULL,
      values_total       INTEGER NOT NULL,
      time_taken_seconds INTEGER NOT NULL,
      completed_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS citizenship_quiz.quiz_answers (
      id                 VARCHAR PRIMARY KEY,
      attempt_id         VARCHAR NOT NULL,
      question_id        VARCHAR NOT NULL,
      category           VARCHAR NOT NULL,
      user_answer_index  INTEGER NOT NULL,
      correct_index      INTEGER NOT NULL,
      is_correct         BOOLEAN NOT NULL,
      attempted_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

/** Mirror a quiz attempt and its answers to MotherDuck. */
export async function syncAttemptToMotherDuck(
  attempt: Omit<DbAttempt, 'completed_at'>,
  answers: Omit<DbAnswer, 'id'>[],
): Promise<void> {
  const token = process.env.MOTHERDUCK_TOKEN;
  if (!token) return;

  const passed = attempt.passed ? 'true' : 'false';

  // Insert attempt
  await mdQuery(`
    INSERT OR IGNORE INTO citizenship_quiz.quiz_attempts
      (id, user_id, user_name, user_email, mode, score, total_questions,
       percentage, passed, values_correct, values_total, time_taken_seconds)
    VALUES (
      '${esc(attempt.id)}',
      '${esc(attempt.user_id)}',
      '${esc(attempt.user_name)}',
      '${esc(attempt.user_email)}',
      '${esc(attempt.mode)}',
      ${attempt.score},
      ${attempt.total_questions},
      ${attempt.percentage},
      ${passed},
      ${attempt.values_correct},
      ${attempt.values_total},
      ${attempt.time_taken_seconds}
    );
  `);

  // Insert answers in batches
  if (answers.length > 0) {
    const rows = answers
      .map((a) => {
        const ansId = crypto.randomUUID();
        const correct = a.is_correct ? 'true' : 'false';
        return `('${ansId}','${esc(a.attempt_id)}','${esc(a.question_id)}','${esc(a.category)}',${a.user_answer_index},${a.correct_index},${correct})`;
      })
      .join(',\n');

    await mdQuery(`
      INSERT OR IGNORE INTO citizenship_quiz.quiz_answers
        (id, attempt_id, question_id, category, user_answer_index, correct_index, is_correct)
      VALUES ${rows};
    `);
  }
}

/** Escape single quotes in SQL string literals. */
function esc(s: string): string {
  return s.replace(/'/g, "''");
}
