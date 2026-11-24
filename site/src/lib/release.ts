// The one place that reads the latest GitHub release at build time. The site and the docs both
// import it, so a link, size or checksum is never copied by hand. Falls back to the releases page.
import { buildRelease, parseSums, type ApiRelease, type Release } from './release-parse'

export type { DesktopAsset, OsId, Release } from './release-parse'
export const repo = 'prismalens/prismalens'
export const releasesPage = `https://github.com/${repo}/releases`

async function load(): Promise<Release | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'prismalens-site-build' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers, signal: AbortSignal.timeout(15_000) })
    if (!res.ok) throw new Error(`GitHub API answered ${res.status}`)
    const api = (await res.json()) as ApiRelease
    const sumsAsset = api.assets.find((a) => a.name === 'SHA256SUMS')
    let sums = new Map<string, string>()
    if (sumsAsset) {
      const sumsRes = await fetch(sumsAsset.browser_download_url, { signal: AbortSignal.timeout(15_000) })
      if (sumsRes.ok) sums = parseSums(await sumsRes.text())
      else console.warn(`[release] SHA256SUMS answered ${sumsRes.status}; checksums are left out`)
    }
    const release = buildRelease(api, sums)
    console.info(`[release] using ${api.tag_name} from ${repo}`)
    return release
  } catch (err) {
    console.warn(`[release] could not read the latest release (${(err as Error).message}); download links fall back to ${releasesPage}/latest`)
    return null
  }
}

/** The latest release, or null when GitHub was unreachable at build time. Read once per build. */
export const release: Release | null = await load()
export const downloadFallback = `${releasesPage}/latest`
