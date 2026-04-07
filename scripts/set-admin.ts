/**
 * Set a user as admin and optionally reset their password.
 * Usage: npx tsx scripts/set-admin.ts <email> [new-password]
 */
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email) {
  console.error('Usage: npx tsx scripts/set-admin.ts <email> [new-password]');
  process.exit(1);
}

const dbPath = process.env.SQLITE_PATH ?? path.join(process.cwd(), 'quiz.db');
const db = new Database(dbPath);

// Add is_admin column if missing
const cols = db.pragma('table_info(users)') as { name: string }[];
if (!cols.some((c) => c.name === 'is_admin')) {
  db.exec(`ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0`);
}

const user = db.prepare('SELECT id, email, name FROM users WHERE email = ?').get(email) as
  | { id: string; email: string; name: string }
  | undefined;

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

db.prepare('UPDATE users SET is_admin = 1 WHERE id = ?').run(user.id);
console.log(`✓ ${user.name} (${user.email}) is now admin`);

if (newPassword) {
  const hash = bcrypt.hashSync(newPassword, 12);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, user.id);
  console.log(`✓ Password reset successfully`);
}

db.close();
