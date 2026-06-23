'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, Clock, Shield, Mail, Lock, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export const getAuthErrorMessage = (error: string | null) => {
  switch (error) {
    case 'AccessDenied':
      return {
        icon: Shield,
        title: 'Access Denied',
        message: "Your account isn't authorized to access this area. Contact support if you need assistance."
      }
    case 'Verification':
      return {
        icon: Clock,
        title: 'Link Expired',
        message: 'That verification link has expired or already been used. Request a new one to continue.'
      }
    case 'EmailSignin':
      return {
        icon: Mail,
        title: 'Email Failed',
        message: 'The email failed to send. Double-check your email address and try again.'
      }
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'Configuration':
      return {
        icon: AlertTriangle,
        title: 'Sign In Cancelled',
        message: 'Looks like sign in was cancelled or interrupted. Head back and try again.'
      }
    case 'SessionRequired':
      return {
        icon: Lock,
        title: 'Sign In Required',
        message: 'You need to sign in before accessing this area.'
      }
    default:
      return {
        icon: AlertTriangle,
        title: 'Something went wrong',
        message: 'Please try again or contact support if the issue persists.'
      }
  }
}

export default function AuthErrorClient() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorInfo = getAuthErrorMessage(error)
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
            aria-label="The Pops Orchestra — return to homepage"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark inline-block"
          >
            <div className="flex items-center gap-3">
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
              <span className="text-sm font-mono tracking-[0.3em] uppercase text-text-dark">The Pops Orchestra</span>
              <div className="w-px h-6 bg-primary-dark" aria-hidden="true" />
            </div>
          </Link>
        </div>

        <section aria-labelledby="error-heading">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary-dark" aria-hidden="true" />
              <span className="text-sm font-mono tracking-[0.25em] uppercase text-primary-dark">All Access</span>
            </div>
            <h1
              id="error-heading"
              className="font-quicksand font-black text-3xl sm:text-4xl text-text-dark leading-tight"
            >
              Sign In Error
            </h1>
            <p className="text-muted-dark text-sm mt-3 leading-relaxed">Something interrupted the sign in process.</p>
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
          <div className="flex flex-col gap-3" role="group" aria-label="Recovery options">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-dark hover:bg-secondary-light text-white text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
              Back to Sign In
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-dark hover:bg-button-dark border border-border-dark hover:border-primary-dark text-text-dark text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-dark focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark"
            >
              Back to Home
            </Link>
          </div>

          {/* Error code */}
          {error && (
            <p className="text-sm font-mono text-muted-dark/20 uppercase tracking-widest text-center mt-3">
              <span className="sr-only">Error code: </span>
              {error}
            </p>
          )}
        </section>
      </motion.div>
    </main>
  )
}
