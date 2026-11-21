import { motion } from 'framer-motion'

export function DeleteConfirm({
  name,
  onConfirm,
  onCancel
}: {
  name: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="absolute right-0 top-full mt-1 z-50 bg-bg-dark border border-border-dark p-3 w-56 shadow-xl"
    >
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-dark mb-2">
        Delete <span className="text-text-dark">{name}</span>?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="text-[9px] font-mono uppercase tracking-widest px-2 py-1 border border-border-dark text-muted-dark hover:text-text-dark transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  )
}
