export interface IQuestion {
  id: string
  name: string
  email: string
  message: string
  createdAt: Date
  hasResponded: boolean
  isSpam: boolean
  isPotentialSpam: boolean
  replyMessage?: string
  updatedAt: string | number | Date
}
