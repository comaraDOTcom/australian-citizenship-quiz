import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { generateOmniEmbedUrl, getQuizDashboardPath } from '@/lib/omni';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check Omni is configured
  if (!process.env.OMNI_EMBED_SECRET || !process.env.OMNI_ORG_SLUG) {
    return NextResponse.json(
      { error: 'Omni embed is not configured on this server.' },
      { status: 503 },
    );
  }

  try {
    const embedUrl = generateOmniEmbedUrl({
      externalId: session.user.id,
      name: session.user.name,
      contentPath: getQuizDashboardPath(),
      userAttributes: {
        user_email: session.user.email,
      },
    });

    return NextResponse.json({ embedUrl });
  } catch (err) {
    console.error('Omni embed URL generation failed:', err);
    return NextResponse.json(
      { error: 'Failed to generate embed URL.' },
      { status: 500 },
    );
  }
}
