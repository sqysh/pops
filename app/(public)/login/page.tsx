'use client'

import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { getAuthErrorMessage } from '../auth/error/page'
import { logAuthError } from '@/app/lib/actions/log/logAuthError'
import { motion } from 'framer-motion'

export default function Login() {
  // const [email, setEmail] = useState('')
  // const [sent, setSent] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  // const [loadingMagicLink, setLoadingMagicLink] = useState(false)
  // const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const errorInfo = useMemo(() => (urlError ? getAuthErrorMessage(urlError) : null), [urlError])

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true)
    await signIn('google', { redirectTo: '/login' })
  }

  // const handleMagicLinkSignIn = async () => {
  //   if (!email.trim() || loadingMagicLink) return
  //   setLoadingMagicLink(true)
  //   setError(null)
  //   try {
  //     const res = await signIn('email', { email, redirect: false, redirectTo: '/login' })
  //     if (res?.error) {
  //       throw new Error(res.error)
  //     }
  //     setSent(true)
  //   } catch {
  //     setError('Something went wrong. Please try again.')
  //   } finally {
  //     setLoadingMagicLink(false)
  //   }
  // }

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

    logAuthError({
      error: urlError,
      title: errorInfo.title,
      message: errorInfo.message,
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
        <div className="mb-12 flex justify-center">
          <Link
            href="/"
            aria-label="The Pops Orchestra — return to homepage"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark inline-block"
          >
            <div className="flex items-center gap-3">
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-text-dark">
                The Pops Orchestra
              </span>
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <section aria-labelledby="signin-heading">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary-dark" aria-hidden="true" />
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-primary-dark">All Access</span>
            </div>
            <h1
              id="signin-heading"
              className="font-quicksand font-black text-3xl sm:text-4xl text-text-dark leading-tight"
            >
              Sign In
            </h1>
            <p className="text-muted-dark text-sm mt-3 leading-relaxed">Access your account to continue</p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loadingGoogle}
            aria-label={loadingGoogle ? 'Signing in, please wait' : 'Sign in with Google'}
            aria-busy={loadingGoogle}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-surface-dark hover:bg-button-dark border border-border-dark hover:border-primary-dark text-text-dark text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
          >
            {loadingGoogle ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                <span>Signing in...</span>
                <span className="sr-only">Please wait</span>
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          {/* <div className="flex items-center gap-3 my-5" role="separator" aria-label="or">
            <div className="flex-1 h-px bg-border-dark" aria-hidden="true" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-muted-dark">or</span>
            <div className="flex-1 h-px bg-border-dark" aria-hidden="true" />
          </div> */}

          {/* Magic Link */}
          {/* {sent ? (
            <div>
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-3 px-4 py-4 bg-surface-dark border border-border-dark border-l-2 border-l-primary-dark mb-4"
              >
                <Mail className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-text-dark text-sm font-medium mb-0.5">Check your inbox</p>
                  <p className="text-muted-dark text-sm leading-relaxed">
                    Link sent to <span className="text-text-dark">{email}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSent(false)
                  setEmail('')
                }}
                className="group inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] uppercase text-muted-dark hover:text-primary-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                <span>Use a different email</span>
              </button>
            </div>
          ) : (
            <div>
              <label
                htmlFor="magic-link-email"
                className="block text-[11px] font-mono tracking-[0.25em] uppercase text-muted-dark mb-2"
              >
                Email address
              </label>
              <div className="flex gap-2">
                <input
                  id="magic-link-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMagicLinkSignIn()}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loadingMagicLink}
                  aria-describedby={error ? 'magic-link-error magic-link-hint' : 'magic-link-hint'}
                  className="flex-1 min-w-0 px-4 py-3 bg-surface-dark border border-border-dark focus:border-primary-dark text-text-dark text-sm placeholder:text-muted-dark/70 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleMagicLinkSignIn}
                  disabled={loadingMagicLink || !email.trim()}
                  aria-label={loadingMagicLink ? 'Sending link, please wait' : 'Send magic link'}
                  aria-busy={loadingMagicLink}
                  className="px-4 py-3 bg-primary-dark hover:bg-secondary-light text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
                >
                  {loadingMagicLink ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {error && (
                <p id="magic-link-error" role="alert" className="text-[11px] text-red-400 mt-2 leading-relaxed">
                  {error}
                </p>
              )}
              <p id="magic-link-hint" className="text-[11px] text-muted-dark/80 mt-2 leading-relaxed">
                We&apos;ll send a one-time sign-in link to your email
              </p>
            </div>
          )} */}
        </section>
      </motion.div>
    </main>
  )
}
