# Aussie Citizenship Quiz

A web app to help people prepare for the Australian citizenship test — with gamified quizzes, progress tracking, and embedded analytics powered by [Omni](https://omni.co) and [MotherDuck](https://motherduck.com).

**Live:** [australian-citizenship-quiz.vercel.app](https://australian-citizenship-quiz.vercel.app)

## Features

- **No sign-up required** — start practising immediately. Progress is saved in your browser via localStorage. Optionally create an account to sync across devices and unlock the analytics dashboard.
- **80 questions** across 4 categories: Australia & Its People, Democratic Beliefs, Government & Law, and Australian Values.
- **Mock test mode** — 20 questions, 45-minute timer, real exam format (75% pass mark + 100% on values questions).
- **Category practice** — drill specific topics with 10-question sessions.
- **Instant feedback** — see correct answers and explanations after each quiz.
- **Leaderboard** — compare scores with other users.
- **Analytics dashboard** — embedded Omni dashboard over MotherDuck for deep analytics on quiz performance.
- **Weekly email reminders** — powered by Resend, triggered by Vercel Cron.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth v4 (credentials) |
| Local DB | SQLite via better-sqlite3 |
| Analytics DB | MotherDuck (cloud DuckDB) |
| Analytics UI | Omni embedded dashboards |
| Email | Resend |
| Hosting | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Clone
git clone https://github.com/comaraDOTcom/australian-citizenship-quiz.git
cd australian-citizenship-quiz

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local — at minimum set NEXTAUTH_SECRET (generate with: openssl rand -base64 32)

# Init database
npm run db:init

# Run
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Admin Setup

To make a user an admin (grants future admin features):

```bash
npx tsx scripts/set-admin.ts user@example.com [optional-new-password]
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXTAUTH_SECRET` | Yes | Random secret for JWT signing |
| `NEXTAUTH_URL` | Yes (prod) | App URL, e.g. `https://your-app.vercel.app` |
| `MOTHERDUCK_TOKEN` | No | Enables analytics sync to MotherDuck |
| `OMNI_EMBED_SECRET` | No | Enables embedded Omni dashboard |
| `OMNI_ORG_SLUG` | No | Your Omni org slug |
| `OMNI_DASHBOARD_ID` | No | Dashboard ID to embed |
| `RESEND_API_KEY` | No | Enables weekly email reminders |
| `CRON_SECRET` | No | Protects the `/api/reminders/send` endpoint |

## Project Structure

```
app/
  page.tsx              # Landing page
  quiz/page.tsx         # Quiz hub — pick a mode
  quiz/active/page.tsx  # Active quiz session
  dashboard/page.tsx    # Analytics dashboard (auth required)
  login/, register/     # Auth pages
  api/
    quiz/start          # Generate quiz questions
    quiz/submit         # Score and save results
    attempts            # User attempt history
    leaderboard         # Global leaderboard
    embed/omni          # Signed Omni embed URL
    reminders/send      # Weekly email (Vercel Cron)
components/
  QuizHub.tsx           # Mode selection + stats
  QuizEngine.tsx        # Interactive quiz flow
  ResultsCard.tsx       # Score, breakdown, review
  QuestionCard.tsx      # Individual question UI
lib/
  questions.ts          # 80 questions + scoring logic
  db.ts                 # SQLite operations
  motherduck.ts         # MotherDuck HTTP sync
  omni.ts               # Omni embed URL signing
  auth.ts               # NextAuth config
  user-context.tsx      # Anonymous + authenticated user context
  rate-limit.ts         # In-memory rate limiter
```

## How It Works

### Anonymous Play (PinDrop-style)

Users can play without creating an account. On first visit, a UUID is generated and stored in `localStorage`. Quiz attempts are saved to the server tied to this anonymous ID. When a user later registers, all their anonymous attempts are automatically migrated to their new account.

### Real Test Format

The Australian citizenship test has 20 multiple-choice questions drawn from the resource book *Our Common Bond*. To pass you need:
- **75% overall** (15 out of 20)
- **100% on values questions** (all values questions must be correct)

The mock test mode replicates this exactly with a 45-minute timer.

### Analytics Pipeline

```
Quiz attempt → SQLite (local) → MotherDuck (cloud) → Omni (dashboard)
```

Every quiz submission is saved to SQLite for fast local reads, then fire-and-forget synced to MotherDuck via HTTP API. Omni connects to MotherDuck and provides embedded analytics dashboards via signed SSO URLs.

## License

MIT
