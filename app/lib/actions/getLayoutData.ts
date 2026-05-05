'use server'

import prisma from '@/prisma/client'

export const getLayoutData = async () => {
  const [campApplicationsSetting, footer] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'campApplicationsEnabled' } }).catch(() => null),
    prisma.page.findUnique({ where: { slug: 'footer' } }).catch(() => null)
  ])
  return { campApplicationsSetting, footerData: footer }
}
