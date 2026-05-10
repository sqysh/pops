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
