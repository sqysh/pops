import { ComponentProps } from 'react'
import RootLayoutShell from '@/app/lib/layout/RootLayoutShell'
import { getPageContentBySlug } from '@/app/lib/actions/getLayoutData'

type Props = Omit<ComponentProps<typeof RootLayoutShell>, 'navContent'>

/** Server wrapper: loads the editable `navigation` page content and hands it to the client shell. */
export default async function RootLayoutClient(props: Props) {
  const navContent = await getPageContentBySlug('navigation')
  return <RootLayoutShell {...props} navContent={navContent} />
}
