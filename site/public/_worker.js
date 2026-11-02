// @ts-check
// Pages advanced-mode worker: counts install-script requests, then redirects as _redirects did.
// _routes.json limits it to the two script paths; everything else stays static. design/REACH.md
const POSTHOG_URL = 'https://eu.i.posthog.com/i/v0/e/';
const POSTHOG_TOKEN = 'phc_pCgmw347sL5wFdtsf5eTG4NEki5DyyFwHNXiyUjT5UcW';
const LATEST = 'https://github.com/prismalens/prismalens/releases/latest/download/';
const SCRIPTS = /** @type {Record<string, string>} */ ({ '/install.sh': 'install.sh', '/install.ps1': 'install.ps1' });
const COUNTED_HOSTS = ['prismalens.io', 'www.prismalens.io'];

/** @param {string | null} ua */
export function uaFamily(ua) {
  const s = (ua ?? '').toLowerCase();
  if (s.includes('powershell')) return 'powershell';
  if (s.startsWith('curl/')) return 'curl';
  if (s.startsWith('wget/')) return 'wget';
  if (s.startsWith('mozilla/')) return 'browser';
  return 'other';
}

/** @param {string | null} location */
export function releaseTag(location) {
  return location?.match(/\/releases\/download\/([^/]+)\//)?.[1] ?? 'unknown';
}

/**
 * @param {string} file
 * @param {string | null} ua
 * @param {typeof fetch} fetchImpl
 */
export async function count(file, ua, fetchImpl = fetch) {
  const head = await fetchImpl(LATEST + file, { method: 'HEAD', redirect: 'manual' });
  await fetchImpl(POSTHOG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_TOKEN,
      event: 'install_script_requested',
      distinct_id: 'install-script',
      properties: {
        script: file,
        platform: file.endsWith('.ps1') ? 'windows' : 'macos-linux',
        release: releaseTag(head.headers.get('location')),
        ua_family: uaFamily(ua),
        $process_person_profile: false,
        $geoip_disable: true,
      },
    }),
  });
}

/**
 * @param {Request} request
 * @param {{ ASSETS: { fetch: typeof fetch } }} env
 * @param {{ waitUntil(p: Promise<unknown>): void }} ctx
 * @param {typeof fetch} [fetchImpl]
 */
export function handle(request, env, ctx, fetchImpl = fetch) {
  const url = new URL(request.url);
  const file = SCRIPTS[url.pathname];
  if (!file) return env.ASSETS.fetch(request);
  if (COUNTED_HOSTS.includes(url.hostname)) {
    try {
      ctx.waitUntil(count(file, request.headers.get('user-agent'), fetchImpl).catch(() => {}));
    } catch {
      // Counting must never block or break the redirect.
    }
  }
  return Response.redirect(LATEST + file, 302);
}

export default { fetch: handle };
