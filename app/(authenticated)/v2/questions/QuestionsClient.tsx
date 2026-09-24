'use client'

import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/(authenticated)/v2/_components/TableShell'
import { COL, COLUMNS, STATUS_OPTIONS } from '@/app/lib/constants/question.constants'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { IQuestion } from '@/app/types/entities/question'
import { useState } from 'react'
import { QuestionRow } from './_components/QuestionRow'
import { QuestionDrawer } from './_components/QuestionDrawer'

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
  const respondedCount = questions.length - pendingCount

  function handleResponded(id: string, reply?: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, hasResponded: true, replyMessage: reply } : q)))
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

      <TableShell
        label="Inquiries"
        backHref="/v2/dashboard"
        count={questions.length}
        pills={[
          { label: 'Need a reply', value: pendingCount, accent: pendingCount > 0 },
          { label: 'Replied', value: respondedCount, accent: false }
        ]}
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search inquiries..." />
            <div className="ml-auto">
              <TableFilterPills
                options={STATUS_OPTIONS}
                active={statusFilter}
                onChange={(v) => setStatusFilter(v as typeof statusFilter)}
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
            <span className="text-amber-800 tabular-nums">{pendingCount} awaiting reply</span>
          ) : (
            <span className="text-emerald-700">All caught up</span>
          )
        }
        empty={
          <TableEmptyState
            noun="inquiries"
            isFiltered={isFiltered || statusFilter !== 'ALL'}
            onClear={() => {
              clearFilters()
              setStatusFilter('ALL')
            }}
          />
        }
      >
        {visibleFiltered.map((question, i) => (
          <QuestionRow key={question.id} question={question} index={i} onClick={setSelectedQuestion} />
        ))}
      </TableShell>
    </>
  )
}
