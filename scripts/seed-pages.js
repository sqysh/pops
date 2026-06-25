import { footerPageData } from '../app/lib/constants/footer.constants.js'
import prisma from '../prisma/client.ts'

async function seedPages() {
  console.log('Seeding pages...')

  for (const page of footerPageData) {
    await prisma.page.update({
      where: { slug: page.slug },
      data: { content: page.content }
    })
    console.log(`✓ ${page.slug}`)
  }
}

seedPages()
