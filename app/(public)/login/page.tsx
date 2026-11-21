import { Suspense } from 'react'
import LoginClient from './LoginClient'
import { getPageContentBySlug } from '@/app/lib/actions/getLayoutData'
import { pageCopy } from '@/app/lib/page-content/copy'
import { pageContent } from '@/app/lib/constants/page-content/login'

export default async function LoginPage() {
  const [content, authErrorContent] = await Promise.all([getPageContentBySlug('login'), getPageContentBySlug('auth-error')])
  const { t } = pageCopy(content, pageContent)

  return (
    <Suspense fallback={<div>{t('login_loading')}</div>}>
      <LoginClient content={content} authErrorContent={authErrorContent} />
    </Suspense>
  )
}
