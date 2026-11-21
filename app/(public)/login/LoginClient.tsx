'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { getAuthErrorMessage } from '../auth/error/AuthErrorClient'
import { logAuthError } from '@/app/lib/actions/log/logAuthError'
import { motion } from 'framer-motion'
import { CopyEmail } from './_components/CopyEmail'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/login'

export default function LoginClient({ content, authErrorContent }: { content: unknown; authErrorContent: unknown }) {
  const { t } = pageCopy(content, pageContent)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const errorInfo = useMemo(
    () => (urlError ? getAuthErrorMessage(urlError, authErrorContent) : null),
    [urlError, authErrorContent]
  )
  const [helpBefore, helpAfter = ''] = t('login_help_text').split('{email}')

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true)
    await signIn('google', { redirectTo: '/admin/dashboard' })
  }

  useEffect(() => {
    const KNOWN_ERRORS = new Set([
      'AccessDenied',
      'Verification',
      'EmailSignin',
      'OAuthSignin',
      'OAuthCallback',
      'SessionRequired',
      'Configuration'
    ])
    if (!urlError || urlError === 'undefined' || urlError === 'null' || !errorInfo) return

    // Logs keep the default English wording, whatever the page shows.
    const logged = getAuthErrorMessage(urlError)
    logAuthError({
      error: urlError,
      title: logged.title,
      message: logged.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      email: localStorage.getItem('lastMagicLinkEmail') ?? undefined,
      isKnownError: KNOWN_ERRORS.has(urlError)
    })
  }, [urlError, errorInfo])

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
        <div className="mb-10 flex justify-center">
          <Link
            href="/"
            aria-label={t('login_logo_label')}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark inline-block"
          >
            <div className="flex items-center gap-3">
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-text-dark">{t('login_logo_text')}</span>
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <section aria-labelledby="signin-heading">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 border border-border-dark bg-surface-dark px-2.5 py-1 mb-4">
              <Lock className="w-3 h-3 text-primary-dark shrink-0" aria-hidden="true" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-dark">{t('login_badge')}</span>
            </div>
            <h1 id="signin-heading" className="font-quicksand font-black text-3xl sm:text-4xl text-text-dark leading-tight">
              {t('login_heading')}
            </h1>
            <p className="text-muted-dark text-sm mt-3 leading-relaxed">{t('login_intro')}</p>
          </div>

          {/* Error */}
          {errorInfo && (
            <div
              role="alert"
              className="border border-primary-dark/40 bg-primary-dark/5 px-4 py-3.5 mb-6 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-text-dark text-sm font-medium leading-snug">{errorInfo.title}</p>
                <p className="text-muted-dark text-sm mt-1 leading-relaxed">{errorInfo.message}</p>
              </div>
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            aria-label={loadingGoogle ? t('login_google_loading_label') : t('login_google_label')}
            aria-busy={loadingGoogle}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-surface-dark hover:bg-button-dark border border-border-dark hover:border-primary-dark text-text-dark text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
          >
            {loadingGoogle ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                <span>{t('login_google_loading')}</span>
                <span className="sr-only">{t('login_google_loading_hint')}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>{t('login_google_button')}</span>
              </>
            )}
          </button>

          <p className="text-muted-dark text-xs leading-relaxed mt-4 text-center">
            {helpBefore}
            <CopyEmail content={content} />
            {helpAfter}
          </p>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-border-dark flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-muted-dark text-xs hover:text-text-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
          >
            {t('login_back_link')}
          </Link>
          <span className="text-muted-dark/60 text-[10px] font-mono uppercase tracking-widest">{t('login_admin_tag')}</span>
        </div>
      </motion.div>
    </main>
  )
}
