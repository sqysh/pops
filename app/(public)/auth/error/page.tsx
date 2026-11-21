import { Suspense } from 'react'
import AuthErrorClient from './AuthErrorClient'
import { getPageContentBySlug } from '@/app/lib/actions/getLayoutData'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/auth-error'

export default async function AuthErrorPage() {
  const content = await getPageContentBySlug('auth-error')
  const { t } = pageCopy(content, pageContent)

  return (
    <Suspense fallback={<div>{t('auth_error_loading')}</div>}>
      <AuthErrorClient content={content} />
    </Suspense>
  )
}
