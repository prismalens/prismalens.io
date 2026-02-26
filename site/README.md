# PrismaLens Marketing Site

The marketing website for PrismaLens, built with Astro.

## Tech Stack

- **Framework:** Astro 5.x
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **UI Components:** Custom components in `src/components/`

## Project Structure

```
site/
├── public/               # Static assets (images, fonts, etc.)
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.astro  # Site header with navigation
│   │   ├── Hero.astro    # Hero section component
│   │   ├── FeatureGrid.astro
│   │   └── CTA.astro     # Call-to-action component
│   ├── content/          # Content collections
│   │   └── blog/         # Blog posts (MDX)
│   ├── layouts/          # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/            # File-based routing
│   │   ├── index.astro   # Homepage
│   │   ├── features.astro
│   │   ├── pricing.astro
│   │   ├── about.astro
│   │   └── blog/         # Blog index and posts
│   └── styles/           # Global styles
└── astro.config.mjs      # Astro configuration
```

## Development

### Run from Repository Root

It's recommended to run the development server from the **repository root** to leverage the concurrent setup:

```bash
# From /prismalens.io/
pnpm dev
```

This runs both the marketing site (localhost:4321) and docs (localhost:4322) concurrently.

### Run Site Only

To run just the marketing site:

```bash
# From repository root
pnpm dev:site

# Or from this directory
pnpm dev
```

The site will be available at http://localhost:4321

### Build for Production

```bash
# From repository root
pnpm build:site

# Or from this directory
pnpm build
```

The build output will be in `dist/`.

## Adding Content

### Blog Posts

Create a new `.mdx` file in `src/content/blog/`:

```mdx
---
title: "Your Post Title"
description: "A short description"
pubDate: 2026-02-06
author: "Your Name"
---

Your content here...
```

### Pages

Add new `.astro` files in `src/pages/`. File-based routing means:

- `src/pages/example.astro` → `/example`
- `src/pages/features/ai.astro` → `/features/ai`

### Components

Create reusable components in `src/components/`:

```astro
---
interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="component">
  <h2>{title}</h2>
</div>
```

## Styling

This project uses **Tailwind CSS** for styling. Use utility classes directly in components:

```astro
<div class="mx-auto max-w-7xl px-4 py-8">
  <h1 class="text-4xl font-bold text-white">Hello</h1>
</div>
```

Tailwind configuration is in `tailwind.config.mjs`.

## Environment-Aware Features

The "Docs" navigation link is environment-aware:
- **Development:** Points to http://localhost:4322
- **Production:** Points to https://docs.prismalens.io

This is controlled by `import.meta.env.DEV` in `Header.astro`.

## Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at localhost:4321 |
| `pnpm build` | Build for production to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro check` | Run type checking |

## Deployment

The site is deployed to Vercel (planned) and available at https://prismalens.io

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PrismaLens Documentation](https://docs.prismalens.io)
