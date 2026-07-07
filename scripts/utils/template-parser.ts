import fs from 'node:fs/promises'
import path from 'node:path'

export interface FieldInfo {
  name: string
  label: string
  type: string
  required: boolean
  description: string
  placeholder?: string
  defaultValue?: string
  sensitive: boolean
}

export interface TemplateInfo {
  id: string
  name: string
  category: string
  authMode: string
  docsUrl?: string
  setupDocsUrl?: string
  credentialFields: FieldInfo[]
  connectionFields: FieldInfo[]
}

/**
 * Parse a template file and extract all exported AuthTemplate objects.
 * Uses regex-based parsing (same approach as schema-parser.ts).
 */
export async function parseTemplateFile(filePath: string): Promise<TemplateInfo[]> {
  const content = await fs.readFile(filePath, 'utf-8')
  const templates: TemplateInfo[] = []

  // Match each exported const that is typed as AuthTemplate
  const templateRegex = /export const (\w+):\s*AuthTemplate\s*=\s*\{([\s\S]*?)^\};/gm
  for (const match of content.matchAll(templateRegex)) {
    const body = match[2]

    const template = parseTemplateBody(body)
    if (template) {
      templates.push(template)
    }
  }

  return templates
}

function extractStringValue(body: string, key: string): string | undefined {
  // Match double-quoted strings (template files use double quotes consistently)
  const regex = new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`)
  const match = body.match(regex)
  return match?.[1]
}

function parseTemplateBody(body: string): TemplateInfo | null {
  const id = extractStringValue(body, 'id')
  const name = extractStringValue(body, 'name')
  const category = extractStringValue(body, 'category')
  const authMode = extractStringValue(body, 'authMode')

  if (!id || !name || !category || !authMode) return null

  return {
    id,
    name,
    category,
    authMode,
    docsUrl: extractStringValue(body, 'docsUrl'),
    setupDocsUrl: extractStringValue(body, 'setupDocsUrl'),
    credentialFields: parseFields(body, 'credentialFields'),
    connectionFields: parseFields(body, 'connectionFields'),
  }
}

function parseFields(body: string, fieldName: string): FieldInfo[] {
  // Find the array block for this field name
  const regex = new RegExp(`${fieldName}:\\s*\\[([\\s\\S]*?)\\],`, 'm')
  const match = body.match(regex)
  if (!match) return []

  const arrayContent = match[1]
  const fields: FieldInfo[] = []

  // Match each object in the array
  const objectRegex = /\{([\s\S]*?)\}/g
  for (const objMatch of arrayContent.matchAll(objectRegex)) {
    const objBody = objMatch[1]
    const fieldName = extractStringValue(objBody, 'name')
    const label = extractStringValue(objBody, 'label')
    const type = extractStringValue(objBody, 'type')

    if (!fieldName || !label || !type) continue

    fields.push({
      name: fieldName,
      label,
      type,
      required: /required:\s*true/.test(objBody),
      description: extractStringValue(objBody, 'description') ?? '',
      placeholder: extractStringValue(objBody, 'placeholder'),
      defaultValue: extractStringValue(objBody, 'default'),
      sensitive: /sensitive:\s*true/.test(objBody),
    })
  }

  return fields
}

/**
 * Discover all template files in a directory
 */
export async function discoverTemplateFiles(templatesDir: string): Promise<string[]> {
  const files = await fs.readdir(templatesDir)
  return files
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .map(f => path.join(templatesDir, f))
}
