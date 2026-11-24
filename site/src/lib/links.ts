import { release, type DesktopAsset, type OsId } from './release'

export const docsBase = import.meta.env.DEV ? 'http://localhost:4322' : 'https://docs.prismalens.io'
export const githubUrl = 'https://github.com/prismalens/prismalens'
export const releasesUrl = `${githubUrl}/releases`
export const quickstartUrl = `${docsBase}/quickstart/`
export const trustUrl = `${docsBase}/trust/`

export type InstallChannel = {
  id: string
  label: string
  /** Copied exactly from docs/src/content/docs/install.mdx, the source of truth. */
  commands?: string[]
  os?: 'unix' | 'windows'
  /** Primary channels are always visible; the rest sit in the quieter "Also" row. */
  primary?: boolean
  preview?: boolean
}

export const installChannels: InstallChannel[] = [
  { id: 'unix', label: 'macOS & Linux', commands: ['curl -fsSL https://prismalens.io/install.sh | sh'], os: 'unix', primary: true },
  { id: 'windows', label: 'Windows', commands: ['irm https://prismalens.io/install.ps1 | iex'], os: 'windows', primary: true, preview: true },
  { id: 'npm', label: 'npm', commands: ['npm install -g prismalens'], primary: true },
  { id: 'brew', label: 'Homebrew', commands: ['brew install prismalens/tap/prismalens'] },
  {
    id: 'scoop',
    label: 'Scoop',
    commands: ['scoop bucket add prismalens https://github.com/prismalens/scoop-bucket', 'scoop install prismalens'],
    preview: true,
  },
]

export const verifyUrl = `${docsBase}/install/#verify-the-download`

/** Direct desktop downloads in the order the picker offers them; empty when the release was unreachable at build time. */
export const desktopDownloads: DesktopAsset[] = (['windows', 'macos', 'linux'] as OsId[]).flatMap((os) => release?.desktop[os] ?? [])
export const releaseDate = release?.date ?? null
export const cliWindowsSize = release?.cliWindowsSize ?? null
export const releaseVersion = release?.version ?? null
