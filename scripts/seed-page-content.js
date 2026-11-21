import { readdirSync } from 'node:fs'
import { mergePageContent } from '../app/lib/page-content/merge.ts'
import prisma from '../prisma/client.ts'

// Makes sure every page the code reads has a row and every field it reads
// exists, so all of it shows up in the page content editor.
//
// Safe to run any number of times. Wording that is already stored is never
// replaced (see mergePageContent): only missing pages and missing fields are
// added, with the same default wording the website already falls back to, so
// running it does not change what visitors see.
//
//   npm run seed:page-content -- --dry-run   report only, write nothing
//   npm run seed:page-content                apply

const dryRun = process.argv.includes('--dry-run')
const tag = dryRun ? '[dry run] ' : ''
const dir = new URL('../app/lib/constants/page-content/', import.meta.url)

/** Rows saved under an old slug before a page moved. Carried over, wording and all. */
const RENAMED = { 'bubble-bash': 'bubbles-bash' }

const SETTINGS = [
  {
    key: 'bubblesBashLive',
    name: 'Bubbles Bash Page',
    description: 'Makes /bubbles-bash visible to the public',
    value: false
  }
]

async function loadDefinitions() {
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  const pages = []
  for (const file of files.sort()) {
    const { pageContent } = await import(new URL(file, dir).href)
    pages.push(pageContent)
  }
  return pages
}

async function carryOverRenamedPages() {
  for (const [from, to] of Object.entries(RENAMED)) {
    const [old, current] = await Promise.all([
      prisma.page.findUnique({ where: { slug: from } }),
      prisma.page.findUnique({ where: { slug: to } })
    ])
    if (!old) continue
    if (current) {
      console.log(`${tag}! ${from}: left alone, "${to}" already exists (the old row is no longer read)`)
      continue
    }
    console.log(`${tag}→ ${from}: renamed to "${to}", wording kept`)
    if (!dryRun) await prisma.page.update({ where: { slug: from }, data: { slug: to } })
  }
}

async function seedPages(pages) {
  const totals = { created: 0, updated: 0, unchanged: 0, fields: 0 }

  for (const page of pages) {
    // in a dry run the rename above was not applied, so look under the old slug too
    const oldSlug = Object.keys(RENAMED).find((from) => RENAMED[from] === page.slug)
    const row =
      (await prisma.page.findUnique({ where: { slug: page.slug } })) ??
      (dryRun && oldSlug ? await prisma.page.findUnique({ where: { slug: oldSlug } }) : null)

    const { content, added } = mergePageContent(row?.content, page.content)

    if (!row) {
      totals.created++
      totals.fields += added.length
      console.log(`${tag}+ ${page.slug}: new page with ${added.length} fields`)
      if (!dryRun) await prisma.page.create({ data: { slug: page.slug, content } })
      continue
    }

    if (added.length === 0) {
      totals.unchanged++
      console.log(`${tag}= ${page.slug}: up to date (${content.length} fields)`)
      continue
    }

    totals.updated++
    totals.fields += added.length
    console.log(`${tag}~ ${page.slug}: adding ${added.length} field(s), keeping the ${content.length - added.length} stored`)
    if (!dryRun) await prisma.page.update({ where: { slug: page.slug }, data: { content } })
  }

  return totals
}

async function seedSettings() {
  for (const setting of SETTINGS) {
    const existing = await prisma.siteSetting.findUnique({ where: { key: setting.key } })
    if (existing) {
      console.log(`${tag}= setting ${setting.key}: exists (${existing.value ? 'on' : 'off'}), left alone`)
      continue
    }
    console.log(`${tag}+ setting ${setting.key}: created, off`)
    if (!dryRun) await prisma.siteSetting.create({ data: setting })
  }
}

async function main() {
  const pages = await loadDefinitions()
  await carryOverRenamedPages()
  const totals = await seedPages(pages)
  await seedSettings()
  console.log(
    `\n${tag}${pages.length} pages: ${totals.created} new, ${totals.updated} gaining fields, ${totals.unchanged} unchanged; ${totals.fields} fields added. No stored wording was changed.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
