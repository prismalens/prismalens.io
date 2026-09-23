<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/banner-dark.png">
    <img alt="PrismaLens — your coding agent, investigating your incidents" src="brand/banner-light.png" width="830">
  </picture>
</p>

# PrismaLens Marketing Website & Documentation

This repository contains the marketing website and documentation for **PrismaLens**, an open-source app that investigates incidents with the coding agent you already use.

> This repository hosts the marketing site and documentation, not the application itself.

## What is PrismaLens?

PrismaLens is an open-source (Apache-2.0) app you run on your own machine with `pl up`. When an alert fires, it:

- **Opens an incident from the alert** — Prometheus Alertmanager posts to a webhook, and a critical or high alert on a known service starts an investigation
- **Hands it to your coding agent** — OpenCode, Claude Code, Codex or Gemini CLI investigates a read-only snapshot of the service's code; PrismaLens never calls a model itself
- **Keeps an ordered-evidence report** — hypotheses ranked most to least plausible, each with the evidence behind it, and no numeric confidence scores

## Monorepo Structure

This repository is organized as a pnpm monorepo with two main workspaces:

```
prismalens.io/
├── site/          # Marketing website (Astro)
├── docs/          # Documentation site (Astro Starlight)
├── brand/         # Canonical brand assets (logomark SVGs, banners) — see brand/README.md
├── design-tokens/ # Colours, fonts, radius — synced from the app, never edited here
├── mage/          # Link marker to the org knowledge hub (see AGENTS.md)
└── package.json   # Root workspace configuration
```

### Site (`site/`)

The marketing website built with:
- **Astro** - Modern static site generator
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe development

**Live URL:** https://prismalens.io

### Docs (`docs/`)

The documentation site built with:
- **Astro Starlight** - Documentation framework
- **MDX** - Markdown with components
- **TypeScript** - Type-safe development

**Live URL:** https://docs.prismalens.io

## Local Development

### Prerequisites

- **Node.js** 22+
- **pnpm** 10.26.2 or later

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/prismalens/prismalens.io.git
cd prismalens.io
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Run both sites concurrently** (recommended)

```bash
pnpm dev
```

This starts both development servers:
- **Marketing site:** http://localhost:4321
- **Documentation:** http://localhost:4322

The "Docs" link in the marketing site header will automatically point to your local docs server during development.

### Run Sites Individually

If you prefer to run sites separately:

```bash
# Marketing site only
pnpm dev:site

# Documentation only
pnpm dev:docs
```

### Build for Production

```bash
# Build both sites
pnpm build:site && pnpm build:docs

# Or build individually
pnpm build:site
pnpm build:docs
```

### Design tokens

`site/` and `docs/` share the app's tokens (`packages/frontend/src/styles/` in the
main repo), copied into `design-tokens/` and pinned to a commit named in each file's
header. To pick up token changes from the app:

```bash
pnpm tokens:sync          # latest main
pnpm tokens:sync v0.6.0   # or any tag, branch or SHA
```

Commit the result. Never edit `design-tokens/` by hand; change the tokens in the
app and sync.

## Related Repositories

- **[PrismaLens](https://github.com/prismalens/prismalens)** - The main monorepo: the `prismalens` app (API, dashboard and `pl` command)

## Contributing

We're not set up for external code contributions yet — that opens up a little
later. In the meantime, feedback is very welcome:

- Open an issue for typos, broken links, or unclear docs
- Open an issue to suggest content or site improvements
- Comment on existing issues

Watch the repo if you want to catch the moment PRs open up.

## Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Documentation:** Astro Starlight
- **Deployment:** Cloudflare Pages — see [DEPLOY.md](DEPLOY.md)

## License

Apache-2.0 — see the [LICENSE](https://github.com/prismalens/prismalens/blob/main/LICENSE) file in the main [PrismaLens](https://github.com/prismalens/prismalens) repository.

## Community & Support

- **GitHub Discussions:** [Ask questions and share ideas](https://github.com/prismalens/prismalens.io/discussions)
- **GitHub Issues:** [Report bugs or request features](https://github.com/prismalens/prismalens.io/issues)
- **Star the repo:** Help us grow the community!

---

Built with ❤️ by the PrismaLens team
