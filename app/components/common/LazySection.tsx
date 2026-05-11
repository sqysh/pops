import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Section } from './Section'
import { ModelSection } from './ModelSection'

export function LazySection<T extends { id: string }>({
  title,
  icon,
  fetcher,
  renderItem,
  onDelete,
  loading: deleteLoading
}: {
  title: string
  icon: React.ReactNode
  fetcher: () => Promise<T[]>
  renderItem: (item: T) => React.ReactNode
  onDelete: (id: string, setter: React.Dispatch<React.SetStateAction<T[] | null>>, current: T[]) => void
  loading: string | null
}) {
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetcher()
    setData(res)
    setLoading(false)
  }

  if (!data) {
    return (
      <Section title={title} icon={icon} count={null}>
        <button
          onClick={load}
          disabled={loading}
          className="w-full py-6 flex flex-col items-center gap-2 text-muted-dark/70 hover:text-text-dark hover:bg-surface-dark transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span className="text-[10px] font-mono tracking-[0.15em] uppercase">
            {loading ? 'Loading...' : `Load ${title}`}
          </span>
        </button>
      </Section>
    )
  }

  return (
    <ModelSection
      title={title}
      icon={icon}
      items={data}
      onDelete={(id) => onDelete(id, setData, data)}
      renderItem={renderItem}
      loading={deleteLoading}
    />
  )
}
