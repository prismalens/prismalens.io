// Pure parts of the reach collector: API payloads in, PostHog events out. design/REACH.md
import { v5 as uuidv5 } from 'uuid';

export const NPM_PACKAGES = ['prismalens', '@prismalens/agent-adapters', '@prismalens/agent-host'];
export const REPO = 'prismalens/prismalens';
export const BREW_FORMULA = 'prismalens/tap/prismalens';
export const DISTINCT_ID = 'prismalens-reach';
const NAMESPACE = 'b3f1c0de-6d1a-4c55-9a5e-2f7f3c1a9e10';

export type ReachEvent = {
  event: string;
  distinct_id: string;
  uuid: string;
  timestamp: string;
  properties: Record<string, string | number | boolean>;
};

// PostHog merges events sharing uuid, event, timestamp and distinct_id, so a
// re-run upserts. Both id and timestamp must derive from the (source, day) key.
export function reachEvent(
  event: string,
  day: string,
  key: string,
  props: Record<string, string | number>,
): ReachEvent {
  return {
    event,
    distinct_id: DISTINCT_ID,
    uuid: uuidv5(`${event}|${day}|${key}`, NAMESPACE),
    timestamp: `${day}T00:00:00.000Z`,
    properties: { ...props, day, $process_person_profile: false, $geoip_disable: true },
  };
}

export const utcDay = (d: Date) => d.toISOString().slice(0, 10);

type NpmRange = { package: string; downloads: { day: string; downloads: number }[] };
export function npmEvents(range: NpmRange): ReachEvent[] {
  return range.downloads.map(({ day, downloads }) =>
    reachEvent('reach_npm_downloads', day, range.package, { package: range.package, downloads }),
  );
}

type Traffic = { [k in 'views' | 'clones']?: { timestamp: string; count: number; uniques: number }[] };
export function trafficEvents(kind: 'views' | 'clones', body: Traffic): ReachEvent[] {
  return (body[kind] ?? []).map(({ timestamp, count, uniques }) => {
    const day = timestamp.slice(0, 10);
    return reachEvent('reach_github_traffic', day, kind, { kind, count, uniques });
  });
}

type Popular = { count: number; uniques: number } & ({ referrer: string } | { path: string });
export function popularEvents(today: string, rows: Popular[]): ReachEvent[] {
  return rows.map((row) =>
    'referrer' in row
      ? reachEvent('reach_github_referrer', today, row.referrer, {
          referrer: row.referrer, count: row.count, uniques: row.uniques, window: '14d',
        })
      : reachEvent('reach_github_path', today, row.path, {
          path: row.path, count: row.count, uniques: row.uniques, window: '14d',
        }),
  );
}

type Release = { tag_name: string; draft?: boolean; assets: { name: string; download_count: number }[] };
export function releaseEvents(today: string, releases: Release[]): ReachEvent[] {
  return releases
    .filter((r) => !r.draft)
    .flatMap((r) =>
      r.assets.map((a) =>
        reachEvent('reach_release_downloads', today, `${r.tag_name}/${a.name}`, {
          tag: r.tag_name, asset: a.name, total: a.download_count,
        }),
      ),
    );
}

export function repoEvent(today: string, repo: { stargazers_count: number; forks_count: number }) {
  return reachEvent('reach_repo', today, REPO, { stars: repo.stargazers_count, forks: repo.forks_count });
}

// Homebrew's public report lists every formula with at least one opted-in
// install; a missing formula means none in the window.
type BrewReport = { end_date: string; items: { formula: string; count: string }[] };
export function brewEvent(today: string, report: BrewReport, formula = BREW_FORMULA) {
  const row = report.items.find((i) => i.formula === formula);
  const count = row ? Number(row.count.replace(/,/g, '')) : 0;
  return reachEvent('reach_homebrew_installs', today, formula, {
    formula, count, window: '30d', report_end: report.end_date,
  });
}
