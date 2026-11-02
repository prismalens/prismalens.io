// Collects PrismaLens reach counts (npm, GitHub, Homebrew) and sends them to PostHog.
// Usage: tsx scripts/reach/collect.mts [--dry-run]   design/REACH.md
import {
  BREW_FORMULA, NPM_PACKAGES, REPO, type ReachEvent,
  brewEvent, npmEvents, popularEvents, releaseEvents, repoEvent, trafficEvents, utcDay,
} from './reach.mts';

const POSTHOG_HOST = 'https://eu.i.posthog.com';
const POSTHOG_TOKEN = 'phc_pCgmw347sL5wFdtsf5eTG4NEki5DyyFwHNXiyUjT5UcW';
const dryRun = process.argv.includes('--dry-run');
const trafficToken = process.env.REACH_GITHUB_TOKEN;
const publicToken = trafficToken || process.env.GITHUB_TOKEN;
const today = utcDay(new Date());

async function get<T>(url: string, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'User-Agent': 'prismalens-reach' };
  if (url.startsWith('https://api.github.com/')) {
    headers.Accept = 'application/vnd.github+json';
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as T;
}

const gh = <T,>(path: string, token = publicToken) => get<T>(`https://api.github.com/repos/${REPO}${path}`, token);

const sources: Record<string, () => Promise<ReachEvent[]>> = {
  async npm() {
    const ranges = await Promise.all(
      NPM_PACKAGES.map((p) => get<Parameters<typeof npmEvents>[0]>(
        `https://api.npmjs.org/downloads/range/last-month/${p.replace('/', '%2F')}`,
      )),
    );
    return ranges.flatMap(npmEvents);
  },
  async releases() {
    const all: Parameters<typeof releaseEvents>[1] = [];
    for (let page = 1; ; page++) {
      const batch = await gh<typeof all>(`/releases?per_page=100&page=${page}`);
      all.push(...batch);
      if (batch.length < 100) break;
    }
    return releaseEvents(today, all);
  },
  async repo() {
    return [repoEvent(today, await gh(''))];
  },
  async homebrew() {
    const report = await get<Parameters<typeof brewEvent>[1]>('https://formulae.brew.sh/api/analytics/install/30d.json');
    return [brewEvent(today, report, BREW_FORMULA)];
  },
  async traffic() {
    if (!trafficToken) {
      console.log('traffic: skipped, REACH_GITHUB_TOKEN is not set (see design/REACH.md)');
      return [];
    }
    const [views, clones, referrers, paths] = await Promise.all([
      gh<Parameters<typeof trafficEvents>[1]>('/traffic/views?per=day', trafficToken),
      gh<Parameters<typeof trafficEvents>[1]>('/traffic/clones?per=day', trafficToken),
      gh<Parameters<typeof popularEvents>[1]>('/traffic/popular/referrers', trafficToken),
      gh<Parameters<typeof popularEvents>[1]>('/traffic/popular/paths', trafficToken),
    ]);
    return [
      ...trafficEvents('views', views),
      ...trafficEvents('clones', clones),
      ...popularEvents(today, referrers),
      ...popularEvents(today, paths),
    ];
  },
};

async function send(batch: ReachEvent[]) {
  for (let i = 0; i < batch.length; i += 500) {
    const res = await fetch(`${POSTHOG_HOST}/batch/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: POSTHOG_TOKEN, batch: batch.slice(i, i + 500) }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) throw new Error(`PostHog ${res.status}: ${await res.text()}`);
  }
}

const events: ReachEvent[] = [];
let failed = false;
for (const [name, collect] of Object.entries(sources)) {
  try {
    const got = await collect();
    console.log(`${name}: ${got.length} events`);
    events.push(...got);
  } catch (err) {
    failed = true;
    console.error(`${name}: failed, ${(err as Error).message}`);
  }
}

if (dryRun) {
  for (const e of events) console.log(JSON.stringify(e));
  console.log(`dry run: ${events.length} events, nothing sent`);
} else {
  await send(events);
  console.log(`sent ${events.length} events to PostHog`);
}
if (failed) process.exitCode = 1;
