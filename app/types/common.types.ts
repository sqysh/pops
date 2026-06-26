export type SortKey = 'name' | 'level' | 'amount' | 'isActive' | 'createdAt'
export type SortDir = 'asc' | 'desc'

export type ActionResult<T = undefined> = {
  success: boolean
  data?: T
  error?: string
}
