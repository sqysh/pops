import { SortDir } from '@/app/types/common.types'
import { useState, useMemo } from 'react'

interface SortConfig<T> {
  getValue: (row: T) => string | number
}

interface UseTableFilterOptions<T> {
  data: T[]
  searchKeys: (keyof T)[]
  sortConfigs?: Partial<Record<string, SortConfig<T>>>
  defaultSortKey?: string
  defaultSortDir?: SortDir
}

export function useTableFilter<T>({
  data,
  searchKeys,
  sortConfigs = {},
  defaultSortKey,
  defaultSortDir = 'asc'
}: UseTableFilterOptions<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string>(defaultSortKey ?? '')
  const [sortDir, setSortDir] = useState<SortDir>(defaultSortDir)
  const [filters, setFilters] = useState<Record<string, string>>({})

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function setFilter(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setSearch('')
    setFilters({})
  }

  const filtered = useMemo(() => {
    let list = [...data]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((row) =>
        searchKeys.some((k) =>
          String(row[k] ?? '')
            .toLowerCase()
            .includes(q)
        )
      )
    }

    for (const [key, value] of Object.entries(filters)) {
      if (!value || value === 'ALL') continue
      list = list.filter((row) => {
        const rowVal = (row as Record<string, unknown>)[key]

        // Handle boolean fields with ACTIVE/INACTIVE convention
        if (value === 'ACTIVE' || value === 'INACTIVE') {
          return value === 'ACTIVE' ? !!rowVal : !rowVal
        }

        // Handle LIVE/DRAFT convention (same pattern, different labels)
        if (value === 'LIVE' || value === 'DRAFT') {
          return value === 'LIVE' ? !!rowVal : !rowVal
        }

        // Default string match
        return String(rowVal ?? '').toUpperCase() === value.toUpperCase()
      })
    }

    // Sort
    if (sortKey) {
      const config = sortConfigs[sortKey]
      list.sort((a, b) => {
        const av = config?.getValue ? config.getValue(a) : ((a[sortKey] as string | number) ?? '')
        const bv = config?.getValue ? config.getValue(b) : ((b[sortKey] as string | number) ?? '')
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    return list
  }, [data, search, sortKey, searchKeys, filters, sortConfigs, sortDir])

  const isFiltered = search.trim() !== '' || Object.values(filters).some((v) => v && v !== 'ALL')

  return {
    filtered,
    search,
    setSearch,
    sortKey,
    sortDir,
    toggleSort,
    filters,
    setFilter,
    clearFilters,
    isFiltered
  }
}
