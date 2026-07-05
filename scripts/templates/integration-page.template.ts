import type { TemplateInfo, FieldInfo } from '../utils/template-parser.js'
import type { SetupGuide } from '../data/integration-guides.js'

const AUTH_MODE_LABELS: Record<string, string> = {
  api_key: 'API Key',
  basic: 'Basic Auth',
  oauth2: 'OAuth 2.0',
  github_app: 'GitHub App',
}

const CATEGORY_LABELS: Record<string, string> = {
  vcs: 'Version Control',
  communication: 'Communication',
  observability: 'Observability',
}

export function generateIntegrationPageMDX(
  template: TemplateInfo,
  guide: SetupGuide,
  options: {
    timestamp: string
    sourceCommit?: string
    repoUrl: string
  }
): string {
  const { id, name, category, authMode } = template
  const { timestamp, sourceCommit, repoUrl } = options

  const sourceUrl = sourceCommit
    ? `${repoUrl}/blob/${sourceCommit}/packages/@prismalens/integrations/src/templates/`
    : `${repoUrl}/blob/main/packages/@prismalens/integrations/src/templates/`

  const authLabel = AUTH_MODE_LABELS[authMode] ?? authMode
  const categoryLabel = CATEGORY_LABELS[category] ?? category

  const sections: string[] = []

  // Frontmatter + header
  sections.push(`---
title: "${name} Integration"
description: Setup guide for the ${name} integration in PrismaLens
---

# ${name} Integration

:::note[Auto-generated Documentation]
This page is automatically generated from source code.
- **Last updated:** ${timestamp}
- **Source:** [templates/](${sourceUrl})
:::

## Overview

| Property | Value |
|----------|-------|
| **Auth Mode** | ${authLabel} |
| **Category** | ${categoryLabel} |
| **Template ID** | \`${id}\` |`)

  // Prerequisites
  if (guide.prerequisiteSteps.length) {
    sections.push(`\n## Prerequisites`)

    if (guide.prerequisiteUrl) {
      sections.push(`\nStart here: [${guide.providerName} setup page](${guide.prerequisiteUrl})\n`)
    }

    const steps = guide.prerequisiteSteps
      .map((step, i) => `${i + 1}. ${step}`)
      .join('\n')
    sections.push(steps)
  }

  // Credential fields
  if (template.credentialFields.length > 0) {
    sections.push(`\n## Credential Fields\n`)
    sections.push(formatFieldsTable(template.credentialFields, guide.fieldMapping))
  }

  // Connection fields
  if (template.connectionFields.length > 0) {
    sections.push(`\n## Connection Fields\n`)
    sections.push(formatFieldsTable(template.connectionFields, guide.fieldMapping))
  }

  // Permissions
  if (guide.permissions && Object.keys(guide.permissions).length > 0) {
    sections.push(`\n## Required Permissions\n`)
    sections.push(`| Permission | Description |
|------------|-------------|`)
    for (const [perm, desc] of Object.entries(guide.permissions)) {
      sections.push(`| \`${perm}\` | ${desc} |`)
    }
  }

  // Callback URL
  if (guide.callbackUrl) {
    sections.push(`\n## Callback URL

When configuring your ${guide.providerName} app, set the redirect/callback URL to:

\`\`\`
${guide.callbackUrl}
\`\`\`

Replace \`{{origin}}\` with your PrismaLens instance URL (e.g., \`https://prismalens.example.com\`).`)
  }

  // Notes
  if (guide.notes?.length) {
    sections.push(`\n## Tips\n`)
    for (const note of guide.notes) {
      sections.push(`- ${note}`)
    }
  }

  // Provider docs link
  if (template.docsUrl) {
    sections.push(`\n## Provider Documentation\n\n- [${guide.providerName} API docs](${template.docsUrl})`)
  }

  sections.push('')
  return sections.join('\n')
}

function formatFieldsTable(fields: FieldInfo[], fieldMapping: Record<string, string>): string {
  const rows = fields.map(f => {
    const required = f.required ? 'Yes' : 'No'
    const sensitive = f.sensitive ? 'Yes' : 'No'
    const description = fieldMapping[f.name] ?? f.description
    return `| \`${f.name}\` | ${f.label} | ${f.type} | ${required} | ${sensitive} | ${description} |`
  })

  return `| Field | Label | Type | Required | Sensitive | Description |
|-------|-------|------|----------|-----------|-------------|
${rows.join('\n')}`
}
