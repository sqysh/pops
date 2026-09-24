'use client'

import { useState } from 'react'
import type { News } from '@prisma/client'
import { useTableFilter } from '@/app/lib/hooks/useTableFilter'
import { TableEmptyState, TableFilterPills, TableSearch, TableShell } from '@/app/(authenticated)/v2/_components/TableShell'
import { COL, COLUMNS, VISIBILITY_OPTIONS } from '@/app/lib/constants/news.constants'
import { NewsRow } from '@/app/(authenticated)/v2/news/_components/NewsRow'
import { NewsDrawer } from './_components/NewsDrawer'

export function NewsClient({ news: initialNews }: { news: News[] }) {
  const [editingNews, setEditingNews] = useState<News | null | 'new'>(null)
  const [visibilityFilter, setVisibilityFilter] = useState('ALL')

  const { filtered, search, setSearch, sortKey, sortDir, toggleSort, clearFilters, isFiltered } = useTableFilter({
    data: initialNews,
    searchKeys: ['title', 'excerpt'],
    defaultSortKey: 'createdAt',
    defaultSortDir: 'desc',
    sortConfigs: {
      title: { getValue: (n) => n.title.toLowerCase() },
      excerpt: { getValue: (n) => n.excerpt.toLowerCase() },
      createdAt: { getValue: (n) => new Date(n.createdAt).getTime() },
      isPublished: { getValue: (n) => (n.isPublished ? 0 : 1) }
    }
  })

  const visibleFiltered = filtered.filter((n) => {
    if (visibilityFilter === 'LIVE') return n.isPublished
    if (visibilityFilter === 'DRAFT') return !n.isPublished
    return true
  })

  const liveCount = initialNews.filter((n) => n.isPublished).length
  const draftCount = initialNews.filter((n) => !n.isPublished).length

  const drawerOpen = editingNews !== null
  const isEdit = editingNews !== null && editingNews !== 'new'

  return (
    <>
      <NewsDrawer
        key={isEdit ? (editingNews as News).id : 'new'}
        open={drawerOpen}
        onClose={() => setEditingNews(null)}
        news={isEdit ? (editingNews as News) : null}
      />

      <TableShell
        label="NEWS"
        backHref="/v2/dashboard"
        count={initialNews.length}
        pills={[
          { label: 'Live', value: liveCount, accent: false },
          { label: 'Draft', value: draftCount, accent: false }
        ]}
        action={{ label: '+ New Article', onClick: () => setEditingNews('new') }}
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search articles..." />
            <div className="ml-auto">
              <TableFilterPills options={VISIBILITY_OPTIONS} active={visibilityFilter} onChange={setVisibilityFilter} />
            </div>
          </>
        }
        columns={COLUMNS}
        colClass={COL}
        sortKey={sortKey}
        sortDir={sortDir}
        toggleSort={toggleSort}
        filteredCount={visibleFiltered.length}
        totalCount={initialNews.length}
        empty={
          <TableEmptyState
            noun="articles"
            isFiltered={isFiltered || visibilityFilter !== 'ALL'}
            onClear={() => {
              clearFilters()
              setVisibilityFilter('ALL')
            }}
          />
        }
      >
        {visibleFiltered.map((n, i) => (
          <NewsRow key={n.id} news={n} index={i} onEdit={setEditingNews} />
        ))}
      </TableShell>
    </>
  )
}
