# Reach beyond the websites

PrismaLens reach outside prismalens.io and docs.prismalens.io, counted in the
same PostHog project (Cloud EU). Two parts:

- `scripts/reach/collect.mts`, run daily by `.github/workflows/reach.yml`, sends
  aggregate counts. Every event uses the fixed `distinct_id` `prismalens-reach`
  and `$process_person_profile: false`, so no person profiles are created.
- `site/public/_worker.js` (a Pages advanced-mode worker, limited to two paths by
  `site/public/_routes.json`) counts requests for the install scripts, then
  redirects to the latest release as `_redirects` did.

Dashboards (PostHog project 284081):

- [Reach and acquisition](https://eu.posthog.com/project/284081/dashboard/1076086):
  both sites by traffic source, AI-assistant referrals, use-case pages, the
  landing-to-install funnel, install scripts, npm, GitHub, releases, Homebrew.
- [Product: installs and investigations](https://eu.posthog.com/project/284081/dashboard/974563):
  activation, weekly retention, new vs returning installs and outcomes from
  opt-in telemetry, release builds only. Release annotations mark each version.

Notifications (Slack workspace "Prismalens"):

| Channel | Gets | From |
| --- | --- | --- |
| `#alerts-prismalens` | An insight alert firing (completed-run rate below 50%); a new website error | PostHog internal destinations |
| `#feed-prismalens` | A new release install (`setup_completed`); an install's first alert (`first_webhook_received`); the Monday reach summary | PostHog destinations and a dashboard subscription |
| email | A failed production deploy of `prismalens-site` or `prismalens-docs` | Cloudflare notification |

The install destinations use the project's test-account filter, so dev builds, pre-0.5.0 versions and `internal-` installs never post. Mention `@PostHog` in either channel to ask about the data.

## What is collected

| Event | Properties | Source | Window | Needs |
| --- | --- | --- | --- | --- |
| `reach_npm_downloads` | `package`, `day`, `downloads` | `api.npmjs.org/downloads/range/last-month/<pkg>` | per day, last 30 available days | nothing |
| `reach_release_downloads` | `tag`, `asset`, `total` | GitHub `GET /repos/prismalens/prismalens/releases` | running total, snapshot per day | nothing |
| `reach_repo` | `stars`, `forks` | GitHub `GET /repos/prismalens/prismalens` | snapshot per day | nothing |
| `reach_homebrew_installs` | `formula`, `count`, `window`, `report_end` | `formulae.brew.sh/api/analytics/install/30d.json` | rolling 30 days, snapshot per day | nothing |
| `reach_github_traffic` | `kind` (`views`, `clones`), `day`, `count`, `uniques` | GitHub `traffic/views`, `traffic/clones` (`per=day`) | per day, last 14 days | `REACH_GITHUB_TOKEN` |
| `reach_github_referrer` | `referrer`, `count`, `uniques`, `window` | GitHub `traffic/popular/referrers` (top 10) | rolling 14 days, snapshot per day | `REACH_GITHUB_TOKEN` |
| `reach_github_path` | `path`, `count`, `uniques`, `window` | GitHub `traffic/popular/paths` (top 10) | rolling 14 days, snapshot per day | `REACH_GITHUB_TOKEN` |
| `install_script_requested` | `script`, `platform`, `release`, `ua_family` | the worker on `/install.sh` and `/install.ps1` | one per request | nothing |

**Re-runs don't double count.** Each collector event's `uuid` is a UUIDv5 of
(event, day, key) and its `timestamp` is that day at 00:00 UTC. PostHog treats
events with the same `uuid`, `event`, `timestamp` and `distinct_id` as one, and
the later one replaces the earlier, so a re-run upserts. Merging is eventual, so
a duplicate can show for a while. Snapshot events (totals, referrers) use the
run day; the last run of a day wins.

**The worker never delays or breaks the redirect.** It answers the 302 first and
sends the event in `waitUntil`; any error is dropped. It counts only on
`prismalens.io` and `www.prismalens.io`, not on preview deployments. The event
holds no IP address, cookie or identifier: the request to PostHog comes from
Cloudflare, uses the fixed `distinct_id` `install-script`, and sets
`$geoip_disable`. `release` is read from GitHub's redirect for `latest`.

## Operator steps

### 1. Add the `REACH_GITHUB_TOKEN` secret

GitHub only shows traffic to tokens with write access to the repository, and
this workflow runs in `prismalens/prismalens.io`, so its own `GITHUB_TOKEN`
can't read it.

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. **Resource owner:** `prismalens`. **Expiration:** your choice (put a renewal
   reminder in the calendar).
3. **Repository access:** Only select repositories → `prismalens/prismalens`.
4. **Repository permissions → Administration: Read-only.** That is the only
   permission the four traffic endpoints need (Metadata: Read-only is added
   automatically). Nothing else.
5. If the organization requires approval for fine-grained tokens, approve it
   under **prismalens → Settings → Personal access tokens → Pending requests**.
6. In `prismalens/prismalens.io` → **Settings → Secrets and variables → Actions
   → New repository secret**: name `REACH_GITHUB_TOKEN`, value the token.
7. **Actions → reach → Run workflow**, once with **dry run** ticked; the log
   should show `traffic: N events`, not `skipped`. Then run it without.

Without the secret the job still sends npm, release, repo and Homebrew counts
and logs `traffic: skipped, REACH_GITHUB_TOKEN is not set`.

GitHub keeps traffic for 14 days, so data from before the first run is lost
beyond that window; npm gives the last 30 days on the first run.

### 2. PostHog dashboard

Create a dashboard **Reach** next to the existing web analytics. Insights:

| Insight | Type | Series | Breakdown | Interval |
| --- | --- | --- | --- | --- |
| Weekly npm downloads | Trends | `reach_npm_downloads`, property sum of `downloads` | `package` | week |
| GitHub views and clones | Trends | `reach_github_traffic`, sum of `count` (and of `uniques`) | `kind` | day |
| Top GitHub referrers | Table (SQL below) | latest `reach_github_referrer` | `referrer` | — |
| Release downloads | Table (SQL below) | latest `reach_release_downloads` | `tag`, `asset` | — |
| Install-script requests by OS | Trends | `install_script_requested`, total count | `platform` (then `ua_family`) | week |
| Homebrew installs (30 days) | Trends | `reach_homebrew_installs`, max of `count` | — | day |
| Stars and forks | Trends | `reach_repo`, max of `stars`, max of `forks` | — | day |

Snapshot events must be read as "latest per key", not summed:

```sql
-- Top referrers, last 14 days, from the newest snapshot
SELECT properties.referrer AS referrer, properties.count AS views, properties.uniques AS uniques
FROM events
WHERE event = 'reach_github_referrer'
  AND properties.day = (SELECT max(properties.day) FROM events WHERE event = 'reach_github_referrer')
ORDER BY views DESC

-- Release downloads per asset, newest snapshot
SELECT properties.tag AS tag, properties.asset AS asset, argMax(properties.total, timestamp) AS downloads
FROM events
WHERE event = 'reach_release_downloads'
GROUP BY tag, asset
ORDER BY downloads DESC
```

## Blind spots

| Channel | What we can see | Why not more |
| --- | --- | --- |
| npm page views | Nothing | npm offers only download counts (`api.npmjs.org/downloads`); there is no page-view or referrer API. |
| npm downloads | Counts per package and day, CI and mirrors included | npm counts tarball fetches, not people or installs. |
| Homebrew tap | Installs from users who left Homebrew analytics on, rolling 30 days | Opt-out analytics; the public report has no daily series. Bottle downloads also land in release-asset counts. |
| Scoop bucket | Nothing direct | Scoop has no analytics. Its downloads land in the `win32-x64.zip` release-asset count, mixed with direct downloads. |
| Release assets | Running totals per asset | GitHub gives no daily series or referrer; the daily change comes from consecutive snapshots. |
| GitHub traffic | 14 days, top 10 referrers and paths | GitHub keeps no more; a missed run past 14 days loses those days. |
| Install scripts | Requests to prismalens.io | Direct downloads of `install.sh` from GitHub skip the worker (they show in release-asset counts). If the daily Workers request quota runs out, Pages may skip the worker and fall back to `_redirects`, uncounted. |
