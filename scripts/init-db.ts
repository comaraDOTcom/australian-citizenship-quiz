/**
 * Run with: npm run db:init
 * Creates all database tables in MotherDuck (or local DuckDB).
 */
import { initDb } from '../lib/db';

async function main() {
  console.log('Initialising database schema…');
  await initDb();
  console.log('Done! Tables created: users, quiz_attempts, quiz_answers');
  process.exit(0);
}

main().catch((err) => {
  console.error('Init failed:', err);
  process.exit(1);
});
