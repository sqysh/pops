import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { hideToast } from '@/app/redux/features/toastSlice'

const Toast: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isVisible, type, message, description, duration = 7000 } = useAppSelector((state: RootState) => state.toast)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast())
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, type, dispatch, duration])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-primary-dark" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'info':
        return <Info className="w-4 h-4 text-muted-dark" />
    }
  }

  const getAccent = () => {
    switch (type) {
      case 'success':
        return 'border-l-emerald-500'
      case 'error':
        return 'border-l-primary-dark'
      case 'warning':
        return 'border-l-yellow-400'
      case 'info':
        return 'border-l-muted-dark'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%', transition: { duration: 0.2, ease: 'easeInOut' } }}
          transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
          className={`fixed bottom-4 right-4 left-4 sm:left-auto z-100 sm:max-w-sm bg-surface-dark border border-border-dark border-l-2 ${getAccent()} shadow-2xl px-4 py-3`}
        >
          <div className="flex items-center gap-3">
            <div className="shrink-0" aria-hidden="true">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-text-dark text-[11px] font-mono tracking-[0.2em] uppercase">{message}</p>
              {description && <p className="text-muted-dark text-[11px] mt-0.5 leading-relaxed">{description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dispatch(hideToast())}
              aria-label="Dismiss notification"
              className="shrink-0 w-6 h-6 flex items-center justify-center border border-border-dark hover:border-muted-dark text-muted-dark hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-dark"
            >
              <X className="w-3 h-3" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default Toast
