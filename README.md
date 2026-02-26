# PrismaLens Marketing Website & Documentation

This repository contains the marketing website and documentation for **PrismaLens**, an AI-powered incident investigation platform.

> **Project Status:** PrismaLens is currently in active development. This repository hosts the marketing site and documentation—not the application itself.

## What is PrismaLens?

PrismaLens is an open-source incident investigation platform that uses AI agents to automatically:

- **Investigate production incidents** using LangGraph-powered agents
- **Correlate signals** across metrics, logs, and traces from multiple observability platforms
- **Surface root causes** automatically, reducing mean time to resolution (MTTR)
- **Map service dependencies** to understand blast radius instantly
- **Self-host with Docker Compose** for full data control and no vendor lock-in

## Monorepo Structure

This repository is organized as a pnpm monorepo with two main workspaces:

```
prismalens.io/
├── site/          # Marketing website (Astro)
├── docs/          # Documentation site (Astro Starlight)
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

- **Node.js** 18+ or 20+
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

- **[PrismaLens Core](https://github.com/prismalens/prismalens)** - Main application repository (coming soon)
- **[PrismaLens Integrations](https://github.com/prismalens/integrations)** - Observability integrations (coming soon)

## Contributing

We welcome contributions! Whether it's:

- Fixing typos in documentation
- Improving the marketing site design
- Adding new documentation pages
- Suggesting features

Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Submit a pull request

For major changes, please open an issue first to discuss what you'd like to change.

## Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Package Manager:** pnpm
- **Documentation:** Astro Starlight
- **Deployment:** Vercel (planned)

## License

MIT License - see LICENSE file for details

## Community & Support

- **GitHub Discussions:** [Ask questions and share ideas](https://github.com/prismalens/prismalens.io/discussions)
- **GitHub Issues:** [Report bugs or request features](https://github.com/prismalens/prismalens.io/issues)
- **Star the repo:** Help us grow the community!

---

Built with ❤️ by the PrismaLens team
