import z from 'zod'
import { EMPTY_SPAM_GUARD, spamGuardFields } from './spam-guard.schema'

export const questionSchema = z.object({
  // messages are page content ids (contact page, 'Form Messages'), shown with msg()
  name: z.string().trim().min(1, 'contact_error_name_required'),
  email: z.email('contact_error_email_invalid').trim().toLowerCase(),
  message: z.string().trim().min(1, 'contact_error_message_required').max(5000, 'contact_error_message_too_long'),
  ...spamGuardFields
})

export type QuestionFormInput = z.input<typeof questionSchema>
export type QuestionFormValues = z.output<typeof questionSchema>

export const EMPTY_QUESTION: QuestionFormInput = {
  name: '',
  email: '',
  message: '',
  ...EMPTY_SPAM_GUARD
}
