'use client'

import { useLinkStatus } from 'next/link'
import { Loader2 } from 'lucide-react'

/**
 * Swaps a link's icon for a spinner while the navigation is in flight.
 * Must be rendered inside a <Link>, which is where useLinkStatus reads from.
 */
export function LinkBody({
  icon,
  label,
  spinnerClass = 'w-3 h-3',
  iconAfter = false
}: {
  icon: React.ReactNode
  label: React.ReactNode
  spinnerClass?: string
  iconAfter?: boolean
}) {
  const { pending } = useLinkStatus()
  const glyph = pending ? <Loader2 className={`${spinnerClass} animate-spin`} aria-hidden="true" /> : icon

  return (
    <>
      {!iconAfter && glyph}
      {label}
      {iconAfter && glyph}
    </>
  )
}

/**
 * For links whose body is more than an icon and a label: a stat tile, a row
 * with a trailing value. Renders nothing until the navigation is pending, so
 * drop it wherever the spinner should appear.
 */
export function LinkSpinner({ className = 'w-3.5 h-3.5 text-neutral-400' }: { className?: string }) {
  const { pending } = useLinkStatus()

  if (!pending) return null

  return <Loader2 className={`${className} animate-spin shrink-0`} aria-hidden="true" />
}
