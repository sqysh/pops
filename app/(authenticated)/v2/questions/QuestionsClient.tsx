'use client'

import { QuestionDrawer } from '@/app/components/drawers/QuestionDrawer'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/components/elements/TableShell'
import { COL, COLUMNS, STATUS_OPTIONS } from '@/app/lib/constants/question.constants'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { IQuestion } from '@/app/types/entities/question'
import { useState } from 'react'
import { QuestionRow } from '../../../components/rows/QuestionRow'
import { SpamPanel } from '@/app/components/panels/SpamPanel'

export function QuestionsClient({ questions: initialQuestions }: { questions: IQuestion[] }) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESPONDED' | 'FLAGGED' | 'SPAM'>('ALL')

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: questions,
    searchKeys: ['name', 'email', 'message'],
    defaultSortKey: 'createdAt',
    defaultSortDir: 'desc',
    sortConfigs: {
      name: { getValue: (q) => q.name.toLowerCase() },
      email: { getValue: (q) => q.email.toLowerCase() },
      createdAt: { getValue: (q) => new Date(q.createdAt).getTime() },
      hasResponded: { getValue: (q) => (q.hasResponded ? 1 : 0) }
    }
  })

  const visibleFiltered = filtered.filter((q) => {
    if (statusFilter === 'PENDING') return !q.hasResponded && !q.isSpam && !q.isPotentialSpam
    if (statusFilter === 'RESPONDED') return q.hasResponded
    if (statusFilter === 'FLAGGED') return q.isPotentialSpam && !q.isSpam
    if (statusFilter === 'SPAM') return q.isSpam
    return true
  })

  const pendingCount = questions.filter((q) => !q.hasResponded && !q.isSpam).length
  const respondedCount = questions.filter((q) => q.hasResponded).length
  const flaggedCount = questions.filter((q) => q.isPotentialSpam && !q.isSpam).length
  const spamCount = questions.filter((q) => q.isSpam).length

  function handleResponded(id: string, reply?: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, hasResponded: true, isPotentialSpam: false, replyMessage: reply } : q))
    )
  }

  function handleMarkedSpam(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isSpam: true, hasResponded: true } : q)))
  }

  return (
    <>
      <QuestionDrawer
        key={selectedQuestion?.id ?? 'none'}
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        onResponded={handleResponded}
        onMarkedSpam={handleMarkedSpam}
      />

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)'
        }}
        aria-hidden="true"
      />

      <TableShell
        label="QUESTIONS"
        backHref="/v2/dashboard"
        count={questions.length}
        pills={[
          { label: 'Pending', value: pendingCount, accent: pendingCount > 0 },
          { label: 'Flagged', value: flaggedCount, accent: flaggedCount > 0 },
          { label: 'Responded', value: respondedCount, accent: false }
        ]}
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search questions..." />
            <div className="ml-auto">
              <TableFilterPills
                options={STATUS_OPTIONS}
                active={statusFilter}
                onChange={(v) => setStatusFilter(v as typeof statusFilter)}
                accentColor="emerald"
              />
            </div>
          </>
        }
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={visibleFiltered.length}
        totalCount={questions.length}
        footerExtra={
          flaggedCount > 0 ? (
            <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400/60 tabular-nums">
              {flaggedCount} flagged for review
            </span>
          ) : pendingCount > 0 ? (
            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/60 tabular-nums">
              {pendingCount} awaiting reply
            </span>
          ) : (
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/60">All clear</span>
          )
        }
        empty={
          <TableEmptyState
            noun="questions"
            isFiltered={isFiltered || statusFilter !== 'ALL'}
            onClear={() => {
              clearFilters()
              setStatusFilter('ALL')
            }}
          />
        }
        marquee="Click any row to open · Reply directly from the drawer via Resend · Flagged messages are auto-detected on submission and shown in the main list · Mark as spam to move a message to the spam panel · Confirmed spam is hidden from the main list and shown below"
        marqueeNode={
          <span className="text-[10px] font-mono">
            <span className="text-amber-400">● Pending</span>
            <span className="text-muted-dark/30 mx-3">—</span>
            <span className="text-muted-dark">awaiting a reply</span>
            <span className="text-muted-dark/20 mx-6">·</span>
            <span className="text-emerald-400">● Responded</span>
            <span className="text-muted-dark/30 mx-3">—</span>
            <span className="text-muted-dark">reply has been sent</span>
            <span className="text-muted-dark/20 mx-6">·</span>
            <span className="text-orange-400">● Flagged</span>
            <span className="text-muted-dark/30 mx-3">—</span>
            <span className="text-muted-dark">auto-detected as potential spam, review and act</span>
            <span className="text-muted-dark/20 mx-6">·</span>
            <span className="text-red-400">● Spam</span>
            <span className="text-muted-dark/30 mx-3">—</span>
            <span className="text-muted-dark">confirmed spam, hidden from main list</span>
            <span className="text-muted-dark/20 mx-6">·</span>
          </span>
        }
        bottomPanel={
          spamCount > 0 && (
            <SpamPanel questions={questions} spamCount={spamCount} setSelectedQuestion={setSelectedQuestion} />
          )
        }
      >
        {visibleFiltered
          .filter((f) => !f.isSpam)
          .map((question, i) => (
            <QuestionRow key={question.id} question={question} index={i} onClick={setSelectedQuestion} />
          ))}
      </TableShell>
    </>
  )
}
