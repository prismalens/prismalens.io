<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="brand/banner-dark.png">
    <img alt="PrismaLens — AI root-cause investigation, in your terminal" src="brand/banner-light.png" width="830">
  </picture>
</p>

# PrismaLens Marketing Website & Documentation

This repository contains the marketing website and documentation for **PrismaLens**, an open-source AI root-cause investigation CLI.

> **Project Status:** PrismaLens is currently in active development. This repository hosts the marketing site and documentation—not the application itself.

## What is PrismaLens?

PrismaLens is an open-source (Apache-2.0), local-first CLI. Point it at a repo, pipe in a firing alert, and it:

- **Investigates the way an on-call engineer would** — a coding agent it drives locally gathers evidence with read-only commands through your existing tooling and auth context
- **Returns an ordered-evidence report** — hypotheses ranked most to least plausible, each linked to the evidence behind it, no numeric confidence scores
- **Uses your own model key** — any OpenAI-compatible provider or Claude Code; no PrismaLens account, no subscription

## Monorepo Structure

This repository is organized as a pnpm monorepo with two main workspaces:

```
prismalens.io/
├── site/          # Marketing website (Astro)
├── docs/          # Documentation site (Astro Starlight)
├── brand/         # Canonical brand assets (logomark SVGs, banners) — see brand/README.md
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

## Related Repositories

- **[PrismaLens](https://github.com/prismalens/prismalens)** - The main monorepo: the `prismalens` CLI, investigation engine, and the in-development server app

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
