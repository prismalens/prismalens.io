# PrismaLens Marketing Site

The marketing site at https://prismalens.io, built with Astro and Tailwind CSS.

## Pages

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` (`/features` redirects here) |
| `/about` | `src/pages/about.astro` |

`src/unreleased-pages/` holds pages kept for later. Astro does not route them.

Copy states what the latest release does, checked against docs.prismalens.io. The report
screenshot in `public/screenshots/` is a real run on that release; replace it when the report
page changes.

## Development

From the repository root, `pnpm dev` runs this site on http://localhost:4321 and the docs on
http://localhost:4322. `pnpm dev:site` runs this site alone, and `pnpm build:site` builds it
to `site/dist/`.

Deployment is Cloudflare Pages; see [DEPLOY.md](../DEPLOY.md).
