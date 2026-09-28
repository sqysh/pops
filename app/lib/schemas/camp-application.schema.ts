import z from 'zod'
import { EMPTY_SPAM_GUARD, spamGuardFields } from './spam-guard.schema'

export const SKILL_LEVELS = ['', 'Beginner', 'Intermediate', 'Advanced'] as const

const level = z.enum(SKILL_LEVELS)
const required = (label: string) => z.string().trim().min(1, `${label} is required`)
const optional = z.string().trim().max(200).optional()

export const campApplicationSchema = z.object({
  firstName: required('First name'),
  lastName: required('Last name'),
  grade: required('Grade'),
  school: required('School'),
  studentEmailAddress: z.email('Please enter a valid email address').trim().toLowerCase(),
  studentPhoneNumber: required('Phone number'),

  addressLine1: required('Address line 1'),
  addressLine2: optional,
  city: required('City'),
  state: required('State'),
  zipPostalCode: required('ZIP code'),

  parentFirstName: required('Parent first name'),
  parentLastName: required('Parent last name'),
  relationshipToStudent: optional,
  parentEmailAddress: z.email('Please enter a valid email address').trim().toLowerCase(),
  parentPhoneNumber: required('Parent phone number'),

  instrument: required('Primary instrument'),
  musicTeacher: optional,
  strings: level,
  brassAndPercussion: level,
  woodwinds: level,
  referralSource: optional,

  consent: z.boolean().refine((agreed) => agreed, 'Please confirm the terms before submitting'),

  ...spamGuardFields
})

export type CampApplicationFormInput = z.input<typeof campApplicationSchema>
export type CampApplicationFormValues = z.output<typeof campApplicationSchema>

/** Which fields each step is allowed to block on, for RHF's trigger(). */
export const STEP_FIELDS = {
  1: ['firstName', 'lastName', 'grade', 'school', 'studentEmailAddress', 'studentPhoneNumber'],
  2: ['addressLine1', 'city', 'state', 'zipPostalCode'],
  3: ['parentFirstName', 'parentLastName', 'parentEmailAddress', 'parentPhoneNumber'],
  4: ['instrument', 'consent']
} as const satisfies Record<number, readonly (keyof CampApplicationFormInput)[]>

export const EMPTY_CAMP_APPLICATION: CampApplicationFormInput = {
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
  consent: false,
  ...EMPTY_SPAM_GUARD
}
