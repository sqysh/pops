import z from 'zod'
import { EMPTY_SPAM_GUARD, spamGuardFields } from './spam-guard.schema'

export const newsletterSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address').trim().toLowerCase(),
  phoneNumber: z.string().trim().max(25, 'That phone number looks too long').optional(),

  addr1: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  zip: z.string().trim().max(10, 'That zip code looks too long').optional(),

  isOption1: z.boolean(),
  isOption2: z.boolean(),
  isOption3: z.boolean(),
  isOption4: z.boolean(),

  isNewPatron: z.boolean(),
  agreedToPrivacyStatement: z
    .boolean()
    .refine((agreed) => agreed, 'Please agree to the storage and handling of your data before subscribing'),

  ...spamGuardFields
})

export type NewsletterFormInput = z.input<typeof newsletterSchema>
export type NewsletterFormValues = z.output<typeof newsletterSchema>

export const EMPTY_NEWSLETTER: NewsletterFormInput = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  addr1: '',
  city: '',
  state: '',
  zip: '',
  isOption1: false,
  isOption2: false,
  isOption3: false,
  isOption4: false,
  isNewPatron: false,
  agreedToPrivacyStatement: false,
  ...EMPTY_SPAM_GUARD
}
