# PrismaLens Documentation

The documentation site for PrismaLens, built with Astro Starlight.

## Tech Stack

- **Framework:** Astro 5.x with Starlight
- **Content:** MDX (Markdown + JSX components)
- **Language:** TypeScript
- **Documentation Framework:** Astro Starlight

## Project Structure

```
docs/
├── public/               # Static assets (images, favicons, etc.)
├── src/
│   ├── assets/           # Images and media files
│   ├── content/
│   │   ├── docs/         # Documentation pages (MDX)
│   │   │   ├── getting-started/
│   │   │   ├── guides/
│   │   │   ├── integrations/
│   │   │   └── api/
│   │   └── config.ts     # Content collections config
│   └── env.d.ts
├── astro.config.mjs      # Astro & Starlight configuration
└── tsconfig.json
```

## Development

### Run from Repository Root

It's recommended to run the development server from the **repository root** to leverage the concurrent setup:

```bash
# From /prismalens.io/
pnpm dev
```

This runs both the marketing site (localhost:4321) and docs (localhost:4322) concurrently.

### Run Docs Only

To run just the documentation site:

```bash
# From repository root
pnpm dev:docs

# Or from this directory
pnpm dev
```

The docs will be available at http://localhost:4322 (configured in `astro.config.mjs`).

### Build for Production

```bash
# From repository root
pnpm build:docs

# Or from this directory
pnpm build
```

The build output will be in `dist/`.

## Adding Documentation

### Create a New Page

Add a new `.md` or `.mdx` file in `src/content/docs/`:

```markdown
---
title: Your Page Title
description: A brief description of the page
---

# Your Page Title

Your content here...
```

### File-Based Routing

- `src/content/docs/example.md` → `/example`
- `src/content/docs/guides/setup.md` → `/guides/setup`
- `src/content/docs/index.md` → `/`

### Organize Documentation

Group related pages in subdirectories:

```
src/content/docs/
├── getting-started/
│   ├── installation.md
│   ├── quick-start.md
│   └── onboarding.md
├── guides/
│   ├── command-center.md
│   ├── incidents.md
│   └── investigations.md
└── integrations/
    ├── prometheus.md
    ├── grafana.md
    └── datadog.md
```

### Update Navigation Sidebar

Edit the sidebar in `astro.config.mjs`:

```javascript
sidebar: [
  {
    label: 'Section Name',
    items: [
      { label: 'Page Title', slug: 'path/to/page' },
      // ...
    ],
  },
]
```

## Writing Guidelines

### Frontmatter

All documentation pages should include frontmatter:

```yaml
---
title: Page Title (required)
description: Brief description for SEO and previews (recommended)
---
```

### Headings

Use semantic heading levels:

```markdown
# Page Title (H1 - only one per page)

## Section (H2)

### Subsection (H3)

#### Detail (H4)
```

### Code Blocks

Use syntax highlighting:

````markdown
```typescript
const example: string = "Hello, PrismaLens!";
```
````

### Callouts

Starlight provides built-in callouts:

```markdown
:::note
This is a note callout.
:::

:::tip
This is a tip callout.
:::

:::caution
This is a caution callout.
:::

:::danger
This is a danger callout.
:::
```

### Internal Links

Link to other documentation pages:

```markdown
[Installation Guide](/getting-started/installation)
[Prometheus Integration](/integrations/prometheus)
```

### Images

Add images to `src/assets/` and reference them:

```markdown
![Alt text](../../assets/screenshot.png)
```

## Configuration

### Site Configuration

Edit `astro.config.mjs` to configure:

- Site URL
- Title and social links
- Sidebar navigation
- Edit link base URL
- Dev server port (4322)

### Content Collections

Content validation is configured in `src/content/config.ts`.

## Commands

| Command | Action |
|---------|--------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server at localhost:4322 |
| `pnpm build` | Build for production to `./dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro check` | Run type checking |

## Deployment

The documentation is deployed to Vercel (planned) and available at https://docs.prismalens.io

## Learn More

- [Starlight Documentation](https://starlight.astro.build)
- [Astro Documentation](https://docs.astro.build)
- [MDX Documentation](https://mdxjs.com)
- [PrismaLens Marketing Site](https://prismalens.io)
