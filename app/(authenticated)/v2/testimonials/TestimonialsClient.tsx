'use client'

import { useState } from 'react'
import type { Testimonial } from '@prisma/client'
import { TestimonialDrawer } from '../../../components/drawers/TestimonialDrawer'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '../../../components/elements/TableShell'
import { COL, COLUMNS, VISIBILITY_OPTIONS } from '@/app/lib/constants/testimonial.constants'
import { TestimonialRow } from '../../../components/rows/TestimonialRow'

export default function TestimonialsClient({ testimonials: initial }: { testimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initial)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null | 'new'>(null)
  const [visibilityFilter, setVisibilityFilter] = useState('ALL')

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: testimonials,
    searchKeys: ['author', 'quote', 'title'],
    defaultSortKey: 'author',
    sortConfigs: {
      author: { getValue: (t) => t.author.toLowerCase() },
      quote: { getValue: (t) => t.quote.toLowerCase() },
      isPublished: { getValue: (t) => (t.isPublished ? 0 : 1) }
    }
  })

  const visibleFiltered = filtered.filter((t) => {
    if (visibilityFilter === 'LIVE') return t.isPublished
    if (visibilityFilter === 'DRAFT') return !t.isPublished
    return true
  })

  const liveCount = testimonials.filter((t) => t.isPublished).length
  const draftCount = testimonials.filter((t) => !t.isPublished).length

  const drawerOpen = editingTestimonial !== null
  const isEdit = editingTestimonial !== null && editingTestimonial !== 'new'

  function handleSaved(t: Testimonial) {
    if (isEdit) {
      setTestimonials((prev) => prev.map((p) => (p.id === t.id ? t : p)))
    } else {
      setTestimonials((prev) => [t, ...prev])
    }
    setEditingTestimonial(null)
  }

  function handleDeleted(id: string) {
    setTestimonials((prev) => prev.filter((p) => p.id !== id))
    setEditingTestimonial(null)
  }

  return (
    <>
      <TestimonialDrawer
        key={isEdit ? (editingTestimonial as Testimonial).id : 'new'}
        open={drawerOpen}
        onClose={() => setEditingTestimonial(null)}
        testimonial={isEdit ? (editingTestimonial as Testimonial) : null}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />

      <TableShell
        label="TESTIMONIALS"
        backHref="/v2/dashboard"
        count={testimonials.length}
        pills={[
          { label: 'Live', value: liveCount, accent: false },
          { label: 'Draft', value: draftCount, accent: false }
        ]}
        action={{ label: '+ New Testimonial', onClick: () => setEditingTestimonial('new') }}
        marquee="Click any row to edit · Published testimonials appear on the public site · Drag to reorder coming soon"
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search testimonials..." />
            <div className="ml-auto">
              <TableFilterPills
                options={VISIBILITY_OPTIONS}
                active={visibilityFilter}
                onChange={setVisibilityFilter}
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
        totalCount={testimonials.length}
        empty={
          <TableEmptyState
            noun="testimonials"
            isFiltered={isFiltered || visibilityFilter !== 'ALL'}
            onClear={() => {
              clearFilters()
              setVisibilityFilter('ALL')
            }}
          />
        }
      >
        {visibleFiltered.map((t, i) => (
          <TestimonialRow key={t.id} testimonial={t} index={i} onEdit={setEditingTestimonial} />
        ))}
      </TableShell>
    </>
  )
}
