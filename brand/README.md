# PrismaLens brand assets

Canonical home of the PrismaLens identity — the **p-lens glint mark**: a lowercase p
whose bowl is a lens ring with one curved highlight, the way glass catches light.
Below 24 px it is the plain p: no glint, heavier strokes (prismalens/prismalens#745).

Geometry, on a 256 box: ring centre (142, 104), r 54, stroke 36 (46 below 24 px); stem
x 88 from y 64 to 224, round caps; glint `M120 108A24 24 0 0 1 144 82`, stroke 11.

## Palette

| Token | Hex | Use |
|---|---|---|
| Ink dark | `#0F172A` | wordmark on light backgrounds |
| Ink light | `#E2E8F0` | wordmark on dark backgrounds |
| Indigo | `#6366F1` | primary accent, "Prisma" in the wordmark |
| Mark indigo | `#4F46E5` on light, `#818CF8` on dark | the mark |
| Tile | `#6366F1` → `#4F46E5` → `#4338CA`, top to bottom | app icon / favicon tile, white mark |
| Found-it green | `#34D399` | terminal "root cause identified" moments only |
| Deep space | `#0F172A` / `#0B1120` | icon chips, dark canvases |

## Files

- `logo.svg` — master mark, theme-aware (`prefers-color-scheme` switches the indigo)
- `logo-dark.svg` / `logo-light.svg` — fixed-colour variants for known backgrounds
- `favicon.svg` — the 16 px tile: indigo gradient, white plain p, no glint
- `banner-dark.png` / `banner-light.png` — 1600×400 README banners (Space Grotesk lockup + tagline)

## Derived copies (regenerate from here, don't edit in place)

- `site/public/` + `docs/public/`: `favicon.svg`, `favicon.ico` (16+32+48 PNG-in-ICO: the plain p at 16, the glint at 32 and 48), `apple-touch-icon.png` (180, the tile full-bleed; iOS rounds the corners)
- `site/public/og-default.png` — 1200×630 social card (lockup + terminal + tagline)
- Inline marks in `site/src/components/Mark.astro` (plain p below 24 px) and `docs/src/components/CustomHeader.astro`
- Main repo: `.github/assets/{logo.svg,banner-dark.png,banner-light.png}` + README `<picture>` banner

## Wordmark

Space Grotesk Bold, tight tracking (−0.02em): <span>Prisma</span> in Indigo,
<span>Lens</span> in ink. Tagline: "Your coding agent, investigating your incidents"
(Inter Medium, muted).

Rasters are rendered from `sheet.html` via headless Chromium (no design-tool
dependency): open it with `?v=og` at 1200×630, `?v=banner-dark` or
`?v=banner-light` at 1600×400, and screenshot the viewport. The mark geometry
lives in the SVGs above — keep them the single source of truth.
