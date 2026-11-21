'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Clock, Shield, Mail, Lock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/auth-error'

/** Title and message for a sign in error code. Pass no content to get the default
 *  (English) wording, e.g. for logs. */
export const getAuthErrorMessage = (error: string | null, content: unknown = []) => {
  const { t } = pageCopy(content, pageContent)
  const info = (icon: typeof AlertTriangle, key: string) => ({
    icon,
    title: t(`auth_error_${key}_title`),
    message: t(`auth_error_${key}_message`)
  })

  switch (error) {
    case 'AccessDenied':
      return info(Shield, 'access_denied')
    case 'Verification':
      return info(Clock, 'link_expired')
    case 'EmailSignin':
      return info(Mail, 'email_failed')
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'Configuration':
      return info(AlertTriangle, 'cancelled')
    case 'SessionRequired':
      return info(Lock, 'session_required')
    default:
      return info(AlertTriangle, 'unknown')
  }
}

export default function AuthErrorClient({ content }: { content: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorInfo = getAuthErrorMessage(error, content)
  const Icon = errorInfo.icon

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-bg-dark px-4 py-12 relative overflow-hidden"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle, #ff4d6d 1px, transparent 1px)`,
          backgroundSize: '28px 28px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[320px] sm:max-w-sm"
      >
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <Link
            href="/"
            aria-label={t('auth_error_logo_label')}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark inline-block"
          >
            <div className="flex items-center gap-3">
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
              <span className="text-sm font-mono tracking-[0.3em] uppercase text-text-dark">{t('auth_error_logo_text')}</span>
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <section aria-labelledby="error-heading">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary-dark" aria-hidden="true" />
              <span className="text-sm font-mono tracking-[0.25em] uppercase text-primary-dark">{t('auth_error_eyebrow')}</span>
            </div>
            <h1 id="error-heading" className="font-quicksand font-black text-3xl sm:text-4xl text-text-dark leading-tight">
              {t('auth_error_heading')}
            </h1>
            <p className="text-muted-dark text-sm mt-3 leading-relaxed">{t('auth_error_intro')}</p>
          </div>

          {/* Error detail */}
          <div
            className="flex items-start gap-3 px-4 py-4 bg-surface-dark border border-border-dark border-l-2 border-l-primary-dark mb-8"
            role="alert"
            aria-live="polite"
          >
            <Icon className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-text-dark text-sm font-medium mb-0.5">{errorInfo.title}</p>
              <p className="text-muted-dark text-sm leading-relaxed">{errorInfo.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3" role="group" aria-label={t('auth_error_actions_label')}>
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              {t('auth_error_back_to_sign_in')}
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-dark hover:bg-button-dark border border-border-dark hover:border-primary-dark text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
            >
              {t('auth_error_back_home')}
            </Link>
          </div>

          {/* Error code */}
          {error && (
            <p className="text-sm font-mono text-muted-dark/20 uppercase tracking-widest text-center mt-3">
              <span className="sr-only">{`${t('auth_error_code_label')} `}</span>
              {error}
            </p>
          )}
        </section>
      </motion.div>
    </main>
  )
}
