import { MapPin, Music, User, Users } from 'lucide-react'

export const COL = 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7rem_5rem_5rem_2rem]'
export const YEAR_COLORS = ['text-violet-700', 'text-emerald-700', 'text-sky-700', 'text-amber-800', 'text-red-700']

/** Step names are page content (camp_step_<id>_label on the camp-application page). */
export const formSteps = [
  { id: 1, icon: User },
  { id: 2, icon: MapPin },
  { id: 3, icon: Users },
  { id: 4, icon: Music }
]

export const variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 })
}
