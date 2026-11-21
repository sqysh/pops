import type { FieldDef } from './merge'

export interface PageContentDefs {
  slug: string
  content: readonly FieldDef[]
}

type Vars = Record<string, string | number>

/** "{count} Performances" + { count: 3 } → "3 Performances". Unknown names are left as written. */
const fill = (text: string, vars?: Vars) =>
  vars ? text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match)) : text

/**
 * The one way a page reads its wording.
 *
 *   const { t, list, msg } = pageCopy(content, pageContent)
 *
 * Every fallback comes from the page's constants file, so the code never holds
 * a second copy of the wording that can drift. What is stored always wins; a
 * field that is missing, or saved blank, shows its default, unless the field is
 * marked `optional`, in which case blank means "hide it".
 */
export function pageCopy(content: unknown, defs: PageContentDefs) {
  const stored = new Map<string, unknown>()
  if (Array.isArray(content)) {
    for (const field of content) if (field && typeof field.id === 'string') stored.set(field.id, field.value)
  }
  const declared = new Map(defs.content.map((def) => [def.id, def]))

  const lookup = (id: string) => {
    const def = declared.get(id)
    if (!def && process.env.NODE_ENV !== 'production') {
      console.warn(`[page-content] "${id}" is read on the page but not declared in the "${defs.slug}" constants file`)
    }
    return def
  }

  /** A text field, with optional {placeholders} filled in. */
  const t = (id: string, vars?: Vars) => {
    const def = lookup(id)
    const fallback = typeof def?.value === 'string' ? def.value : ''
    const value = stored.get(id)
    const text = typeof value === 'string' ? value.trim() : undefined

    if (text) return fill(text, vars)
    if (text !== undefined && def?.optional) return ''
    return fill(fallback, vars)
  }

  /** A list field (one entry per line in the editor); blank lines are dropped. */
  const list = (id: string): string[] => {
    const def = lookup(id)
    const fallback = Array.isArray(def?.value) ? [...def.value] : []
    const value = stored.get(id)

    if (!Array.isArray(value)) return fallback
    const items = value.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
    if (items.length > 0) return items
    return def?.optional ? [] : fallback
  }

  /**
   * Form and server messages travel as field ids (e.g. "contact_error_email_invalid")
   * so they can be edited here. Anything that is not a declared id is shown as is.
   */
  const msg = (code?: string | null) => {
    if (!code) return ''
    return declared.has(code) ? t(code) : code
  }

  return { t, list, msg }
}
