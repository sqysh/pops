import { FormState } from '@/app/types/entities/camp-application'
import { MapPin, Music, User, Users } from 'lucide-react'

export const COL = 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7rem_5rem_5rem_2rem]'
export const YEAR_COLORS = ['text-violet-400', 'text-emerald-400', 'text-sky-400', 'text-amber-400', 'text-red-400']

export const formSteps = [
  { id: 1, label: 'Student', icon: User },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Parent', icon: Users },
  { id: 4, label: 'Music', icon: Music }
]

export const labelClass = 'block text-[11px] font-mono tracking-[0.15em] uppercase text-white/60 mb-1.5'

export const inputClass = (error?: string) =>
  `w-full px-3 py-2.5 bg-black border text-white text-sm placeholder-white/20 font-lato focus:outline-none focus:ring-0 transition-colors ${
    error ? 'border-blaze focus:border-blaze' : 'border-white/10 focus:border-white/40 hover:border-white/20'
  }`

export const requiredByStep: Record<number, (keyof FormState)[]> = {
  1: ['firstName', 'lastName', 'grade', 'school', 'studentEmailAddress', 'studentPhoneNumber'],
  2: ['addressLine1', 'city', 'state', 'zipPostalCode'],
  3: ['parentFirstName', 'parentLastName', 'parentEmailAddress', 'parentPhoneNumber'],
  4: ['instrument', 'consent']
}

export const fieldLabels: Partial<Record<keyof FormState, string>> = {
  firstName: 'First name',
  lastName: 'Last name',
  grade: 'Grade',
  school: 'School',
  studentEmailAddress: 'Email address',
  studentPhoneNumber: 'Phone number',
  addressLine1: 'Address',
  city: 'City',
  state: 'State',
  zipPostalCode: 'ZIP code',
  parentFirstName: 'First name',
  parentLastName: 'Last name',
  parentEmailAddress: 'Email address',
  parentPhoneNumber: 'Phone number',
  instrument: 'Primary instrument',
  consent: 'You must agree to the terms to continue'
}

export const initialState = {
  firstName: '',
  lastName: '',
  grade: '',
  school: '',
  studentEmailAddress: '',
  studentPhoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipPostalCode: '',
  parentFirstName: '',
  parentLastName: '',
  relationshipToStudent: '',
  parentEmailAddress: '',
  parentPhoneNumber: '',
  instrument: '',
  musicTeacher: '',
  strings: '',
  brassAndPercussion: '',
  woodwinds: '',
  referralSource: '',
  consent: false
}

export const variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 })
}
