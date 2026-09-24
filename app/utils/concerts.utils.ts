export function seasonRange() {
  const now = new Date()
  const from = new Date(Date.UTC(now.getUTCFullYear(), 0, 1))
  const to = new Date(Date.UTC(now.getUTCFullYear() + 1, 11, 31))
  return { startsAtFrom: from.toISOString(), startsAtTo: to.toISOString() }
}
