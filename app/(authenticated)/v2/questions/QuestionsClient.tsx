'use client'

import { QuestionDrawer } from '@/app/components/drawers/QuestionDrawer'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/components/elements/TableShell'
import { COL, COLUMNS, STATUS_OPTIONS } from '@/app/lib/constants/question.constants'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { IQuestion } from '@/app/types/entities/question'
import { useState } from 'react'
import { QuestionRow } from '../../../components/rows/QuestionRow'

export function QuestionsClient({ questions: initialQuestions }: { questions: IQuestion[] }) {
  const [questions, setQuestions] = useState(initialQuestions)
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESPONDED'>('ALL')

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
    if (statusFilter === 'PENDING') return !q.hasResponded
    if (statusFilter === 'RESPONDED') return q.hasResponded
    return true
  })

  const pendingCount = questions.filter((q) => !q.hasResponded).length
  const respondedCount = questions.filter((q) => q.hasResponded).length

  function handleResponded(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, hasResponded: true } : q)))
  }

  function handleDeleted(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  return (
    <>
      <QuestionDrawer
        key={selectedQuestion?.id ?? 'none'}
        question={selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        onResponded={handleResponded}
        onDeleted={handleDeleted}
      />

      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />
      {/* Scanline overlay */}
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
          { label: 'Responded', value: respondedCount }
        ]}
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search questions..." />
            <div className="ml-auto">
              <TableFilterPills
                options={STATUS_OPTIONS}
                active={statusFilter}
                onChange={(v) => setStatusFilter(v as 'ALL' | 'PENDING' | 'RESPONDED')}
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
          pendingCount > 0 ? (
            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/60 tabular-nums">
              {pendingCount} awaiting reply
            </span>
          ) : (
            <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/50">All clear</span>
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
        marquee="Click any row to open the question · Reply via the drawer · Response is sent directly to the patron's email via Resend · Marking as done removes it from the pending count"
      >
        {visibleFiltered.map((question, i) => (
          <QuestionRow key={question.id} question={question} index={i} onClick={setSelectedQuestion} />
        ))}
      </TableShell>
    </>
  )
}
