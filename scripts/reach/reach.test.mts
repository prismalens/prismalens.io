import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  brewEvent, npmEvents, popularEvents, reachEvent, releaseEvents, repoEvent, trafficEvents,
} from './reach.mts';
import { handle, releaseTag, uaFamily } from '../../site/public/_worker.js';

describe('reach collector', () => {
  it('gives the same (source, day) the same uuid and timestamp, so re-runs upsert', () => {
    const a = reachEvent('reach_npm_downloads', '2026-10-01', 'prismalens', { downloads: 1 });
    const b = reachEvent('reach_npm_downloads', '2026-10-01', 'prismalens', { downloads: 9 });
    assert.equal(a.uuid, b.uuid);
    assert.equal(a.timestamp, b.timestamp);
    assert.equal(a.timestamp, '2026-10-01T00:00:00.000Z');
    assert.notEqual(a.uuid, reachEvent('reach_npm_downloads', '2026-10-02', 'prismalens', {}).uuid);
    assert.notEqual(a.uuid, reachEvent('reach_npm_downloads', '2026-10-01', '@prismalens/agent-host', {}).uuid);
    assert.match(a.uuid, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('never creates person profiles', () => {
    const e = reachEvent('reach_repo', '2026-10-01', 'x', {});
    assert.equal(e.properties.$process_person_profile, false);
    assert.equal(e.distinct_id, 'prismalens-reach');
  });

  it('turns an npm range into one event per package and day', () => {
    const events = npmEvents({
      package: '@prismalens/agent-host',
      downloads: [{ day: '2026-10-25', downloads: 435 }, { day: '2026-10-26', downloads: 16 }],
    });
    assert.deepEqual(events.map((e) => [e.properties.package, e.properties.day, e.properties.downloads]), [
      ['@prismalens/agent-host', '2026-10-25', 435],
      ['@prismalens/agent-host', '2026-10-26', 16],
    ]);
  });

  it('keys GitHub views and clones by their own day', () => {
    const body = { views: [{ timestamp: '2026-10-30T00:00:00Z', count: 12, uniques: 4 }] };
    const [e] = trafficEvents('views', body);
    assert.equal(e.timestamp, '2026-10-30T00:00:00.000Z');
    assert.deepEqual([e.properties.kind, e.properties.count, e.properties.uniques], ['views', 12, 4]);
    assert.deepEqual(trafficEvents('clones', body), []);
  });

  it('snapshots referrers and paths on the collection day', () => {
    const [r, p] = popularEvents('2026-11-02', [
      { referrer: 'news.ycombinator.com', count: 30, uniques: 20 },
      { path: '/prismalens/prismalens', title: 'x', count: 5, uniques: 3 } as never,
    ]);
    assert.equal(r.event, 'reach_github_referrer');
    assert.equal(r.properties.referrer, 'news.ycombinator.com');
    assert.equal(p.event, 'reach_github_path');
    assert.equal(p.timestamp, '2026-11-02T00:00:00.000Z');
  });

  it('emits one release event per asset and skips drafts', () => {
    const events = releaseEvents('2026-11-02', [
      { tag_name: 'v1', assets: [{ name: 'install.sh', download_count: 7 }, { name: 'a.zip', download_count: 2 }] },
      { tag_name: 'v2', draft: true, assets: [{ name: 'install.sh', download_count: 0 }] },
    ]);
    assert.deepEqual(events.map((e) => `${e.properties.tag}/${e.properties.asset}=${e.properties.total}`), [
      'v1/install.sh=7', 'v1/a.zip=2',
    ]);
  });

  it('reads stars and forks', () => {
    const e = repoEvent('2026-11-02', { stargazers_count: 3, forks_count: 1 });
    assert.deepEqual([e.properties.stars, e.properties.forks], [3, 1]);
  });

  it('reads a Homebrew count with thousands separators, and zero when absent', () => {
    const report = { end_date: '2026-11-02', items: [{ formula: 'prismalens/tap/prismalens', count: '1,204' }] };
    assert.equal(brewEvent('2026-11-02', report).properties.count, 1204);
    assert.equal(brewEvent('2026-11-02', { ...report, items: [] }).properties.count, 0);
  });
});

describe('install-script worker', () => {
  it('classifies user agents by family', () => {
    assert.equal(uaFamily('curl/8.7.1'), 'curl');
    assert.equal(uaFamily('Wget/1.21.4'), 'wget');
    assert.equal(uaFamily('Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.1'), 'powershell');
    assert.equal(uaFamily('Mozilla/5.0 (Windows NT 10.0; Microsoft Windows 10.0.26100; en-US) PowerShell/7.5.0'), 'powershell');
    assert.equal(uaFamily('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'), 'browser');
    assert.equal(uaFamily('Go-http-client/1.1'), 'other');
    assert.equal(uaFamily(null), 'other');
  });

  it('reads the release tag from the GitHub redirect', () => {
    assert.equal(releaseTag('https://github.com/prismalens/prismalens/releases/download/v0.5.3/install.sh'), 'v0.5.3');
    assert.equal(releaseTag(null), 'unknown');
  });

  const env = { ASSETS: { fetch: async () => new Response('asset') } };
  const run = (url: string, fetchImpl: typeof fetch) => {
    const waits: Promise<unknown>[] = [];
    const res = handle(new Request(url, { headers: { 'user-agent': 'curl/8.7.1' } }), env, { waitUntil: (p) => waits.push(p) }, fetchImpl);
    return { res: res as Response, waits };
  };

  it('redirects at once and counts in the background', async () => {
    const calls: { url: string; body?: string }[] = [];
    const fetchImpl = (async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body as string });
      return new Response(null, {
        status: 302,
        headers: { location: 'https://github.com/prismalens/prismalens/releases/download/v0.5.3/install.ps1' },
      });
    }) as typeof fetch;
    const { res, waits } = run('https://prismalens.io/install.ps1', fetchImpl);
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), 'https://github.com/prismalens/prismalens/releases/latest/download/install.ps1');
    await Promise.all(waits);
    const sent = JSON.parse(calls.find((c) => c.url.includes('posthog'))!.body!);
    assert.equal(sent.event, 'install_script_requested');
    assert.deepEqual(
      [sent.properties.script, sent.properties.platform, sent.properties.release, sent.properties.ua_family],
      ['install.ps1', 'windows', 'v0.5.3', 'curl'],
    );
    assert.equal(sent.properties.$process_person_profile, false);
  });

  it('still redirects when PostHog or GitHub is down', async () => {
    const down = (async () => { throw new Error('down'); }) as typeof fetch;
    const { res, waits } = run('https://prismalens.io/install.sh', down);
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), 'https://github.com/prismalens/prismalens/releases/latest/download/install.sh');
    await assert.doesNotReject(Promise.all(waits));
  });

  it('still redirects when waitUntil itself throws', () => {
    const req = new Request('https://prismalens.io/install.sh');
    const res = handle(req, env, { waitUntil: () => { throw new Error('no ctx'); } }, fetch) as Response;
    assert.equal(res.status, 302);
  });

  it('does not count preview hosts, and serves other paths as static assets', async () => {
    const { res, waits } = run('https://abc.prismalens-site.pages.dev/install.sh', fetch);
    assert.equal(res.status, 302);
    assert.equal(waits.length, 0);
    const other = await handle(new Request('https://prismalens.io/'), env, { waitUntil: () => {} });
    assert.equal(await other.text(), 'asset');
  });
});
