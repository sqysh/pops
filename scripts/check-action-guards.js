import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

// Every export of a 'use server' file can be called from the browser, so each
// one must either check who is calling (requireStaff / requireAdmin /
// requireSuper) or be listed below as public on purpose. Run in CI or before a
// deploy:  npm run check:actions

const root = new URL('..', import.meta.url).pathname

/** Public by design. Adding to this list is a decision to expose the action to the whole internet. */
const PUBLIC = {
  createCampApplication: 'public camp application form',
  createQuestion: 'public contact form',
  subscribeToMailchimp: 'public newsletter form',
  logAuthError: 'the login page reports sign-in problems before anyone is signed in',
  getPublicPageContent: 'public page wording, limited to an allowlist of pages',
  getHomePageData: 'public home page data',
  getSubscriptions: 'public subscription packages, read-only',
  getFirstHeroImage: 'public home page image, read-only',
  getVenueById: 'public venue details, read-only',
  getCampApplicationsSetting: 'public on/off switch for camp applications, read-only',
  getRequestContext: 'describes the caller own request, no data access',
  buildLogMessage: 'pure string formatting'
}

const GUARDS = /\b(requireStaff|requireAdmin|requireSuper)\(\)/

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (name === 'node_modules' || name === '.next') continue
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (/\.(ts|tsx)$/.test(name)) yield path
  }
}

/** Source of the function that starts at `index` (the brace-balanced body). */
function bodyFrom(source, index) {
  let i = source.indexOf('{', source.indexOf(')', index))
  // skip a return type annotation such as Promise<{ ... }> before the real body
  while (i !== -1 && /[<,|:&]\s*$/.test(source.slice(Math.max(0, i - 3), i))) i = source.indexOf('{', i + 1)
  let depth = 0
  const start = i
  for (; i < source.length; i++) {
    if (source[i] === '{') depth++
    else if (source[i] === '}' && --depth === 0) break
  }
  return source.slice(start, i + 1)
}

const problems = []
let checked = 0
const seenPublic = new Set()

for (const file of [...walk(join(root, 'app')), ...walk(join(root, 'components'))]) {
  const source = readFileSync(file, 'utf8')
  if (!/^\s*['"]use server['"]/.test(source)) continue

  for (const match of source.matchAll(/export\s+(?:async\s+function\s+(\w+)|const\s+(\w+)\s*=)/g)) {
    const name = match[1] ?? match[2]
    checked++

    if (name in PUBLIC) {
      seenPublic.add(name)
      continue
    }

    const body = match[1] ? bodyFrom(source, match.index) : source.slice(match.index, match.index + 600)
    // the check has to come first: within the opening lines, before any work is done
    const opening = body.split('\n').slice(0, 8).join('\n')
    if (!GUARDS.test(opening)) problems.push(`${relative(root, file)}: ${name}() has no guard (requireStaff/requireAdmin/requireSuper) and is not on the public list`)
  }
}

for (const name of Object.keys(PUBLIC)) {
  if (!seenPublic.has(name)) problems.push(`allowlist entry "${name}" matches no action: remove it`)
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):\n` + problems.map((p) => '  ' + p).join('\n'))
  process.exit(1)
}
console.log(`✓ ${checked} server actions checked: ${checked - seenPublic.size} guarded, ${seenPublic.size} public on purpose`)
