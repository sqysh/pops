export type PageFieldType = 'text' | 'textarea' | 'array'

export interface PageField {
  id: string
  type: PageFieldType
  label: string
  value: string | string[]
  section: string
}

// Pages read their wording with pageCopy (app/lib/page-content/copy.ts).
