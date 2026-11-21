'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '@/app/utils/logHelper'
import { getActor } from '../user/getActor'
import { denied, requireStaff } from '@/app/lib/auth/guards'
import { buildLogMessage, getRequestContext } from '@/app/utils/parseUserAgent'
import { pageContentFor } from '@/app/lib/constants/page-content'
import { FieldValue, StoredField, mergePageContent } from '@/app/lib/page-content/merge'
import { publicUrlMessage, publicUrlProblem } from '@/app/lib/page-content/url'

const MAX_LENGTH = 20000
const MAX_ATTEMPTS = 12

export interface PageConflict {
  id: string
  label: string
  /** What is saved now, trimmed for display. */
  current: string
}

export type UpdatePageContentResult = { success: true } | { success: false; error: string; conflicts?: PageConflict[] }

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

const preview = (value: FieldValue | undefined) => {
  const text = Array.isArray(value) ? value.join('\n') : (value ?? '')
  return text.length > 300 ? `${text.slice(0, 300)}…` : text
}

const CONFLICT_MESSAGE =
  'Someone else saved a change to this page while you were editing, so nothing was saved. Their wording is now showing. Look it over, then choose Save changes again if you still want yours.'

/**
 * Saves the fields an editor changed on one page.
 *
 * `values` holds the changed fields and `base` holds, for each of them, the
 * wording the editor was looking at when they started. If what is saved now is
 * no longer that wording, someone else got there first: nothing is written and
 * the conflict is reported. People editing different fields never conflict,
 * and the final write is checked against the row's last-saved time so two
 * saves landing together cannot overwrite each other.
 */
export async function updatePageContent(
  slug: string,
  values: Record<string, FieldValue>,
  base: Record<string, FieldValue>
): Promise<UpdatePageContentResult> {
  const gate = await requireStaff()
  if (gate.ok === false) return denied(gate)

  const defs = pageContentFor(slug)
  if (!defs) return { success: false, error: 'This page cannot be edited here.' }

  const declared = new Map(defs.content.map((def) => [def.id, def]))
  const entries = Object.entries(values ?? {})
  if (entries.length === 0) return { success: false, error: 'There are no changes to save.' }

  for (const [id, value] of entries) {
    const def = declared.get(id)
    if (!def) return { success: false, error: 'One of the fields no longer exists. Reload the page and try again.' }

    const ok =
      def.type === 'array'
        ? Array.isArray(value) && value.every((v) => typeof v === 'string' && v.length <= MAX_LENGTH)
        : typeof value === 'string' && value.length <= MAX_LENGTH
    if (!ok) return { success: false, error: `"${def.label}" could not be saved. Check its wording and try again.` }
    if (def.url && typeof value === 'string') {
      const problem = publicUrlProblem(value)
      if (problem) return { success: false, error: publicUrlMessage(problem, def.label) }
    }
    if (!base || !(id in base)) return { success: false, error: 'This page is out of date. Reload it and try again.' }
  }

  const [actor, context] = await Promise.all([getActor(), getRequestContext()])

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const row = await prisma.page.findUnique({ where: { slug } }).catch(() => null)
    const stored = (Array.isArray(row?.content) ? row.content : []) as unknown as StoredField[]
    const storedById = new Map(stored.map((f) => [f.id, f]))

    // a field that was never saved reads as its default wording
    const conflicts: PageConflict[] = entries.flatMap(([id]) => {
      const def = declared.get(id)!
      const current = storedById.has(id) ? storedById.get(id)!.value : (def.value as FieldValue)
      return same(current, base[id]) ? [] : [{ id, label: def.label, current: preview(current) }]
    })

    if (conflicts.length > 0) {
      await createLog('info', await buildLogMessage(`page content conflict on "${slug}"`, actor, context), {
        slug,
        fields: conflicts.map((c) => c.id),
        updatedBy: actor,
        request: context
      }).catch(() => null)

      return { success: false, error: CONFLICT_MESSAGE, conflicts }
    }

    const { content, added } = mergePageContent(stored, defs.content, values)

    let saved = false
    if (!row) {
      saved = await prisma.page
        .create({ data: { slug, content: content as object[], createdBy: gate.userId } })
        .then(() => true)
        .catch(() => false) // lost a race to create the same page: look again
    } else {
      // only writes if nobody saved this page since it was read above
      const result = await prisma.page
        .updateMany({ where: { id: row.id, updatedAt: row.updatedAt }, data: { content: content as object[] } })
        .catch(() => null)
      if (!result) return { success: false, error: 'Failed to save page content' }
      saved = result.count === 1
    }

    if (!saved) {
      // someone else saved in the same instant: wait a moment so the two do not collide again
      await new Promise((resolve) => setTimeout(resolve, 10 + Math.random() * 50))
      continue
    }

    await createLog('info', await buildLogMessage(`updated page content for "${slug}"`, actor, context), {
      slug,
      changed: entries.map(([id]) => id),
      added: added.length,
      updatedBy: actor,
      request: context
    }).catch(() => null)

    revalidatePath('/', 'layout')

    return { success: true }
  }

  return {
    success: false,
    error: 'This page is being saved by several people at once, so nothing was saved. Wait a moment and try again.'
  }
}
