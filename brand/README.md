# PrismaLens brand assets

Canonical home of the PrismaLens identity — the **refraction mark**: one mixed beam
enters the prism, ordered bands leave it, fading in rank. That is the product's own
epistemics (an incident in, ordered evidence out) drawn as physics.

## Palette

| Token | Hex | Use |
|---|---|---|
| Ink dark | `#0F172A` | mark/wordmark on light backgrounds |
| Ink light | `#E2E8F0` | mark/wordmark on dark backgrounds |
| Indigo | `#6366F1` | primary accent, "Prisma" in the wordmark |
| Ray indigo | `#4F46E5` on light, `#818CF8` on dark, at 100 / 70 / 50 / 35% opacity | the refracted rays, in order; the favicon's three use 100 / 70 / 45% |
| Found-it green | `#34D399` | terminal "root cause identified" moments only |
| Deep space | `#0F172A` / `#0B1120` | icon chips, dark canvases |

## Files

- `logo.svg` — master mark, theme-aware (`prefers-color-scheme` switches ink)
- `logo-dark.svg` / `logo-light.svg` — fixed-ink variants for known backgrounds
- `favicon.svg` — small-size variant: thicker strokes, 3 rays instead of 4, no internal ray
- `banner-dark.png` / `banner-light.png` — 1600×400 README banners (Space Grotesk lockup + tagline)

## Derived copies (regenerate from here, don't edit in place)

- `site/public/` + `docs/public/`: `favicon.svg`, `favicon.ico` (16+32 PNG-in-ICO), `apple-touch-icon.png` (180, deep-space chip)
- `site/public/og-default.png` — 1200×630 social card (lockup + terminal + tagline)
- Inline header marks in `site/src/components/Header.astro` and `docs/src/components/CustomHeader.astro`
- Main repo: `.github/assets/{logo.svg,banner-dark.png,banner-light.png}` + README `<picture>` banner

## Wordmark

Space Grotesk Bold, tight tracking (−0.02em): <span>Prisma</span> in Indigo,
<span>Lens</span> in ink. Tagline: "Your coding agent, investigating your incidents"
(Inter Medium, muted).

Rasters are rendered from `sheet.html` via headless Chromium (no design-tool
dependency): open it with `?v=og` at 1200×630, `?v=banner-dark` or
`?v=banner-light` at 1600×400, and screenshot the viewport. The mark geometry
lives in the SVGs above — keep them the single source of truth.
