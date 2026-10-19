'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ChevronRight, ExternalLink, FileText, Info, Loader2, Plus, Save, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Page } from '@prisma/client'
import { updatePageContent } from '@/app/lib/actions/page/updatePageContent'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { PageField } from '@/app/types/page.types'
import { pageName, pagePath } from '@/app/lib/utils/page.utils'
import { FormField, FormInput, FormTextarea, LABEL } from '@/app/(authenticated)/v2/_components/FormField'

const readContent = (page: Page) => (page.content as unknown as PageField[]) ?? []

function ArrayField({ field, onChange }: { field: PageField; onChange: (value: string[]) => void }) {
  const items = Array.isArray(field.value) ? field.value : []

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className={LABEL}>{field.label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-blaze-text hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          Add line
        </button>
      </div>

      {items.length === 0 ? (
        <p className="border border-dashed border-neutral-300 px-3 py-3 text-center text-neutral-500">
          Nothing here yet. Add a line to get started.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <FormInput
                type="text"
                value={item}
                onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
                aria-label={`${field.label}, line ${i + 1}`}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                aria-label={`Remove line ${i + 1}`}
                className="shrink-0 flex items-center justify-center w-9 h-9 text-neutral-400 hover:text-red-700 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function FieldInput({ field, onChange }: { field: PageField; onChange: (value: string | string[]) => void }) {
  if (field.type === 'array') {
    return <ArrayField field={field} onChange={onChange} />
  }

  return (
    <FormField label={field.label}>
      {field.type === 'textarea' ? (
        <FormTextarea value={field.value as string} rows={4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <FormInput type="text" value={field.value as string} onChange={(e) => onChange(e.target.value)} />
      )}
    </FormField>
  )
}

function SectionBlock({
  title,
  fields,
  onFieldChange
}: {
  title: string
  fields: PageField[]
  onFieldChange: (id: string, value: string | string[]) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-neutral-300 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }} className="shrink-0">
          <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
        </motion.span>
        <span className="font-semibold text-neutral-900">{title}</span>
        <span className="text-neutral-500">
          {fields.length} {fields.length === 1 ? 'field' : 'fields'}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-5 border-t border-neutral-200">
              {fields.map((field) => (
                <FieldInput key={field.id} field={field} onChange={(value) => onFieldChange(field.id, value)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PageContentEditorClient({ pages, slug }: { pages: Page[]; slug?: string }) {
  const router = useRouter()

  const [selectedPage, setSelectedPage] = useState<Page | null>(pages.find((p) => p.slug === slug) ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // edits are kept per page, so switching pages never carries one page's
  // fields onto another and never silently throws work away
  const [drafts, setDrafts] = useState<Record<string, PageField[]>>({})

  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)

  const content = selectedPage ? (drafts[selectedPage.id] ?? readContent(selectedPage)) : []
  const isDirty = !!selectedPage && !!drafts[selectedPage.id]
  const dirtyCount = Object.keys(drafts).length

  const sortedPages = [...pages].sort((a, b) => pageName(a.slug).localeCompare(pageName(b.slug)))
  const selectedPath = selectedPage ? pagePath(selectedPage.slug) : null

  function updateField(id: string, value: string | string[]) {
    if (!selectedPage) return

    setDrafts((prev) => ({
      ...prev,
      [selectedPage.id]: (prev[selectedPage.id] ?? readContent(selectedPage)).map((f) => (f.id === id ? { ...f, value } : f))
    }))
  }

  async function handleSave() {
    if (!selectedPage || !isDirty) return

    setError(null)
    setSaving(true)

    const result = await updatePageContent(selectedPage.id, drafts[selectedPage.id])
    setSaving(false)

    if (!result.success) {
      setError(result.error ?? 'Your changes could not be saved. Please try again.')
      return
    }

    savedSE()
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[selectedPage.id]
      return next
    })
    router.refresh()
  }

  const sections = Array.from(new Set(content.map((f) => f.section)))

  return (
    <div className="flex flex-col h-full min-h-125 bg-neutral-200 text-sm">
      <div className="shrink-0 bg-white border-b border-neutral-300">
        <div className="flex items-center justify-between gap-4 px-6 py-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-neutral-900">Page content</h1>
            <p className="text-neutral-600 mt-0.5 truncate">
              {selectedPage ? `Editing ${pageName(selectedPage.slug)}` : `${pages.length} pages`}
              {dirtyCount > 0 && ` · ${dirtyCount} with unsaved changes`}
            </p>
          </div>

          {selectedPage && (
            <div className="flex items-center gap-2">
              {selectedPath && (
                <a
                  href={selectedPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-9 px-4 border border-neutral-300 bg-white font-medium text-neutral-800 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
                >
                  View page
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="inline-flex items-center gap-2 h-9 px-4 bg-blaze hover:bg-blazehover text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 shrink-0 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="w-4 h-4 shrink-0" aria-hidden="true" />
                )}
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          )}
        </div>

        {isDirty ? (
          <p
            role="status"
            className="flex items-start gap-2 px-6 py-2.5 border-t border-amber-200 bg-amber-50 text-amber-900 leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              You have unsaved changes on this page. They are kept while you look at other pages, but nothing reaches the website
              until you choose Save changes.
            </span>
          </p>
        ) : (
          <p className="flex items-start gap-2 px-6 py-2.5 border-t border-neutral-200 bg-neutral-50 text-neutral-600 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" aria-hidden="true" />
            <span>
              Choose a page, change the wording, then choose Save changes. Open View page in another tab to see where each field
              lands. If something on the site is not here, it is not editable yet, so email Sqysh.
            </span>
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 px-6 py-2.5 border-t border-red-200 bg-red-50 text-red-800 leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden gap-px bg-neutral-300 border-y border-neutral-300">
        <div className="w-56 xl:w-64 shrink-0 flex flex-col overflow-hidden bg-white">
          <div className="shrink-0 px-4 py-3 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">Pages</h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {pages.length === 0 ? (
              <p className="flex items-center justify-center h-24 px-4 text-center text-neutral-500">No pages found.</p>
            ) : (
              sortedPages.map((page) => {
                const active = selectedPage?.id === page.id
                const pending = !!drafts[page.id]

                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setSelectedPage(page)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full flex items-center gap-2 px-4 py-3 border-b border-neutral-200 last:border-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
                      active ? 'bg-blaze/5 border-l-2 border-l-blaze' : 'hover:bg-neutral-50'
                    }`}
                  >
                    <FileText
                      className={`w-4 h-4 shrink-0 ${active ? 'text-blaze-text' : 'text-neutral-400'}`}
                      aria-hidden="true"
                    />
                    <span className={`truncate ${active ? 'text-neutral-900 font-medium' : 'text-neutral-700'}`}>
                      {pageName(page.slug)}
                    </span>
                    {pending && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-label="Unsaved changes" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-neutral-100">
          {!selectedPage ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <FileText className="w-8 h-8 text-neutral-300" aria-hidden="true" />
              <p className="text-neutral-600">Choose a page on the left to edit its wording.</p>
              <p className="text-neutral-500">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'} available
              </p>
            </div>
          ) : content.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <FileText className="w-8 h-8 text-neutral-300" aria-hidden="true" />
              <p className="text-neutral-600">Nothing on this page is editable yet.</p>
              <p className="text-neutral-500">Email Sqysh with the wording you want changed.</p>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-3 max-w-3xl">
              {sections.map((section) => (
                <SectionBlock
                  key={section}
                  title={section}
                  fields={content.filter((f) => f.section === section)}
                  onFieldChange={updateField}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
