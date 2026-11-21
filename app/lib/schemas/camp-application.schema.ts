import z from 'zod'
import { EMPTY_SPAM_GUARD, spamGuardFields } from './spam-guard.schema'

export const SKILL_LEVELS = ['', 'Beginner', 'Intermediate', 'Advanced'] as const

// messages are page content ids (camp-application page, 'Form Messages'), shown with msg()
const level = z.enum(SKILL_LEVELS, 'camp_error_level_invalid')
const required = (code: string) => z.string().trim().min(1, code)
const optional = z.string().trim().max(200, 'camp_error_too_long').optional()
const email = z.email('camp_error_email_invalid').trim().toLowerCase()

export const campApplicationSchema = z.object({
  firstName: required('camp_error_first_name_required'),
  lastName: required('camp_error_last_name_required'),
  grade: required('camp_error_grade_required'),
  school: required('camp_error_school_required'),
  studentEmailAddress: email,
  studentPhoneNumber: required('camp_error_phone_required'),

  addressLine1: required('camp_error_address_line_1_required'),
  addressLine2: optional,
  city: required('camp_error_city_required'),
  state: required('camp_error_state_required'),
  zipPostalCode: required('camp_error_zip_required'),

  parentFirstName: required('camp_error_parent_first_name_required'),
  parentLastName: required('camp_error_parent_last_name_required'),
  relationshipToStudent: optional,
  parentEmailAddress: email,
  parentPhoneNumber: required('camp_error_parent_phone_required'),

  instrument: required('camp_error_instrument_required'),
  musicTeacher: optional,
  strings: level,
  brassAndPercussion: level,
  woodwinds: level,
  referralSource: optional,

  consent: z.boolean().refine((agreed) => agreed, 'camp_error_consent_required'),

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
