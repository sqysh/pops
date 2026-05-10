export type DateInput = string | number | Date | null | undefined

export interface DateFormatOptions {
  style?: 'short' | 'medium' | 'long' | 'full' | 'month-day'
  includeTime?: boolean
  fallback?: string
}

export const formatDate = (date: DateInput, options: DateFormatOptions & { includeSeconds?: boolean } = {}): string => {
  const { style = 'medium', includeTime = false, includeSeconds = false, fallback = 'Never' } = options

  if (!date) return fallback

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return fallback

  let formatOptions: Intl.DateTimeFormatOptions = {}

  switch (style) {
    case 'short':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break
    case 'medium':
      formatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break
    case 'long':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
      break
    case 'full':
      formatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }
      // Add seconds to full style if requested
      if (includeSeconds) {
        formatOptions.second = '2-digit'
      }
      break
    case 'month-day':
      formatOptions = {
        month: 'short',
        day: 'numeric'
      }
      break
  }

  if (includeTime && style !== 'full') {
    formatOptions.hour = 'numeric'
    formatOptions.minute = '2-digit'
    if (includeSeconds) {
      formatOptions.second = '2-digit'
    }
  }

  return new Intl.DateTimeFormat('en-US', {
    ...formatOptions,
    timeZone: 'America/New_York'
  }).format(dateObj)
}

// Convenience functions
export const formatDateShort = (date: DateInput) => formatDate(date, { style: 'short' })

export const formatDateLong = (date: DateInput) => formatDate(date, { style: 'long' })

export const formatDateTime = (date: DateInput) => formatDate(date, { style: 'medium', includeTime: true })

export const formatAppointmentDate = (date: DateInput) => formatDate(date, { style: 'long' })

export const formatForDateTimeLocal = (isoString: string) => {
  if (!isoString) return ''

  const date = new Date(isoString)
  // Format as local time
  const localISOString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
  return localISOString.slice(0, 19) // Remove Z and milliseconds
}

export const dateToInputFormat = (date: string | number | Date | null | undefined): string => {
  // Handle null/undefined
  if (!date) {
    return new Date().toISOString().split('T')[0]
  }

  try {
    const d = new Date(date)

    // Check if date is valid
    if (isNaN(d.getTime())) {
      return new Date().toISOString().split('T')[0] // Return today's date as fallback
    }

    return d.toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0] // Return today's date as fallback
  }
}

// formatDate(date)                               "Jan 15, 2024"
// formatDate(date, { style: 'short' })          "Jan 15, 2024"
// formatDate(date, { style: 'long' })           "Monday, January 15, 2024"
// formatDate(date, { includeTime: true })       "Jan 15, 2024, 2:30 PM"
// formatDate(null, { fallback: 'Not set' })     "Not set"

// Convenience functions:
// formatDateShort(date)      // "Jan 15, 2024"
// formatAppointmentDate(date) // "Monday, January 15, 2024"
// formatDateTime(date)       // "Jan 15, 2024, 2:30 PM"

// ===============================================================================

export const formatTime = (date: DateInput, options: { fallback?: string } = {}): string => {
  const { fallback = 'Invalid time' } = options

  if (!date) return fallback

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return fallback

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

// formatTime('2024-01-15T14:30:00')     // "2:30 PM"
// formatTime(new Date())                // "3:45 PM" (current time)
// formatTime(null)                      // "Invalid time"
// formatTime(null, { fallback: 'TBD' }) // "TBD"
// formatTime('invalid-date')            // "Invalid time"

// ===============================================================================

export const getTimeOfDay = (timeString: string) => {
  const time = new Date(timeString)
  const hour = time.getHours()

  if (hour < 9) return '🌅 Morning'
  if (hour < 12) return '☀️ Mid-Morning'
  if (hour < 17) return '🌤️ Afternoon'
  if (hour < 20) return '🌆 Evening'
  return '🌙 Night'
}

// "Just now", "5m ago", "2h ago", "3d ago"
export const formatTimeAgo = (dateInput: Date): string => {
  const now = new Date()
  const date = new Date(dateInput)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

// "2024-01-15T14:30" (for datetime-local inputs)
export const formatLocalDateTime = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

// "2024-01-15T14:30" (for datetime-local inputs)
export function getLocalISOString(date = new Date()) {
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

// true/false (checks if date is today)
export const isToday = (date: Date | string): boolean => {
  const today = new Date()
  const checkDate = new Date(date)
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  )
}

// { time: "2:30 PM", relative: "2h ago", date: "Jan 15" }
export const getTimeInfo = (date: Date) => ({
  time: formatTime(date),
  relative: formatTimeAgo(date),
  date: formatDate(date, { style: 'month-day' })
})

// COMMON VARIABLES
export const now = new Date()

export function toDateInput(date: Date | string) {
  return new Date(date).toISOString().split('T')[0]
}
