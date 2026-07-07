# Deploy — Cloudflare Pages

Both static sites are hosted on **Cloudflare Pages** (git-integrated: Cloudflare
builds on every push to `main` and gives preview builds on PRs). No VPS, no
secrets in this repo. `.nvmrc` pins Node 22 for the Pages build.

> The self-hosted server (`app.prismalens.io`) is not part of this repo or this
> hosting setup. When it ships it gets its own VPS — see the org `VPS_SETUP.md`.
> The old `deploy-*.yml` VPS-rsync workflows were removed in favor of Pages.

## Two Pages projects, one repo

Create two projects in the Cloudflare dashboard, both connected to the
`prismalens/prismalens.io` repo, production branch `main`:

| Project | Build command | Build output dir | Root dir |
|---|---|---|---|
| `prismalens-site` | `pnpm --filter site build` | `site/dist` | `/` (repo root) |
| `prismalens-docs` | `pnpm --filter docs build` | `docs/dist` | `/` (repo root) |

- **Framework preset:** None (the build command above is explicit).
- Cloudflare auto-runs `pnpm install` from the repo root (it reads
  `packageManager: pnpm@10.x` + the lockfile). Root **must** be the repo root so
  the pnpm workspace resolves — do not set it to `site/` or `docs/`.
- If a build ever skips install, set the build command to
  `pnpm install --frozen-lockfile && pnpm --filter <app> build`.

## Custom domains (DNS is automatic — no A/AAAA)

Add these under each project's **Custom domains** tab. Cloudflare creates the
DNS records itself (a flattened CNAME to `<project>.pages.dev`); you never enter
a server IP.

- `prismalens-site` → `prismalens.io` (apex) and `www.prismalens.io`
- `prismalens-docs` → `docs.prismalens.io`

SSL is provisioned automatically. The site→docs link uses
`https://docs.prismalens.io` in production (see `site/src/pages/index.astro`).
