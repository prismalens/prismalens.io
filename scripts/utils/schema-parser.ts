import fs from 'node:fs/promises'
import path from 'node:path'

export interface VariableInfo {
  name: string
  type: string
  defaultValue?: string
  description: string
  required: boolean
  enumValues?: string[]
  dockerSecretSupport: boolean
}

export interface SchemaInfo {
  name: string
  fileName: string
  description: string
  variables: VariableInfo[]
}

/**
 * Parse a Zod schema file and extract variable definitions
 */
export async function parseSchemaFile(filePath: string): Promise<SchemaInfo> {
  const content = await fs.readFile(filePath, 'utf-8')
  const fileName = path.basename(filePath, '.ts')

  // Extract schema description from file-level comment
  const schemaDescMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/s)
  const schemaDescription = schemaDescMatch?.[1] || `${capitalize(fileName)} configuration`

  const variables: VariableInfo[] = []

  // Find all schema definitions - both nested and main
  // Use a more robust regex that handles nested braces
  const schemaRegex = /export const (\w+Schema) = z\.object\(\{([\s\S]+?)\n\}\);/g

  for (const match of content.matchAll(schemaRegex)) {
    const schemaName = match[1]
    let schemaContent = match[2]

    // Skip if this is a main schema that just spreads other schemas
    if (schemaContent.includes('...') && schemaContent.includes('.shape')) {
      continue
    }

    extractVariables(schemaContent, variables)
  }

  return {
    name: capitalize(fileName),
    fileName,
    description: schemaDescription,
    variables
  }
}

/**
 * Extract variables from schema content using a smarter approach
 */
function extractVariables(schemaContent: string, variables: VariableInfo[]): void {
  // Remove single-line comments (but not // in URLs like https://)
  // Only match // that appears after whitespace or at line start
  let cleaned = schemaContent.replace(/^\s*\/\/[^\n]*$/gm, '')

  // Split by variable definitions (look for pattern: VARNAME: followed by z. or z\n)
  // Handle both same-line (VARNAME: z.coerce) and next-line (VARNAME: z\n\t\t.enum) patterns
  const varPattern = /\n\s*(\w+):\s*z[.\s]/g
  const matches = [...cleaned.matchAll(varPattern)]

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const varName = match[1]
    const startIdx = match.index! + match[0].indexOf(varName)

    // Find the end of this variable definition (next variable or end of object)
    let endIdx: number
    if (i < matches.length - 1) {
      endIdx = matches[i + 1].index!
    } else {
      endIdx = cleaned.length
    }

    // Extract the variable definition
    const varDef = cleaned.substring(startIdx, endIdx)

    // Process this variable
    const variable = parseVariable(varName, varDef)
    if (variable) {
      variables.push(variable)
    }
  }
}

/**
 * Parse a single variable definition
 */
function parseVariable(varName: string, varDef: string): VariableInfo | null {
  // Clean up the definition - remove trailing comma and whitespace
  varDef = varDef.replace(/,\s*$/, '').trim()

  // Keep original for description extraction (handles multi-line strings better)
  const original = varDef

  // Remove newlines and extra whitespace for easier parsing
  const normalized = varDef.replace(/\s+/g, ' ')

  return {
    name: varName,
    type: extractType(normalized),
    description: extractDescription(original), // Use original for multi-line strings
    required: !normalized.includes('.optional()'),
    defaultValue: extractDefault(normalized),
    enumValues: extractEnumValues(normalized),
    dockerSecretSupport: true
  }
}

/**
 * Extract variable type from Zod definition
 */
function extractType(varDef: string): string {
  // Handle coerce types
  if (varDef.includes('coerce.string')) return 'string'
  if (varDef.includes('coerce.number')) return 'number'
  if (varDef.includes('coerce.boolean')) return 'boolean'

  // Handle direct types
  if (varDef.includes('string()')) return 'string'
  if (varDef.includes('number()')) return 'number'
  if (varDef.includes('boolean()')) return 'boolean'
  if (varDef.includes('enum(')) return 'enum'

  return 'string' // Default fallback
}

/**
 * Extract description from .describe() call
 */
function extractDescription(varDef: string): string {
  // Match .describe() with multi-line string support
  // Handle both:
  // 1. .describe("text")
  // 2. .describe(\n\t\t"text",\n\t)
  const descMatch = varDef.match(/\.describe\(\s*["'`]([\s\S]*?)["'`]\s*[,\)]/s)
  if (descMatch) {
    return descMatch[1]
      .trim()
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\t/g, '') // Remove tabs
      .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
  }
  return 'No description available'
}

/**
 * Extract default value from .default() call
 */
function extractDefault(varDef: string): string | undefined {
  // Match .default() with various value types
  const defaultMatch = varDef.match(/\.default\(\s*(.+?)\s*\)/)
  if (defaultMatch) {
    let defaultVal = defaultMatch[1].trim()

    // Clean up the value
    // Remove quotes for strings
    if (/^["'`].*["'`]$/.test(defaultVal)) {
      defaultVal = defaultVal.slice(1, -1)
    }

    // Handle special cases
    if (defaultVal === 'true' || defaultVal === 'false') {
      return defaultVal
    }

    return defaultVal
  }
  return undefined
}

/**
 * Extract enum values from z.enum([...])
 */
function extractEnumValues(varDef: string): string[] | undefined {
  const enumMatch = varDef.match(/enum\(\s*\[([^\]]+)\]\s*\)/)
  if (enumMatch) {
    return enumMatch[1]
      .split(',')
      .map(v => v.trim().replace(/^["']|["']$/g, ''))
      .filter(v => v.length > 0)
  }
  return undefined
}

/**
 * Format variables as a Markdown table
 */
export function formatVariableTable(variables: VariableInfo[]): string {
  if (variables.length === 0) {
    return '_No environment variables defined in this schema._'
  }

  const rows = variables.map(v => {
    const required = v.required ? 'Yes' : 'No'
    const defaultVal = v.defaultValue ? `\`${v.defaultValue}\`` : '-'
    const type = v.enumValues
      ? `enum: ${v.enumValues.map(e => `\`${e}\``).join(', ')}`
      : v.type

    return `| \`${v.name}\` | ${type} | ${required} | ${defaultVal} | ${v.description} |`
  }).join('\n')

  return `| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
${rows}`
}

/**
 * Generate example .env configuration
 */
export function generateEnvExample(variables: VariableInfo[]): string {
  if (variables.length === 0) {
    return '# No environment variables defined'
  }

  return variables
    .filter(v => v.required || v.defaultValue !== undefined)
    .map(v => {
      const comment = `# ${v.description}`
      const value = v.defaultValue || '<value>'
      const line = v.required
        ? `${v.name}=${value}`
        : `# ${v.name}=${value}`

      return `${comment}\n${line}`
    })
    .join('\n\n')
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
