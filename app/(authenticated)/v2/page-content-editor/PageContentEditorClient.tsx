'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronRight, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Page } from '@prisma/client'
import { updatePageContent } from '@/app/lib/actions/page/updatePageContent'
import useSoundEffect from '@/app/lib/hooks/useSoundEffect'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageField {
  id: string
  type: 'text' | 'textarea' | 'array'
  label: string
  value: string | string[]
  section: string
}

// ─── FieldInput ───────────────────────────────────────────────────────────────

function FieldInput({ field, onChange }: { field: PageField; onChange: (value: string | string[]) => void }) {
  const inputCls =
    'w-full px-3 py-2 bg-bg-dark border border-border-dark text-[12px] font-mono text-text-dark placeholder:text-muted-dark/60 outline-none focus:border-muted-dark/40 transition-colors'

  if (field.type === 'array' && Array.isArray(field.value)) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">{field.label}</span>
        <div className="flex flex-col gap-1.5">
          {(field.value as string[]).map((item, i) => (
            <input
              key={i}
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...(field.value as string[])]
                next[i] = e.target.value
                onChange(next)
              }}
              className={inputCls}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">{field.label}</span>
      {field.type === 'textarea' ? (
        <textarea
          value={field.value as string}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={field.value as string}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </div>
  )
}

// ─── SectionBlock ─────────────────────────────────────────────────────────────

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
    <div className="border border-border-dark">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-surface-dark hover:bg-black/40 transition-colors text-left focus-visible:outline-none border-b border-border-dark"
      >
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="w-3 h-3 text-muted-dark" />
        </motion.div>
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-muted-dark">{title}</span>
        <span className="text-[9px] font-mono text-muted-dark ml-1">({fields.length})</span>
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
            <div className="px-3 py-4 flex flex-col gap-4">
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

// ─── PageFieldEditor ──────────────────────────────────────────────────────────

function PageFieldEditor({ page, onContentChange }: { page: Page; onContentChange: (content: PageField[]) => void }) {
  const [content, setContent] = useState<PageField[]>(page.content as unknown as PageField[])

  function updateField(id: string, value: string | string[]) {
    setContent((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, value } : f))
      onContentChange(next)
      return next
    })
  }

  const sections = Array.from(new Set(content.map((f) => f.section)))

  return (
    <div className="p-4 flex flex-col gap-3">
      {sections.map((section, i) => (
        <motion.div
          key={section}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <SectionBlock
            title={section}
            fields={content.filter((f) => f.section === section)}
            onFieldChange={updateField}
          />
        </motion.div>
      ))}
    </div>
  )
}

// ─── PageContentEditorClient ──────────────────────────────────────────────────

export default function PageContentEditorClient({ pages, slug }: { pages: Page[]; slug?: string }) {
  const router = useRouter()
  const [selectedPage, setSelectedPage] = useState<Page | null>(pages.find((p) => p.slug === slug) ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const contentRef = useRef<PageField[]>([])
  const { play: savedSE } = useSoundEffect('/mp3/se-1.mp3', true)

  async function handleSave() {
    if (!selectedPage) return
    setError(null)
    setSaving(true)
    const result = await updatePageContent(selectedPage.id, contentRef.current)
    setSaving(false)
    if (result.success) {
      savedSE()
      router.refresh()
    } else {
      setError(result.error ?? 'Failed to save')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="bg-black shrink-0 border-b border-border-dark">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/v2/dashboard"
              className="text-[10px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors focus-visible:outline-none"
            >
              &larr; Dashboard
            </Link>
            <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            <span className="text-[11px] font-mono text-muted-dark uppercase tracking-widest">[ PAGE CONTENT ]</span>
            {selectedPage && (
              <>
                <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
                <span className="text-[11px] font-mono text-text-dark uppercase tracking-widest">
                  {selectedPage.slug}
                </span>
              </>
            )}
            <div className="w-px h-3 bg-border-dark" aria-hidden="true" />
            <span className="text-[11px] font-mono text-muted-dark">{pages.length} pages</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedPage && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-emerald-400/40 text-emerald-400 bg-emerald-400/5 hover:bg-emerald-400/10 transition-colors disabled:opacity-50 focus-visible:outline-none"
              >
                {saving ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Save className="w-2.5 h-2.5" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t border-border-dark/40 bg-white/2 overflow-hidden py-1">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex whitespace-nowrap"
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-[11px] font-mono text-muted-dark pr-12">
                <span className="text-primary-dark">▸</span> Select a page on the left
                <span className="text-muted-dark/30 mx-3">·</span>
                Make your changes in the fields
                <span className="text-muted-dark/30 mx-3">·</span>
                Hit <span className="text-text-dark">Save Changes</span> when done
                <span className="text-muted-dark/30 mx-3">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="shrink-0 border-b border-red-500/30 bg-red-500/5 px-4 py-2">
          <span className="text-[11px] font-mono text-red-400">{error}</span>
        </div>
      )}

      {/* Body — two column */}
      <div className="flex-1 min-h-0 flex overflow-hidden bg-surface-dark m-2">
        {/* Left — page list */}
        <div className="w-48 xl:w-60 shrink-0 border-r border-border-dark flex flex-col overflow-hidden">
          <div className="shrink-0 px-3 py-2 border-b border-border-dark bg-surface-dark">
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-dark">Pages</span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {pages.length === 0 ? (
              <div className="flex items-center justify-center h-24">
                <span className="text-[11px] font-mono uppercase tracking-widest text-muted-dark/60">
                  No pages found
                </span>
              </div>
            ) : (
              pages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedPage(page)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 border-b border-border-dark/40 last:border-0 text-left transition-colors focus-visible:outline-none group ${
                    selectedPage?.id === page.id
                      ? 'bg-primary-dark/5 border-l-2 border-l-primary-dark'
                      : 'hover:bg-black'
                  }`}
                >
                  <FileText
                    className={`w-2.5 h-2.5 shrink-0 ${selectedPage?.id === page.id ? 'text-primary-dark' : 'text-muted-dark/90'}`}
                  />
                  <span
                    className={`text-[12px] font-mono truncate ${selectedPage?.id === page.id ? 'text-text-dark' : 'text-muted-dark group-hover:text-text-dark'}`}
                  >
                    {page.slug}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right — field editor */}
        <div className="flex-1 min-w-0 min-h-0 overflow-y-auto">
          {!selectedPage ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <FileText className="w-8 h-8 text-border-dark" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-dark/60">
                Select a page to edit
              </span>
              <span className="text-[10px] font-mono text-muted-dark/20">
                {pages.length} page{pages.length !== 1 ? 's' : ''} available
              </span>
            </div>
          ) : (
            <PageFieldEditor
              key={selectedPage.id}
              page={selectedPage}
              onContentChange={(content) => {
                contentRef.current = content
              }}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border-dark bg-surface-dark">
        <Link
          href="/v2/dashboard"
          className="text-[11px] font-mono uppercase tracking-widest text-muted-dark hover:text-primary-dark transition-colors"
        >
          &larr; Dashboard
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted-dark tabular-nums">
          {selectedPage ? `Editing ${selectedPage.slug}` : `${pages.length} pages`}
        </span>
      </div>
    </div>
  )
}
