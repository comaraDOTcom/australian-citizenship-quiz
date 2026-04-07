/**
 * Weekly reminder endpoint — called by Vercel Cron (see vercel.json).
 * Fetches all users, queries their weekly stats, sends a summary email.
 */
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getUserWeeklyStats, getAllUsers, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  // Verify this is called by Vercel Cron (or our own scheduled task)
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  initDb();
  const users = await getAllUsers();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://citizenship-quiz.vercel.app';
  const from = process.env.REMINDER_FROM_EMAIL ?? 'quiz@citizenship-quiz.app';

  let sent = 0;
  for (const user of users) {
    const stats = await getUserWeeklyStats(user.id);
    if (stats.attempts_this_week === 0) continue; // Only email active users

    const passedText = stats.passed_this_week > 0
      ? `You passed ${stats.passed_this_week} mock test${stats.passed_this_week > 1 ? 's' : ''} this week!`
      : "Keep going — you haven't passed a mock test yet this week.";

    await resend.emails.send({
      from,
      to: user.email,
      subject: `Your citizenship quiz week in review 🇦🇺`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #00843D;">G'day ${user.name}! 👋</h1>
          <p>Here's your Australian Citizenship Quiz summary for this week:</p>

          <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 120px; background: #fff; border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #00843D;">${stats.attempts_this_week}</div>
                <div style="color: #666; font-size: 14px;">Quizzes taken</div>
              </div>
              <div style="flex: 1; min-width: 120px; background: #fff; border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #FFCD00;">${stats.best_score_this_week}%</div>
                <div style="color: #666; font-size: 14px;">Best score</div>
              </div>
              <div style="flex: 1; min-width: 120px; background: #fff; border-radius: 8px; padding: 16px; text-align: center;">
                <div style="font-size: 32px; font-weight: bold; color: #00843D;">${stats.avg_score_this_week}%</div>
                <div style="color: #666; font-size: 14px;">Average score</div>
              </div>
            </div>
          </div>

          <p style="font-size: 16px;">${passedText}</p>
          <p>The real test requires 75% overall and 100% on values questions. You've got this!</p>

          <a href="${appUrl}/quiz" style="
            display: inline-block;
            background: #00843D;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 16px;
          ">Take another quiz →</a>

          <p style="margin-top: 32px; color: #999; font-size: 12px;">
            Built with ❤️ to help you prepare for your Australian citizenship.
            Powered by <strong>Omni</strong> analytics.
          </p>
        </div>
      `,
    });
    sent++;
  }

  return NextResponse.json({ sent, total: users.length });
}
