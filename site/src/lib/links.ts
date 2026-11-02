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
  download?: string
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
  { id: 'desktop', label: 'Desktop app', download: `${releasesUrl}/latest`, preview: true },
]
