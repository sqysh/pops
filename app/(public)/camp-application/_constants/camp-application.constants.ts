import { CampApplicationFormInput } from '@/app/lib/schemas/camp-application.schema'

export type FieldName = keyof CampApplicationFormInput

export interface FieldConfig {
  name: FieldName
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel'
  required?: boolean
  select?: boolean
}

export const LAST_STEP = 4

/** Each inner array is one row, and its length decides the column count. */
export const STEP_ROWS: Record<number, FieldConfig[][]> = {
  1: [
    [
      { name: 'firstName', label: 'First name', placeholder: 'Jane', required: true },
      { name: 'lastName', label: 'Last name', placeholder: 'Doe', required: true }
    ],
    [
      { name: 'grade', label: 'Grade', placeholder: '9th', required: true },
      { name: 'school', label: 'School', placeholder: 'Sarasota High', required: true }
    ],
    [
      {
        name: 'studentEmailAddress',
        label: 'Email address',
        placeholder: 'jane@email.com',
        type: 'email',
        required: true
      }
    ],
    [{ name: 'studentPhoneNumber', label: 'Phone number', placeholder: '(941) 555-0100', type: 'tel', required: true }]
  ],
  2: [
    [{ name: 'addressLine1', label: 'Address line 1', placeholder: '123 Main St', required: true }],
    [{ name: 'addressLine2', label: 'Address line 2', placeholder: 'Apt, suite, etc. (optional)' }],
    [
      { name: 'city', label: 'City', placeholder: 'Sarasota', required: true },
      { name: 'state', label: 'State', placeholder: 'FL', required: true },
      { name: 'zipPostalCode', label: 'ZIP code', placeholder: '34230', required: true }
    ]
  ],
  3: [
    [
      { name: 'parentFirstName', label: 'First name', placeholder: 'John', required: true },
      { name: 'parentLastName', label: 'Last name', placeholder: 'Doe', required: true }
    ],
    [{ name: 'relationshipToStudent', label: 'Relationship to student', placeholder: 'Parent, guardian, etc.' }],
    [
      {
        name: 'parentEmailAddress',
        label: 'Email address',
        placeholder: 'john@email.com',
        type: 'email',
        required: true
      }
    ],
    [{ name: 'parentPhoneNumber', label: 'Phone number', placeholder: '(941) 555-0101', type: 'tel', required: true }]
  ],
  4: [
    [{ name: 'instrument', label: 'Primary instrument', placeholder: 'Violin, trumpet, flute...', required: true }],
    [{ name: 'musicTeacher', label: 'Music teacher (optional)', placeholder: "Teacher's name" }],
    [
      { name: 'strings', label: 'Strings', select: true },
      { name: 'brassAndPercussion', label: 'Brass and perc.', select: true },
      { name: 'woodwinds', label: 'Woodwinds', select: true }
    ],
    [{ name: 'referralSource', label: 'How did you hear about us?', placeholder: 'Friend, social media, school...' }]
  ]
}

export const STEP_HEADINGS: Record<number, string> = {
  1: 'Student information',
  2: 'Home address',
  3: 'Parent or guardian',
  4: 'Music details'
}

export const COLS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 430:grid-cols-2',
  3: 'grid-cols-3'
}

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
