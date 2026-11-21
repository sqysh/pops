'use client'

import { useEffect, useState } from 'react'
import { pageCopy } from './lib/page-content/copy'
import { pageContent } from './lib/constants/page-content/server-error'
import { getPublicPageContent } from './lib/actions/page/getPublicPageContent'

export default function GlobalError({ reset }: { reset: () => void }) {
  // Render straight away from the defaults; swap in the saved wording if the
  // database can still be reached. This page must never fail itself.
  const [content, setContent] = useState<unknown>(null)
  const { t } = pageCopy(content, pageContent)

  useEffect(() => {
    let active = true
    try {
      getPublicPageContent('server-error')
        .then((stored) => {
          if (active && stored) setContent(stored)
        })
        .catch(() => {})
    } catch {
      // keep the defaults
    }
    return () => {
      active = false
    }
  }, [])

  return (
    <html>
      <body style={{ background: '#000', color: '#fff', fontFamily: 'system-ui', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{t('server_error_heading')}</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.6 }}>{t('server_error_message')}</p>
        <button
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#da0032',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          {t('server_error_button')}
        </button>
      </body>
    </html>
  )
}
