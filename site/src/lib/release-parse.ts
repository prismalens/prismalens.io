// Pure parsing of a GitHub release into per-OS desktop downloads. `release.ts` fetches; this file never touches the network.
export type OsId = 'windows' | 'macos' | 'linux'

export type DesktopAsset = {
  os: OsId
  osLabel: string
  arch: string
  name: string
  url: string
  bytes: number
  /** "196 MB": binary megabytes, the unit a file manager shows. */
  size: string
  sha256: string | null
}

export type Release = {
  version: string
  /** "Nov 21, 2026", in UTC so the build host's zone never shifts the day. */
  date: string
  htmlUrl: string
  sumsUrl: string | null
  desktop: Record<OsId, DesktopAsset | null>
}

export type ApiAsset = { name: string; size: number; browser_download_url: string }
export type ApiRelease = { tag_name: string; html_url: string; published_at: string; assets: ApiAsset[] }

const OS_LABELS: Record<OsId, string> = { windows: 'Windows', macos: 'macOS', linux: 'Linux' }
const DESKTOP_NAME = /^PrismaLens-(Windows|macOS|Linux)-([A-Za-z0-9_]+)-unsigned\.zip$/

export function formatSize(bytes: number): string {
  const mb = bytes / 1024 / 1024
  return mb >= 1000 ? `${(mb / 1024).toFixed(1)} GB` : `${Math.round(mb)} MB`
}

export function parseSums(text: string): Map<string, string> {
  const sums = new Map<string, string>()
  for (const line of text.split(/\r?\n/)) {
    const m = /^([0-9a-f]{64})\s+\*?(\S+)\s*$/i.exec(line)
    if (m) sums.set(m[2], m[1].toLowerCase())
  }
  return sums
}

export function buildRelease(api: ApiRelease, sums: Map<string, string>): Release {
  const desktop: Release['desktop'] = { windows: null, macos: null, linux: null }
  for (const a of api.assets) {
    const m = DESKTOP_NAME.exec(a.name)
    if (!m) continue
    const os = m[1].toLowerCase() as OsId
    desktop[os] = {
      os,
      osLabel: OS_LABELS[os],
      arch: m[2].toLowerCase(),
      name: a.name,
      url: a.browser_download_url,
      bytes: a.size,
      size: formatSize(a.size),
      sha256: sums.get(a.name) ?? null,
    }
  }
  const sumsAsset = api.assets.find((a) => a.name === 'SHA256SUMS')
  return {
    version: api.tag_name.replace(/^v/, ''),
    date: new Date(api.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    htmlUrl: api.html_url,
    sumsUrl: sumsAsset?.browser_download_url ?? null,
    desktop,
  }
}
