'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ChevronRight,
  EyeOff,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  X
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageConflict, updatePageContent } from '@/app/lib/actions/page/updatePageContent'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'
import { FormField, FormInput, FormTextarea, LABEL } from '@/app/(authenticated)/admin/_components/FormField'

type Value = string | string[]

export interface EditorField {
  id: string
  type: 'text' | 'textarea' | 'array'
  label: string
  section: string
  optional: boolean
  defaultValue: Value
  value: Value
}

export interface EditorPage {
  slug: string
  name: string
  path: string | null
  fields: EditorField[]
  /** Stored on the page but not read by the website any more. */
  unused: { id: string; label: string; value: string }[]
}

const TRAILING_SECTIONS = ['Form Labels', 'Form Messages', 'Image Descriptions', 'Screen Reader Text']

const same = (a: Value, b: Value) => JSON.stringify(a) === JSON.stringify(b)
const asText = (v: Value) => (Array.isArray(v) ? v.join('\n') : v)
const isBlank = (v: Value) => (Array.isArray(v) ? v.every((line) => !line.trim()) : !v.trim())
const placeholders = (v: Value) => Array.from(new Set(asText(v).match(/\{\w+\}/g) ?? []))

function ArrayField({ label, items, onChange }: { label: string; items: string[]; onChange: (value: string[]) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className={LABEL}>{label}</span>
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
                aria-label={`${label}, line ${i + 1}`}
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

function FieldHints({ field, value }: { field: EditorField; value: Value }) {
  const names = placeholders(field.defaultValue)
  const blank = isBlank(value)

  return (
    <>
      {names.length > 0 && (
        <p className="text-neutral-500 leading-relaxed">
          Keep {names.join(', ')} exactly as written. The website fills {names.length === 1 ? 'it' : 'them'} in.
        </p>
      )}
      {field.optional && <p className="text-neutral-500 leading-relaxed">Optional. Leave it blank to hide it on the website.</p>}
      {!field.optional && blank && !isBlank(field.defaultValue) && (
        <p className="flex items-start gap-1.5 text-amber-800 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            This can&apos;t be left blank, so the website will show the default instead: &ldquo;{asText(field.defaultValue)}
            &rdquo;
          </span>
        </p>
      )}
    </>
  )
}

function FieldInput({ field, value, onChange }: { field: EditorField; value: Value; onChange: (value: Value) => void }) {
  const changedFromDefault = !same(value, field.defaultValue)
  const reset = changedFromDefault && (
    <button
      type="button"
      onClick={() => onChange(field.defaultValue)}
      className="self-start inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze rounded-sm"
    >
      <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      Reset to default
    </button>
  )

  if (field.type === 'array') {
    return (
      <div className="flex flex-col gap-1.5">
        <ArrayField label={field.label} items={Array.isArray(value) ? value : []} onChange={onChange} />
        <FieldHints field={field} value={value} />
        {reset}
      </div>
    )
  }

  const text = asText(value)
  const long = field.type === 'textarea' || text.length > 80 || text.includes('\n') || asText(field.defaultValue).length > 80

  return (
    <div className="flex flex-col gap-1.5">
      <FormField label={field.label}>
        {long ? (
          <FormTextarea
            value={text}
            rows={Math.min(10, Math.max(3, Math.ceil(text.length / 90)))}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <FormInput type="text" value={text} onChange={(e) => onChange(e.target.value)} />
        )}
      </FormField>
      <FieldHints field={field} value={value} />
      {reset}
    </div>
  )
}

function SectionBlock({
  title,
  count,
  defaultOpen = true,
  children
}: {
  title: string
  count: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

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
          {count} {count === 1 ? 'field' : 'fields'}
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
            <div className="px-4 py-4 flex flex-col gap-5 border-t border-neutral-200">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function PageContentEditorClient({ pages, slug }: { pages: EditorPage[]; slug?: string }) {
  const router = useRouter()

  const [selectedSlug, setSelectedSlug] = useState<string | null>(pages.some((p) => p.slug === slug) ? slug! : null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conflicts, setConflicts] = useState<PageConflict[]>([])
  const [query, setQuery] = useState('')

  // edits are kept per page, so switching pages never carries one page's
  // fields onto another and never silently throws work away
  const [drafts, setDrafts] = useState<Record<string, Record<string, Value>>>({})

  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)

  const selectedPage = pages.find((p) => p.slug === selectedSlug) ?? null
  const pageDraft = (selectedSlug && drafts[selectedSlug]) || {}
  const isDirty = Object.keys(pageDraft).length > 0
  const dirtyCount = Object.values(drafts).filter((d) => Object.keys(d).length > 0).length

  const sortedPages = [...pages].sort((a, b) => a.name.localeCompare(b.name))

  useEffect(() => {
    if (dirtyCount === 0) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirtyCount])

  function updateField(field: EditorField, value: Value) {
    if (!selectedSlug) return

    setDrafts((prev) => {
      const next = { ...(prev[selectedSlug] ?? {}) }
      if (same(value, field.value)) delete next[field.id]
      else next[field.id] = value
      return { ...prev, [selectedSlug]: next }
    })
  }

  async function handleSave() {
    if (!selectedPage || !isDirty) return

    setError(null)
    setConflicts([])
    setSaving(true)

    // the wording each edited field had when this page was loaded, so the server can tell if someone else changed it since
    const base = Object.fromEntries(selectedPage.fields.filter((f) => f.id in pageDraft).map((f) => [f.id, f.value]))

    const result = await updatePageContent(selectedPage.slug, pageDraft, base)
    setSaving(false)

    if ('error' in result) {
      setError(result.error ?? 'Your changes could not be saved. Please try again.')
      if (result.conflicts?.length) {
        setConflicts(result.conflicts)
        // load what the other person saved; your edits stay in the boxes
        router.refresh()
      }
      return
    }

    savedSE()
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[selectedPage.slug]
      return next
    })
    router.refresh()
  }

  const q = query.trim().toLowerCase()
  const fields = (selectedPage?.fields ?? []).filter(
    (f) =>
      !q ||
      f.label.toLowerCase().includes(q) ||
      asText(pageDraft[f.id] ?? f.value)
        .toLowerCase()
        .includes(q)
  )
  // page sections in the order they appear on the page, then the same four
  // supporting sections last on every page
  const rank = (section: string) => TRAILING_SECTIONS.indexOf(section)
  const sections = Array.from(new Set(fields.map((f) => f.section))).sort((a, b) => rank(a) - rank(b))

  return (
    <div className="flex flex-col h-full min-h-125 bg-neutral-200 text-sm">
      <div className="shrink-0 bg-white border-b border-neutral-300">
        <div className="flex items-center justify-between gap-4 px-6 py-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-neutral-900">Page content</h1>
            <p className="text-neutral-600 mt-0.5 truncate">
              {selectedPage ? `Editing ${selectedPage.name}` : `${pages.length} pages`}
              {dirtyCount > 0 && ` · ${dirtyCount} with unsaved changes`}
            </p>
          </div>

          {selectedPage && (
            <div className="flex items-center gap-2">
              {selectedPage.path && (
                <a
                  href={selectedPage.path}
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
              Choose a page, change the wording, then choose Save changes. Sections run in the order they appear on the page, and
              image descriptions and screen reader text are at the bottom. Open View page in another tab to see where each field
              lands.
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

        {conflicts.length > 0 && (
          <div className="px-6 py-3 border-t border-red-200 bg-red-50 text-red-900 leading-relaxed">
            <p className="font-medium">Changed by someone else:</p>
            <ul className="mt-1 flex flex-col gap-1.5">
              {conflicts.map((c) => (
                <li key={c.id}>
                  <span className="font-medium">{c.label}</span>
                  <span className="block whitespace-pre-line text-red-800">Now saved as: {c.current || '(blank)'}</span>
                </li>
              ))}
            </ul>
          </div>
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
                const active = selectedSlug === page.slug
                const pending = Object.keys(drafts[page.slug] ?? {}).length > 0

                return (
                  <button
                    key={page.slug}
                    type="button"
                    onClick={() => {
                      setSelectedSlug(page.slug)
                      setQuery('')
                      setError(null)
                      setConflicts([])
                    }}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full flex items-center gap-2 px-4 py-3 border-b border-neutral-200 last:border-0 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blaze focus-visible:ring-inset ${
                      active ? 'bg-blaze/5 border-l-2 border-l-blaze' : 'hover:bg-neutral-50'
                    }`}
                  >
                    {page.fields.length === 0 ? (
                      <EyeOff className="w-4 h-4 shrink-0 text-neutral-300" aria-hidden="true" />
                    ) : (
                      <FileText
                        className={`w-4 h-4 shrink-0 ${active ? 'text-blaze-text' : 'text-neutral-400'}`}
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`truncate ${active ? 'text-neutral-900 font-medium' : page.fields.length === 0 ? 'text-neutral-400' : 'text-neutral-700'}`}
                    >
                      {page.name}
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
          ) : (
            <div className="p-4 flex flex-col gap-3 max-w-3xl">
              {selectedPage.fields.length > 0 && (
                <label className="relative block">
                  <span className="sr-only">Find a field on this page</span>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
                  <FormInput
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Find a field on ${selectedPage.name}`}
                    className="pl-9"
                  />
                </label>
              )}

              {selectedPage.fields.length === 0 && (
                <div className="flex items-start gap-2 border border-neutral-300 bg-white px-4 py-3 text-neutral-600 leading-relaxed">
                  <EyeOff className="w-4 h-4 shrink-0 mt-0.5 text-neutral-400" aria-hidden="true" />
                  <span>
                    The website no longer shows this page, so there is nothing to edit. Its saved wording is kept below.
                  </span>
                </div>
              )}

              {q && fields.length === 0 && <p className="px-1 text-neutral-500">No fields match &ldquo;{query}&rdquo;.</p>}

              {sections.map((section) => {
                const inSection = fields.filter((f) => f.section === section)
                return (
                  <SectionBlock key={`${selectedPage.slug}-${section}`} title={section} count={inSection.length}>
                    {inSection.map((field) => (
                      <FieldInput
                        key={field.id}
                        field={field}
                        value={pageDraft[field.id] ?? field.value}
                        onChange={(value) => updateField(field, value)}
                      />
                    ))}
                  </SectionBlock>
                )
              })}

              {selectedPage.unused.length > 0 && !q && (
                <SectionBlock
                  key={`${selectedPage.slug}-unused`}
                  title="Not shown on the website"
                  count={selectedPage.unused.length}
                  defaultOpen={selectedPage.fields.length === 0}
                >
                  <p className="text-neutral-600 leading-relaxed">
                    This wording is saved but the website does not use it, so changing it would have no effect. It is listed so
                    nothing saved is hidden from you.
                  </p>
                  {selectedPage.unused.map((field) => (
                    <div key={field.id} className="flex flex-col gap-1">
                      <span className={LABEL}>{field.label}</span>
                      <p className="whitespace-pre-line text-neutral-500">{field.value || '(blank)'}</p>
                    </div>
                  ))}
                </SectionBlock>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
