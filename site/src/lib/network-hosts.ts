// Hosts an install touches, for corporate allowlists. One list, read by docs/install.mdx.
export type NetworkHost = { host: string; why: string }

export const networkHosts: NetworkHost[] = [
  { host: 'prismalens.io', why: 'the bootstrap scripts' },
  { host: 'github.com', why: 'release assets, through a redirect' },
  { host: 'release-assets.githubusercontent.com', why: 'release assets, the redirect target' },
  { host: 'registry.npmjs.org', why: 'the npm install path' },
]
