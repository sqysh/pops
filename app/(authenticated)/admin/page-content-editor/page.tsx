import PageContentEditorClient, { EditorPage } from '@/app/(authenticated)/admin/page-content-editor/PageContentEditorClient'
import type { Page } from '@prisma/client'
import prisma from '@/prisma/client'
import { PAGE_CONTENT } from '@/app/lib/constants/page-content'
import { StoredField } from '@/app/lib/page-content/merge'
import { pageName, pagePath } from '@/app/lib/utils/page.utils'
import { requireStaffPage } from '@/app/lib/auth/guards'

/** Old slugs the seed carries over; once it has run they no longer exist. */
const RETIRED_SLUGS = new Set(['bubble-bash'])

const toValue = (value: unknown, array: boolean) => {
  if (array) return Array.isArray(value) ? value.map(String) : []
  return typeof value === 'string' ? value : ''
}

export default async function PageContentEditorPage({ searchParams }) {
  await requireStaffPage()

  const { slug } = await searchParams
  const rows: Page[] = await prisma.page.findMany({ orderBy: { slug: 'asc' } }).catch(() => [])
  const rowsBySlug = new Map(rows.map((row) => [row.slug, row]))

  // What the website reads comes from the code; what has been written comes from
  // the database. Show every page the website reads, plus any stored page that
  // the website no longer reads, so nothing saved is hidden from view.
  const slugs = new Set([
    ...PAGE_CONTENT.map((defs) => defs.slug),
    ...rows.map((row) => row.slug).filter((s) => !RETIRED_SLUGS.has(s))
  ])

  const pages: EditorPage[] = [...slugs].map((pageSlug) => {
    const defs = PAGE_CONTENT.find((d) => d.slug === pageSlug)?.content ?? []
    const content = rowsBySlug.get(pageSlug)?.content
    const stored = (Array.isArray(content) ? content : []) as unknown as StoredField[]
    const storedById = new Map(stored.map((f) => [f.id, f]))
    const declared = new Set(defs.map((d) => d.id))

    return {
      slug: pageSlug,
      name: pageName(pageSlug),
      path: pagePath(pageSlug),
      fields: defs.map((def) => {
        const array = def.type === 'array'
        return {
          id: def.id,
          type: array ? 'array' : def.type === 'textarea' ? 'textarea' : 'text',
          label: def.label,
          section: def.section,
          optional: !!def.optional,
          defaultValue: toValue(def.value, array),
          value: storedById.has(def.id) ? toValue(storedById.get(def.id)!.value, array) : toValue(def.value, array)
        }
      }),
      unused: stored
        .filter((f) => !declared.has(f.id))
        .map((f) => ({
          id: f.id,
          label: f.label || f.id,
          value: Array.isArray(f.value) ? f.value.join('\n') : String(f.value ?? '')
        }))
    }
  })

  return <PageContentEditorClient pages={pages} slug={slug} />
}
