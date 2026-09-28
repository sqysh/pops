import z from 'zod'
import { EMPTY_SPAM_GUARD, spamGuardFields } from './spam-guard.schema'

export const questionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Please enter a valid email address').trim().toLowerCase(),
  message: z.string().trim().min(1, 'Message is required').max(5000),
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
