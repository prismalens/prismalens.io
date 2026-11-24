import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { buildRelease, formatSize, parseSums } from '../site/src/lib/release-parse'

const winHash = 'af34d42a76c9596d9b8a288f9f561db1b7d296c8c2930593c9adab277e28e26d'
const sums = parseSums(`${winHash}  PrismaLens-Windows-X64-unsigned.zip\nnot a checksum line\n${'b'.repeat(64)} *PrismaLens-Linux-X64-unsigned.zip\n`)
const api = {
  tag_name: 'v0.5.6',
  html_url: 'https://github.com/prismalens/prismalens/releases/tag/v0.5.6',
  published_at: '2026-11-21T23:59:59Z',
  assets: [
    { name: 'PrismaLens-Windows-X64-unsigned.zip', size: 205691281, browser_download_url: 'https://example.test/win.zip' },
    { name: 'PrismaLens-Linux-X64-unsigned.zip', size: 177851715, browser_download_url: 'https://example.test/linux.zip' },
    { name: 'prismalens-0.5.6-win32-x64.zip', size: 88612741, browser_download_url: 'https://example.test/cli.zip' },
    { name: 'SHA256SUMS', size: 1054, browser_download_url: 'https://example.test/SHA256SUMS' },
  ],
}

describe('release parsing', () => {
  it('formats sizes in binary megabytes', () => {
    assert.equal(formatSize(205691281), '196 MB')
    assert.equal(formatSize(2 * 1024 ** 3), '2.0 GB')
  })

  it('reads checksum lines and skips junk, including the binary-mode star', () => {
    assert.equal(sums.size, 2)
    assert.equal(sums.get('PrismaLens-Windows-X64-unsigned.zip'), winHash)
    assert.equal(sums.get('PrismaLens-Linux-X64-unsigned.zip'), 'b'.repeat(64))
  })

  it('picks the desktop asset per OS and ignores the CLI archive', () => {
    const r = buildRelease(api, sums)
    assert.equal(r.version, '0.5.6')
    assert.equal(r.date, 'Nov 21, 2026')
    assert.equal(r.sumsUrl, 'https://example.test/SHA256SUMS')
    assert.deepEqual(r.desktop.windows, {
      os: 'windows', osLabel: 'Windows', arch: 'x64', name: 'PrismaLens-Windows-X64-unsigned.zip',
      url: 'https://example.test/win.zip', bytes: 205691281, size: '196 MB', sha256: winHash,
    })
    assert.equal(r.desktop.linux?.url, 'https://example.test/linux.zip')
    assert.equal(r.desktop.macos, null)
  })

  it('leaves the hash null when SHA256SUMS does not list the asset', () => {
    assert.equal(buildRelease(api, new Map()).desktop.windows?.sha256, null)
  })
})
