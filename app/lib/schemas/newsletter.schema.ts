import z from 'zod'
import { EMPTY_SPAM_GUARD, spamGuardFields } from './spam-guard.schema'

export const newsletterSchema = z.object({
  // messages are page content ids (subscribe page, 'Form Messages'), shown with msg()
  firstName: z.string().trim().min(1, 'newsletter_error_first_name_required'),
  lastName: z.string().trim().min(1, 'newsletter_error_last_name_required'),
  email: z.email('newsletter_error_email_invalid').trim().toLowerCase(),
  phoneNumber: z.string().trim().max(25, 'newsletter_error_phone_too_long').optional(),

  addr1: z.string().trim().max(200, 'newsletter_error_address_too_long').optional(),
  city: z.string().trim().max(100, 'newsletter_error_city_too_long').optional(),
  state: z.string().trim().max(100, 'newsletter_error_state_too_long').optional(),
  zip: z.string().trim().max(10, 'newsletter_error_zip_too_long').optional(),

  isOption1: z.boolean(),
  isOption2: z.boolean(),
  isOption3: z.boolean(),
  isOption4: z.boolean(),

  isNewPatron: z.boolean(),
  agreedToPrivacyStatement: z.boolean().refine((agreed) => agreed, 'newsletter_error_privacy_required'),

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
