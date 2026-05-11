import { CampApplication, Prisma } from '@prisma/client'

export type FullApplication = Prisma.CampApplicationGetPayload<{
  include: { Student: true; Address: true; Parent: true }
}>

export type CampApplicationWithRelations = CampApplication & {
  Student?: {
    firstName: string
    lastName: string
    grade: string
    school: string
    studentEmailAddress: string
    studentPhoneNumber: string
  } | null
  Parent?: {
    firstName: string
    lastName: string
    relationshipToStudent?: string | null
    parentEmailAddress: string
    parentPhoneNumber: string
  } | null
  Address?: {
    addressLine1?: string | null
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    zipPostalCode?: string | null
  } | null
}

export type FormState = {
  firstName: string
  lastName: string
  grade: string
  school: string
  studentEmailAddress: string
  studentPhoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipPostalCode: string
  parentFirstName: string
  parentLastName: string
  relationshipToStudent: string
  parentEmailAddress: string
  parentPhoneNumber: string
  instrument: string
  musicTeacher: string
  strings: string
  brassAndPercussion: string
  woodwinds: string
  referralSource: string
  consent: boolean
}
