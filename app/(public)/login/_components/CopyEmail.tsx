'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/login'

const ADMIN_CONTACT_EMAIL = 'greg@sqysh.com'

export function CopyEmail({ content }: { content: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-text-dark underline underline-offset-2 hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
    >
      {ADMIN_CONTACT_EMAIL}
      {copied ? (
        <Check className="w-3 h-3 shrink-0 text-primary-dark" aria-hidden="true" />
      ) : (
        <Copy className="w-3 h-3 shrink-0 opacity-60" aria-hidden="true" />
      )}
      <span className="sr-only">{` ${copied ? t('login_copy_email_copied') : t('login_copy_email_hint')}`}</span>
    </button>
  )
}
