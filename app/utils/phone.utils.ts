export const formatPhoneNumberForMailchimp = (phone?: string | null) => {
  if (!phone) return ''

  const digitsOnly = phone.replace(/\D/g, '')

  // If it starts with 1 and is 11 digits, strip the 1
  const cleaned = digitsOnly.length === 11 && digitsOnly.startsWith('1') ? digitsOnly.slice(1) : digitsOnly

  // Format only if it's exactly 10 digits now
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return ''
}
