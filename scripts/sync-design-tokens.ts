#!/usr/bin/env node
// Copies the app's design tokens from prismalens/prismalens into design-tokens/, pinned to a commit.
// Usage: pnpm tokens:sync [ref]   (ref: tag, branch or SHA; default main)
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'prismalens/prismalens'
const SOURCE_DIR = 'packages/frontend/src/styles'
const FILES = ['tokens.css', 'tailwind-preset.css']
const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../design-tokens')

async function get(url: string, accept?: string): Promise<string> {
  const res = await fetch(url, { headers: accept ? { Accept: accept } : {} })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  return res.text()
}

async function main() {
  const ref = process.argv[2] ?? 'main'
  const sha = (await get(`https://api.github.com/repos/${REPO}/commits/${ref}`, 'application/vnd.github.sha')).trim()

  for (const file of FILES) {
    const source = `${SOURCE_DIR}/${file}`
    const body = await get(`https://raw.githubusercontent.com/${REPO}/${sha}/${source}`)
    const header = `/* Synced from ${REPO}@${sha}:${source} by \`pnpm tokens:sync\`. Do not edit. */\n\n`
    await fs.writeFile(path.join(OUT_DIR, file), header + body)
  }

  console.log(`design-tokens/ synced to ${REPO}@${sha} (${ref})`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
