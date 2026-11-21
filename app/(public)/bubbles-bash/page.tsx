import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/prisma/client'
import { PageField } from '@/app/types/page.types'
import { BUBBLES_BASH_SETTING_KEY, BUBBLES_BASH_SLUG } from '@/app/lib/constants/bubbles-bash.constants'
import BubbleBashClient from './BubbleBashClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Bubbles Bash | The Pops Orchestra',
  description: 'A sit-down fundraising dinner with The Pops Orchestra of Bradenton & Sarasota.'
}

export default async function BubbleBashPage() {
  const [setting, page] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: BUBBLES_BASH_SETTING_KEY } }).catch(() => null),
    prisma.page.findUnique({ where: { slug: BUBBLES_BASH_SLUG } }).catch(() => null)
  ])

  if (!setting?.value) notFound()

  return <BubbleBashClient content={(page?.content as unknown as PageField[]) ?? []} />
}
