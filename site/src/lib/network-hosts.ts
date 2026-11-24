// Hosts an install touches, for corporate allowlists. One list, read by docs/install.mdx.
export type NetworkHost = { host: string; why: string }

export const networkHosts: NetworkHost[] = [
  { host: 'prismalens.io', why: 'the bootstrap scripts' },
  { host: 'downloads.prismalens.io', why: 'release archives, the default mirror' },
  { host: 'api.github.com', why: 'the latest-version lookup and the daily update check' },
  { host: 'github.com', why: 'release archives when the mirror is unreachable' },
  { host: 'release-assets.githubusercontent.com', why: 'release archives when the mirror is unreachable, via redirect' },
  { host: 'registry.npmjs.org', why: 'the npm install path only' },
  { host: 'docs.prismalens.io', why: 'these docs only' },
]
