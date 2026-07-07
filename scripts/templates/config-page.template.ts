import type { SchemaInfo } from '../utils/schema-parser.js'
import { formatVariableTable, generateEnvExample } from '../utils/schema-parser.js'

export function generateConfigPageMDX(
  schema: SchemaInfo,
  options: {
    timestamp: string
    sourceCommit?: string
    repoUrl: string
  }
): string {
  const { name, fileName, description, variables } = schema
  const { timestamp, sourceCommit, repoUrl } = options

  const sourceUrl = sourceCommit
    ? `${repoUrl}/blob/${sourceCommit}/packages/@prismalens/config/src/schemas/${fileName}.ts`
    : `${repoUrl}/blob/main/packages/@prismalens/config/src/schemas/${fileName}.ts`

  return `---
title: ${name} Configuration
description: Environment variables for ${description.toLowerCase()}
---

# ${name} Configuration

:::note[Auto-generated Documentation]
This page is automatically generated from source code.
- **Last updated:** ${timestamp}
- **Source:** [${fileName}.ts](${sourceUrl})
:::

## Overview

${description}

${getOverviewText(fileName)}

## Environment Variables

${formatVariableTable(variables)}

## Docker Secrets Support

All environment variables support Docker and Kubernetes secrets via the \`_FILE\` suffix pattern. This allows you to mount secrets as files instead of passing them directly as environment variables.

**Example:**

\`\`\`bash
# Direct value (less secure for secrets)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Or via mounted secret file (recommended for production)
ANTHROPIC_API_KEY_FILE=/run/secrets/anthropic_key
\`\`\`

When a \`_FILE\` variable is provided, PrismaLens will read the secret from that file path. This is the recommended approach for sensitive values in containerized environments.

## Example Configuration

\`\`\`bash title=".env"
${generateEnvExample(variables)}
\`\`\`

${getAdditionalSections(fileName, variables)}

## Configuration Precedence

Environment variables have the highest priority and override any values stored in the database (configured via the Settings UI). Default values defined in the schema are used when neither an environment variable nor a database value is set.

## Related Configuration

${getRelatedLinks(fileName)}

`
}

function getOverviewText(fileName: string): string {
  const overviews: Record<string, string> = {
    global: 'Configure the API server binding, public URLs, security settings, and CORS policies for your PrismaLens instance.',
    database: 'PrismaLens supports both SQLite (default) and PostgreSQL databases. SQLite is recommended for single-server deployments, while PostgreSQL is better suited for production environments with high availability requirements.',
    logging: 'Control log output levels, formats, rotation policies, and where logs are written. PrismaLens uses structured logging with support for JSON output and log file rotation.',
    llm: 'Configure API keys and settings for LLM providers like Anthropic Claude, OpenAI, Google Gemini, and others. At least one LLM provider must be configured for PrismaLens to function.',
    queue: 'Configure Redis connection settings for queue-based processing mode. Queue mode is recommended for production deployments to handle concurrent investigations reliably.',
    deployment: 'Configure deployment-specific settings including encryption keys, SMTP for email notifications, and other production deployment concerns.',
    langsmith: 'Enable LangSmith tracing for debugging and evaluating LLM interactions. This is optional but recommended for development and debugging.',
    skills: 'Configure paths to custom skill directories and MCP (Model Context Protocol) server definitions to extend PrismaLens capabilities.',
    mcp: 'Configure MCP (Model Context Protocol) servers that provide tools and resources to extend PrismaLens capabilities with external integrations.'
  }

  return overviews[fileName] || ''
}

function getAdditionalSections(fileName: string, variables: any[]): string {
  if (fileName === 'database') {
    return `
## Choosing a Database

### SQLite (Default)
- **Best for:** Single-server deployments, development, testing
- **Pros:** Zero configuration, no separate database server needed, fast for single-instance
- **Cons:** Not suitable for distributed deployments
- **Location:** \`~/.prismalens/prismalens.db\`

### PostgreSQL
- **Best for:** Production deployments, high availability setups
- **Pros:** Better concurrency, replication support, suitable for distributed systems
- **Cons:** Requires separate database server
- **Requirements:** PostgreSQL 14+

To switch from SQLite to PostgreSQL, set \`PRISMALENS_DB_TYPE=postgresql\` and configure the PostgreSQL connection settings.`
  }

  if (fileName === 'llm') {
    return `
## Supported LLM Providers

PrismaLens supports multiple LLM providers. You can configure one or more providers - the system will use them based on availability and your preferences.

### Anthropic Claude (Recommended)
Claude models excel at complex reasoning and investigation tasks. PrismaLens is optimized for Claude 3.5 Sonnet and Claude 3 Opus.

### OpenAI
Support for GPT-4 and GPT-3.5 models. Useful as a fallback provider.

### Google Gemini
Support for Gemini Pro and Gemini Ultra models.

### Priority and Fallback
Configure multiple providers for redundancy. If one provider fails or hits rate limits, PrismaLens will automatically fall back to alternative providers.`
  }

  if (fileName === 'queue') {
    return `
## Queue Mode vs Regular Mode

PrismaLens can run in two modes:

### Regular Mode (Default)
- Investigations run directly in the API server process
- Simpler to deploy (no Redis required)
- Limited concurrency control
- Good for development and light production use

### Queue Mode (Recommended for Production)
- Set \`PRISMALENS_MODE=queue\` to enable
- Requires Redis for job queue management
- Better resource management and concurrency control
- Recommended for production deployments
- Supports horizontal scaling with multiple worker processes

To enable queue mode, set \`PRISMALENS_MODE=queue\` and configure the Redis connection settings below.`
  }

  return ''
}

function getRelatedLinks(fileName: string): string {
  const allCategories = [
    { name: 'global', title: 'Global Configuration' },
    { name: 'database', title: 'Database' },
    { name: 'logging', title: 'Logging' },
    { name: 'llm', title: 'LLM Providers' },
    { name: 'queue', title: 'Queue' },
    { name: 'deployment', title: 'Deployment' },
    { name: 'langsmith', title: 'LangSmith' },
    { name: 'skills', title: 'Skills & MCP' },
    { name: 'mcp', title: 'MCP Servers' }
  ]

  // Show 3-4 most relevant related categories
  const related = allCategories
    .filter(c => c.name !== fileName)
    .slice(0, 4)
    .map(c => `- [${c.title}](/reference/config-${c.name})`)
    .join('\n')

  return `${related}
- [Configuration Overview](/reference/)`
}
