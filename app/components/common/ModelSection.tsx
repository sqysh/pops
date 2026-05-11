import { Trash2 } from 'lucide-react'
import { Section } from './Section'

export function ModelSection<T extends { id: string }>({
  title,
  icon,
  items,
  onDelete,
  renderItem,
  loading
}: {
  title: string
  icon: React.ReactNode
  items: T[]
  onDelete: (id: string) => void
  renderItem: (item: T) => React.ReactNode
  loading: string | null
}) {
  return (
    <Section title={title} icon={icon} count={items.length}>
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 p-2 bg-bg-dark hover:bg-bg-dark/50 transition-colors"
          >
            <p className="text-[11px] text-text-dark truncate flex-1">{renderItem(item)}</p>
            <button
              onClick={() => onDelete(item.id)}
              disabled={loading === item.id}
              className="text-muted-dark hover:text-red-400 transition-colors shrink-0 disabled:opacity-30"
              aria-label={`Delete ${title.slice(0, -1)}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </Section>
  )
}
