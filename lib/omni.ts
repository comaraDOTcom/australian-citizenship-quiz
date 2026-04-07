/**
 * Omni Embed URL generator.
 *
 * Uses Standard SSO to generate a signed embed URL server-side.
 * See: https://docs.omni.co/embed/setup/standard-sso
 *
 * Required environment variables:
 *   OMNI_EMBED_SECRET  - from Settings > Embed > Admin in your Omni instance
 *   OMNI_ORG_SLUG      - your organisation slug (e.g. "acme" for acme.omniapp.co)
 *   OMNI_DASHBOARD_ID  - the dashboard to embed
 */
import crypto from 'crypto';

interface OmniEmbedOptions {
  /** Unique stable user identifier (e.g. user's DB id) */
  externalId: string;
  /** Display name shown in Omni */
  name: string;
  /** The Omni content path, e.g. /dashboards/abc123 */
  contentPath: string;
  /** Optional user attributes for row-level security */
  userAttributes?: Record<string, string>;
  /** Optional theme override */
  theme?: string;
}

export function generateOmniEmbedUrl(options: OmniEmbedOptions): string {
  const secret = process.env.OMNI_EMBED_SECRET;
  const orgSlug = process.env.OMNI_ORG_SLUG;

  if (!secret || !orgSlug) {
    throw new Error(
      'OMNI_EMBED_SECRET and OMNI_ORG_SLUG must be set to use Omni embed.',
    );
  }

  const nonce = crypto.randomBytes(16).toString('hex'); // 32-char hex string
  const host = `https://${orgSlug}.embed-omniapp.co`;

  const params: Record<string, string> = {
    contentPath: options.contentPath,
    externalId: options.externalId,
    name: options.name,
    nonce,
  };

  if (options.userAttributes) {
    params.userAttributes = JSON.stringify(options.userAttributes);
  }
  if (options.theme) {
    params.theme = options.theme;
  }

  // Build the string to sign: sorted key=value pairs joined by newline
  const signingString = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(signingString)
    .digest('base64url');

  const searchParams = new URLSearchParams({
    ...params,
    signature,
  });

  return `${host}/embed/login?${searchParams.toString()}`;
}

/** Returns the default dashboard path for the citizenship quiz analytics. */
export function getQuizDashboardPath(): string {
  const dashboardId = process.env.OMNI_DASHBOARD_ID;
  if (!dashboardId) return '/dashboards/placeholder';
  return `/dashboards/${dashboardId}`;
}
