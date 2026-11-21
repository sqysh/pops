import NotFoundClient from './NotFoundClient'
import { getPageContentBySlug } from './lib/actions/getLayoutData'

export default async function NotFound() {
  const content = await getPageContentBySlug('not-found')
  return <NotFoundClient content={content} />
}
