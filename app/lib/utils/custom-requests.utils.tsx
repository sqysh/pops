import { CustomRequestStatus } from '@/app/types/entities/custom-requests.types'
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react'

export const STATUS_CONFIG: Record<CustomRequestStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
    icon: <Clock className="w-2.5 h-2.5" />
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-sky-400 border-sky-400/30 bg-sky-400/5',
    icon: <AlertCircle className="w-2.5 h-2.5" />
  },
  COMPLETE: {
    label: 'Done',
    color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
    icon: <CheckCircle2 className="w-2.5 h-2.5" />
  },
  DECLINED: {
    label: 'Declined',
    color: 'text-muted-dark/70 border-border-dark',
    icon: <XCircle className="w-2.5 h-2.5" />
  }
}
