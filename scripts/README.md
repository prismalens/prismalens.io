# Environment Documentation Generator

Automatically generates comprehensive environment variable documentation from PrismaLens Zod schemas.

## Overview

This system implements "living documentation" that stays in sync with the source code automatically. Environment variable documentation is generated from the Zod schemas in the main `@prismalens/config` package.

### Key Features

- **Automatic Discovery**: Dynamically discovers all schema files - no manual updates needed when schemas are added/removed
- **Full Extraction**: Extracts variable names, types, defaults, descriptions, and enum values
- **Rich Templates**: Generates comprehensive MDX pages with examples, context, and related links
- **CI/CD Integration**: Automatically syncs docs when schemas change in the main repository
- **Docker Secrets Support**: Documents `_FILE` suffix pattern for all variables

## Architecture

```
┌─────────────────────────────────────┐
│  Main Repo (prismalens)             │
│  packages/@prismalens/config/       │
│    src/schemas/                     │
│      ├── global.ts                  │
│      ├── database.ts                │
│      └── ...                        │
└──────────────┬──────────────────────┘
               │
               │ GitHub Actions (on schema change)
               │
               ▼
┌─────────────────────────────────────┐
│  Docs Repo (prismalens.io)          │
│  scripts/generate-env-docs.ts       │
│      │                               │
│      ├─ utils/schema-parser.ts      │
│      └─ templates/config-page.ts    │
│                                      │
│  Output: docs/src/content/docs/     │
│           reference/config-*.mdx    │
└─────────────────────────────────────┘
```

## Usage

### Local Development

```bash
# Generate documentation once
pnpm docs:generate

# Watch mode - regenerate on schema changes
pnpm docs:generate:watch

# Specify custom repo path
PRISMALENS_REPO_PATH=/path/to/prismalens pnpm docs:generate
```

### Environment Variables

- `PRISMALENS_REPO_PATH`: Path to the main PrismaLens repository (default: `../prismalens`)

## Generated Files

The generator creates one MDX file per schema:

- `config-global.mdx` - Global server configuration (11 variables)
- `config-database.mdx` - Database settings (15 variables)
- `config-logging.mdx` - Logging configuration (12 variables)
- `config-llm.mdx` - LLM provider settings (8 variables)
- `config-langsmith.mdx` - LangSmith tracing (4 variables)
- `config-skills.mdx` - Skills & MCP paths (10 variables)
- `config-mcp.mdx` - MCP server config (11 variables)
- `config-queue.mdx` - Redis/queue settings (8 variables)
- `config-deployment.mdx` - Deployment config (12 variables)

**Total: 91 environment variables across 9 categories**

## How It Works

### 1. Schema Discovery

The generator automatically discovers all schema files:

```typescript
const schemaFiles = await fs.readdir(CONFIG_PATH)
const schemaNames = schemaFiles
  .filter(file => file.endsWith('.ts') && file !== 'index.ts')
  .map(file => file.replace('.ts', ''))
```

### 2. Variable Extraction

For each schema file, the parser:

1. Finds all `z.object({...})` definitions
2. Extracts variable names using pattern: `\n\s*(\w+):\s*z[.\s]`
3. Parses Zod method chains:
   - `.describe()` → Description
   - `.default()` → Default value
   - `.optional()` → Required status
   - `.enum()` → Enum values

### 3. MDX Generation

Each variable becomes a table row with:
- Variable name
- Type (string, number, boolean, enum)
- Required status
- Default value
- Full description

The generated MDX includes:
- Auto-generation notice with timestamp and source link
- Overview section with category-specific context
- Environment variable reference table
- Docker secrets documentation
- Example `.env` configuration
- Related configuration links

## CI/CD Automation

### Workflow: Main Repo → Docs Repo

1. **Trigger**: Push to `main` branch changes files in `packages/@prismalens/config/src/schemas/**`
2. **Checkout**: Both prismalens and prismalens.io repositories
3. **Generate**: Run `pnpm docs:generate` in docs repo
4. **Commit**: Push updated MDX files to docs repo
5. **Deploy**: Trigger docs deployment via repository dispatch

### Required Secrets

Add to main repository (prismalens):
- `DOCS_REPO_PAT`: GitHub Personal Access Token with `repo` scope

### Testing the Workflow

```bash
# Manually trigger sync from main repo
gh workflow run sync-config-docs.yml

# Check workflow status
gh run list --workflow=sync-config-docs.yml

# View workflow logs
gh run view <run-id> --log
```

## Customization

### Adding Schema Context

Edit `scripts/templates/config-page.template.ts`:

```typescript
function getOverviewText(fileName: string): string {
  const overviews: Record<string, string> = {
    global: 'Configure the API server...',
    // Add more context here
  }
  return overviews[fileName] || ''
}
```

### Adding Additional Sections

Modify `getAdditionalSections()` in the template to add category-specific content:

```typescript
if (fileName === 'database') {
  return `## Choosing a Database

  ### SQLite (Default)
  - Best for: Single-server deployments...`
}
```

## Troubleshooting

### Issue: Variables Not Detected

**Symptom**: Generator reports fewer variables than expected

**Causes**:
1. Schema file format doesn't match expected pattern
2. Comments containing `//` in URLs (like `https://`)
3. Multi-line `.describe()` calls

**Solution**: Check the regex patterns in `schema-parser.ts`:
- Variable pattern: `/\n\s*(\w+):\s*z[.\s]/g`
- Comment removal: `/^\s*\/\/[^\n]*$/gm`
- Description extraction: `/\.describe\(\s*["'`]([\s\S]*?)["'`]\s*[,\)]/s`

### Issue: Descriptions Missing

**Symptom**: Some variables show "No description available"

**Cause**: Multi-line strings in `.describe()` not captured

**Solution**: Ensure the description regex handles multi-line strings with the `s` flag and proper whitespace normalization.

### Issue: CI Workflow Not Triggering

**Symptom**: Schema changes don't trigger doc regeneration

**Checklist**:
1. ✓ `DOCS_REPO_PAT` secret configured in main repo?
2. ✓ Path filter in workflow matches changed files?
3. ✓ Workflow file present in `.github/workflows/`?
4. ✓ PAT has `repo` scope?

## Maintenance

### Adding New Schema Files

**No action required!** The generator automatically discovers new schema files.

Just ensure:
1. File ends with `.ts`
2. Exports a `*Schema` constant with `z.object({...})`
3. Variables follow the pattern: `VAR_NAME: z.type().describe("...")`

### Updating Generated Pages

If you need to manually regenerate all pages:

```bash
cd /path/to/prismalens.io
PRISMALENS_REPO_PATH=/path/to/prismalens pnpm docs:generate
git add docs/src/content/docs/reference/
git commit -m "docs: regenerate config reference"
git push
```

## Future Enhancements

Potential improvements:

- [ ] Interactive config builder (web form → `.env` file)
- [ ] Validation examples and common errors
- [ ] Configuration templates for deployment scenarios
- [ ] Search/filter functionality for variables
- [ ] Performance impact notes
- [ ] Links to related monitoring settings
- [ ] Version-specific documentation
