import { JsonValue } from '@prisma/client/runtime/library'

export type ContentItem = {
  id: string
  type: string
  label: string
  value: string
  section: string
}

export type FooterData = {
  id: string
  createdAt: Date
  updatedAt: Date
  slug: string
  createdBy: string | null
  content: JsonValue
}
export type FooterDataParsed = Omit<FooterData, 'content'> & { content: ContentItem[] }
