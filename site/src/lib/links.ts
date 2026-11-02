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
}

export const installChannels: InstallChannel[] = [
  { id: 'unix', label: 'macOS & Linux', commands: ['curl -fsSL https://prismalens.io/install.sh | sh'], os: 'unix' },
  { id: 'npm', label: 'npm', commands: ['npm install -g prismalens'] },
  { id: 'brew', label: 'Homebrew', commands: ['brew install prismalens/tap/prismalens'] },
  { id: 'windows', label: 'Windows (preview)', commands: ['irm https://prismalens.io/install.ps1 | iex'], os: 'windows' },
  {
    id: 'scoop',
    label: 'Scoop (preview)',
    commands: ['scoop bucket add prismalens https://github.com/prismalens/scoop-bucket', 'scoop install prismalens'],
  },
  { id: 'desktop', label: 'Desktop app (preview)', download: `${releasesUrl}/latest` },
]

export const platforms = ['macOS', 'Linux', 'WSL2', 'Windows (preview)']
