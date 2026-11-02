// Renders the 1200×630 share card into site/public and docs/public with headless Chrome or Edge.
// Run once after the hero copy changes: CHROME_PATH=/path/to/chrome node scripts/og-image.mjs
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const chrome = process.env.CHROME_PATH
if (!chrome) throw new Error('Set CHROME_PATH to a Chrome or Edge binary.')

const url = (p) => pathToFileURL(join(root, p)).href
const font = url('site/node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2')

const html = `<!doctype html>
<html class="dark"><head><meta charset="utf-8">
<link rel="stylesheet" href="${url('design-tokens/tokens.css')}">
<style>
@font-face { font-family: 'Plex'; src: url('${font}') format('woff2'); font-weight: 100 700; }
/* The site's tints from site/src/styles/global.css */
.dark { --bg-deep: oklch(0.115 0.006 285.8); --indigo-soft: color-mix(in oklch, var(--primary) 16%, transparent); }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; background: var(--bg-deep); color: var(--foreground);
  font-family: 'Plex', system-ui, sans-serif; position: relative; isolation: isolate; }
body::before { content: ''; position: absolute; inset: 0; z-index: -2;
  background-image: linear-gradient(oklch(1 0 0 / .04) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / .04) 1px, transparent 1px);
  background-size: 48px 48px; mask-image: radial-gradient(ellipse 80% 70% at 40% 40%, #000 30%, transparent 80%); }
.glow { position: absolute; z-index: -1; width: 900px; height: 600px; left: 380px; top: -160px; filter: blur(90px); opacity: .8;
  background: conic-gradient(from 200deg, transparent 0deg, color-mix(in oklch, var(--primary) 40%, transparent) 60deg,
    color-mix(in oklch, var(--chart-2) 26%, transparent) 110deg, transparent 170deg, color-mix(in oklch, var(--live) 16%, transparent) 250deg, transparent 320deg); }
.wrap { position: absolute; inset: 0; padding: 72px 80px; display: grid; grid-template-columns: 1fr 360px; gap: 56px; align-items: center; }
.brand { display: flex; align-items: center; gap: 14px; font-size: 30px; font-weight: 600; letter-spacing: -.01em; margin-bottom: 44px; }
.brand svg { width: 44px; height: 44px; }
h1 { font-size: 76px; line-height: 1; letter-spacing: -.04em; font-weight: 650; }
.grad { background: linear-gradient(100deg, var(--foreground) 10%, color-mix(in oklch, var(--ring) 55%, white) 45%, color-mix(in oklch, var(--chart-2) 70%, white) 75%);
  -webkit-background-clip: text; background-clip: text; color: transparent; }
p { margin-top: 28px; font-size: 27px; color: var(--muted-foreground); }
.card { border-radius: 18px; border: 1px solid oklch(1 0 0 / .1); padding: 22px; display: flex; flex-direction: column; gap: 12px;
  background: linear-gradient(180deg, oklch(0.19 0.007 285.9), oklch(0.155 0.006 285.9));
  box-shadow: 0 40px 80px -30px oklch(0 0 0 / .8), 0 0 120px -40px color-mix(in oklch, var(--primary) 55%, transparent); }
.row { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 11px; border: 1px solid oklch(1 0 0 / .08); background: oklch(1 0 0 / .025); }
.row.top { border-color: color-mix(in oklch, var(--run-done) 40%, transparent); background: color-mix(in oklch, var(--run-done) 8%, transparent); }
.rank { width: 28px; height: 28px; border-radius: 8px; display: grid; place-items: center; font-weight: 600; font-size: 15px; background: oklch(1 0 0 / .07); }
.top .rank { background: var(--run-done); color: var(--bg-deep); }
.ln { flex: 1; height: 9px; border-radius: 5px; background: oklch(1 0 0 / .16); }
.str { display: flex; gap: 4px; }
.str i { width: 16px; height: 6px; border-radius: 2px; background: oklch(1 0 0 / .1); }
.str i.on { background: var(--ring); }
.top .str i.on { background: var(--run-done); }
</style></head>
<body><div class="glow"></div><div class="wrap"><div>
  <div class="brand"><svg viewBox="0 0 256 256" fill="none"><g stroke="#818cf8" stroke-linecap="round"><circle cx="142" cy="104" r="54" stroke-width="36"/><path d="M88 64V224" stroke-width="36"/><path d="M120 108A24 24 0 0 1 144 82" stroke-width="11"/></g></svg>PrismaLens</div>
  <h1>Your agent,<br><span class="grad">working while you're not.</span></h1>
  <p>Signals in. Your agent digs in. Evidence out.</p>
</div>
<div class="card">
  <div class="row top"><span class="rank">1</span><span class="ln"></span><span class="str"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></span></div>
  <div class="row"><span class="rank">2</span><span class="ln" style="max-width:70%"></span><span class="str"><i class="on"></i><i class="on"></i><i></i><i></i></span></div>
  <div class="row"><span class="rank">3</span><span class="ln" style="max-width:55%"></span><span class="str"><i class="on"></i><i></i><i></i><i></i></span></div>
</div></div></body></html>`

const dir = mkdtempSync(join(tmpdir(), 'og-'))
const page = join(dir, 'og.html')
const out = join(dir, 'og.png')
writeFileSync(page, html)
execFileSync(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=2000',
  `--screenshot=${out}`, pathToFileURL(page).href,
], { stdio: 'ignore' })
for (const target of ['site/public/og-default.png', 'docs/public/og-default.png']) copyFileSync(out, join(root, target))
rmSync(dir, { recursive: true, force: true })
console.log('Wrote site/public/og-default.png and docs/public/og-default.png')
