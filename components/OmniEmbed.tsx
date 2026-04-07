'use client';

import { useEffect, useState } from 'react';

export default function OmniEmbed() {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/embed/omni')
      .then((r) => r.json())
      .then((data) => {
        if (data.embedUrl) {
          setEmbedUrl(data.embedUrl);
        } else {
          setError(data.error ?? 'Omni embed not available.');
        }
      })
      .catch(() => setError('Could not load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center max-w-sm">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-bold text-gray-700 mb-2">Analytics not configured</h3>
          <p className="text-sm text-gray-500 mb-4">
            {error}
          </p>
          <div className="text-xs text-gray-400 bg-gray-100 rounded-lg p-3 text-left font-mono">
            <p># Add to .env:</p>
            <p>OMNI_EMBED_SECRET=...</p>
            <p>OMNI_ORG_SLUG=your-org</p>
            <p>OMNI_DASHBOARD_ID=...</p>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Connect your{' '}
            <a
              href="https://docs.omni.co/connect-data/setup/motherduck"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              MotherDuck database to Omni
            </a>{' '}
            and create a dashboard over the <code>quiz_attempts</code> table.
          </p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl!}
      className="w-full border-0"
      style={{ height: '520px' }}
      title="Citizenship Quiz Analytics — powered by Omni"
      allow="fullscreen"
    />
  );
}
