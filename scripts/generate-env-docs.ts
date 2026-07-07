#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSchemaFile } from './utils/schema-parser.js'
import { generateConfigPageMDX } from './templates/config-page.template.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PRISMALENS_REPO = path.resolve(
  process.env.PRISMALENS_REPO_PATH || path.join(__dirname, '../../prismalens')
)
const CONFIG_PATH = path.join(PRISMALENS_REPO, 'packages/@prismalens/config/src/schemas')
const OUTPUT_PATH = path.join(__dirname, '../docs/src/content/docs/reference')
const REPO_URL = 'https://github.com/prismalens/prismalens'

async function main() {
  console.log('🔍 PrismaLens Environment Documentation Generator\n')

  // Check if main repo exists and is a directory
  try {
    const stat = await fs.stat(CONFIG_PATH)
    if (!stat.isDirectory()) {
      console.error(`❌ Config path is not a directory: ${CONFIG_PATH}`)
      process.exit(1)
    }
  } catch {
    console.error(`❌ Main repository not found at: ${PRISMALENS_REPO}`)
    console.error(`   Set PRISMALENS_REPO_PATH environment variable to point to the main repo`)
    process.exit(1)
  }

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_PATH, { recursive: true })

  // Dynamically discover all schema files
  const schemaFiles = await fs.readdir(CONFIG_PATH)
  const schemaNames = schemaFiles
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.replace('.ts', ''))

  console.log(`📁 Found ${schemaNames.length} schema files:`)
  schemaNames.forEach(name => console.log(`   - ${name}.ts`))
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

  // Process each schema file
  for (const schemaName of schemaNames) {
    try {
      const filePath = path.join(CONFIG_PATH, `${schemaName}.ts`)
      console.log(`📝 Processing ${schemaName}.ts...`)

      const schemaInfo = await parseSchemaFile(filePath)
      console.log(`   Found ${schemaInfo.variables.length} variables`)

      const mdxContent = generateConfigPageMDX(schemaInfo, {
        timestamp,
        sourceCommit,
        repoUrl: REPO_URL
      })

      const outputFile = path.join(OUTPUT_PATH, `config-${schemaName}.mdx`)
      await fs.writeFile(outputFile, mdxContent, 'utf-8')

      console.log(`   ✅ Generated config-${schemaName}.mdx`)
      successCount++
    } catch (error) {
      console.error(`   ❌ Error processing ${schemaName}:`, error)
      errorCount++
    }
  }

  console.log()
  console.log('━'.repeat(60))
  console.log(`✨ Generation complete!`)
  console.log(`   ✅ ${successCount} files generated successfully`)
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
