// Shared by the seed script (run directly by node) and the page content
// editor, so it must stay free of imports and path aliases.

export type FieldValue = string | string[]

export interface StoredField {
  id: string
  type?: string
  label?: string
  section?: string
  value: FieldValue
}

export interface FieldDef {
  id: string
  type: string
  label: string
  section: string
  value: FieldValue | readonly string[]
  optional?: boolean
  /** The wording must be a web address visitors can open. Checked on save and when shown. */
  url?: boolean
}

/**
 * Brings a page's stored fields in line with the fields the code declares.
 *
 * The one rule: wording that is already stored is never replaced. A stored
 * field is kept exactly as it is (value, label and all) unless `values`
 * explicitly sets it, which only the editor's save does. Declared fields that
 * are missing are added with their default wording, and stored fields the code
 * no longer reads are kept untouched at the end.
 */
export function mergePageContent(
  existing: unknown,
  defs: readonly FieldDef[],
  values: Record<string, FieldValue> = {}
): { content: StoredField[]; added: string[]; changed: string[] } {
  const stored = (Array.isArray(existing) ? existing : []).filter(
    (f): f is StoredField => !!f && typeof f === 'object' && typeof f.id === 'string'
  )
  const storedIds = new Set(stored.map((f) => f.id))
  const changed: string[] = []

  const kept = stored.map((field) => {
    if (!(field.id in values)) return field
    const value = values[field.id]
    if (JSON.stringify(value) !== JSON.stringify(field.value)) changed.push(field.id)
    return { ...field, value }
  })

  const added = defs.filter((def) => !storedIds.has(def.id))
  const appended = added.map((def) => ({
    id: def.id,
    type: def.type,
    label: def.label,
    section: def.section,
    value: def.id in values ? values[def.id] : Array.isArray(def.value) ? [...def.value] : (def.value as string)
  }))

  return { content: [...kept, ...appended], added: added.map((d) => d.id), changed }
}
