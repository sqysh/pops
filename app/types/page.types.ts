export type PageFieldType = 'text' | 'textarea' | 'array'

export interface PageField {
  id: string
  type: PageFieldType
  label: string
  value: string | string[]
  section: string
}

/** Reads a field's value, falling back to the component's own copy when the
 *  field is missing or has been cleared. */
export const pageText = (content: PageField[], id: string, fallback: string) => {
  const field = content.find((f) => f.id === id)
  const value = typeof field?.value === 'string' ? field.value.trim() : ''
  return value || fallback
}

/** Same, for the array fields like schedule lines. */
export const pageList = (content: PageField[], id: string, fallback: string[] = []) => {
  const field = content.find((f) => f.id === id)
  if (!Array.isArray(field?.value)) return fallback
  const items = field.value.map((v) => v.trim()).filter(Boolean)
  return items.length > 0 ? items : fallback
}
