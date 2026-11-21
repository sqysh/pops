import { CampApplicationFormInput } from '@/app/lib/schemas/camp-application.schema'

export type FieldName = keyof CampApplicationFormInput

export interface FieldConfig {
  name: FieldName
  /** Page content id prefix: `${copyId}_label` and, with `placeholder`, `${copyId}_placeholder`. */
  copyId: string
  placeholder?: boolean
  type?: 'text' | 'email' | 'tel'
  required?: boolean
  select?: boolean
}

export const LAST_STEP = 4

/** Each inner array is one row, and its length decides the column count. */
export const STEP_ROWS: Record<number, FieldConfig[][]> = {
  1: [
    [
      { name: 'firstName', copyId: 'camp_field_first_name', placeholder: true, required: true },
      { name: 'lastName', copyId: 'camp_field_last_name', placeholder: true, required: true }
    ],
    [
      { name: 'grade', copyId: 'camp_field_grade', placeholder: true, required: true },
      { name: 'school', copyId: 'camp_field_school', placeholder: true, required: true }
    ],
    [{ name: 'studentEmailAddress', copyId: 'camp_field_student_email', placeholder: true, type: 'email', required: true }],
    [{ name: 'studentPhoneNumber', copyId: 'camp_field_student_phone', placeholder: true, type: 'tel', required: true }]
  ],
  2: [
    [{ name: 'addressLine1', copyId: 'camp_field_address_line_1', placeholder: true, required: true }],
    [{ name: 'addressLine2', copyId: 'camp_field_address_line_2', placeholder: true }],
    [
      { name: 'city', copyId: 'camp_field_city', placeholder: true, required: true },
      { name: 'state', copyId: 'camp_field_state', placeholder: true, required: true },
      { name: 'zipPostalCode', copyId: 'camp_field_zip', placeholder: true, required: true }
    ]
  ],
  3: [
    [
      { name: 'parentFirstName', copyId: 'camp_field_parent_first_name', placeholder: true, required: true },
      { name: 'parentLastName', copyId: 'camp_field_parent_last_name', placeholder: true, required: true }
    ],
    [{ name: 'relationshipToStudent', copyId: 'camp_field_relationship', placeholder: true }],
    [{ name: 'parentEmailAddress', copyId: 'camp_field_parent_email', placeholder: true, type: 'email', required: true }],
    [{ name: 'parentPhoneNumber', copyId: 'camp_field_parent_phone', placeholder: true, type: 'tel', required: true }]
  ],
  4: [
    [{ name: 'instrument', copyId: 'camp_field_instrument', placeholder: true, required: true }],
    [{ name: 'musicTeacher', copyId: 'camp_field_music_teacher', placeholder: true }],
    [
      { name: 'strings', copyId: 'camp_field_strings', select: true },
      { name: 'brassAndPercussion', copyId: 'camp_field_brass_percussion', select: true },
      { name: 'woodwinds', copyId: 'camp_field_woodwinds', select: true }
    ],
    [{ name: 'referralSource', copyId: 'camp_field_referral_source', placeholder: true }]
  ]
}

export const COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 430:grid-cols-2',
  3: 'grid-cols-3'
}

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
