#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverTemplateFiles, parseTemplateFile } from './utils/template-parser.js'
import { generateIntegrationPageMDX } from './templates/integration-page.template.js'
import { integrationGuides } from './data/integration-guides.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PRISMALENS_REPO = path.resolve(
  process.env.PRISMALENS_REPO_PATH || path.join(__dirname, '../../prismalens')
)
const TEMPLATES_PATH = path.join(PRISMALENS_REPO, 'packages/@prismalens/integrations/src/templates')
// Integrations docs are staged out of the live collection until the
// self-hosted server ships (CLI-only 0.0.1 launch) — write to the staging dir
// so a generator rerun cannot resurrect the section on the live site.
const OUTPUT_PATH = path.join(__dirname, '../docs/src/content/unreleased/integrations')
const REPO_URL = 'https://github.com/prismalens/prismalens'

async function main() {
  console.log('🔍 PrismaLens Integration Documentation Generator\n')

  // Check if templates directory exists
  try {
    const stat = await fs.stat(TEMPLATES_PATH)
    if (!stat.isDirectory()) {
      console.error(`❌ Templates path is not a directory: ${TEMPLATES_PATH}`)
      process.exit(1)
    }
  } catch {
    console.error(`❌ Main repository not found at: ${PRISMALENS_REPO}`)
    console.error(`   Set PRISMALENS_REPO_PATH environment variable to point to the main repo`)
    process.exit(1)
  }

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_PATH, { recursive: true })

  // Discover template files
  const templateFiles = await discoverTemplateFiles(TEMPLATES_PATH)
  console.log(`📁 Found ${templateFiles.length} template files:`)
  templateFiles.forEach(f => console.log(`   - ${path.basename(f)}`))
  console.log()

  // Get git commit hash if available
  let sourceCommit: string | undefined
  try {
    const { execSync } = await import('node:child_process')
    sourceCommit = execSync('git rev-parse HEAD', {
      cwd: PRISMALENS_REPO,
      encoding: 'utf-8'
    }).trim()
  } catch {
    console.log('⚠️  Could not determine git commit hash')
  }

  const timestamp = new Date().toISOString()
  let successCount = 0
  let errorCount = 0
  let skipCount = 0

  // Process each template file
  for (const filePath of templateFiles) {
    try {
      const fileName = path.basename(filePath, '.ts')
      console.log(`📝 Processing ${fileName}.ts...`)

      const templates = await parseTemplateFile(filePath)
      console.log(`   Found ${templates.length} template(s)`)

      for (const template of templates) {
        // Look up guide data from local data file
        const guide = integrationGuides[template.id]
        if (!guide) {
          console.log(`   ⏭  Skipping ${template.id} (no guide data in integration-guides.ts)`)
          skipCount++
          continue
        }

        const mdxContent = generateIntegrationPageMDX(template, guide, {
          timestamp,
          sourceCommit,
          repoUrl: REPO_URL
        })

        const outputFile = path.join(OUTPUT_PATH, `${template.id}.mdx`)
        await fs.writeFile(outputFile, mdxContent, 'utf-8')

        console.log(`   ✅ Generated ${template.id}.mdx`)
        successCount++
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${path.basename(filePath)}:`, error)
      errorCount++
    }
  }

  console.log()
  console.log('━'.repeat(60))
  console.log(`✨ Generation complete!`)
  console.log(`   ✅ ${successCount} files generated successfully`)
  if (skipCount > 0) {
    console.log(`   ⏭  ${skipCount} templates skipped (no guide data)`)
  }
  if (errorCount > 0) {
    console.log(`   ❌ ${errorCount} files failed`)
  }
  console.log(`   📂 Output: ${OUTPUT_PATH}`)
  console.log('━'.repeat(60))

  if (errorCount > 0) {
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
