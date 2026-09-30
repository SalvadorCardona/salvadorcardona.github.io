/**
 * Vérification du build serveur, avant qu'il ne parte dans l'image Docker.
 *
 * 1. Le serveur Nitro (`.output/server/index.mjs`) est bien là.
 *
 * 2. Chaque illustration déclarée dans `covers.json` est bien partie dans
 *    `.output/public`, sinon l'article afficherait une image cassée. Même
 *    vérification pour les logos déclarés dans `experiences.json`.
 *
 * 3. Le serveur construit démarre, répond sur `/healthz`, rend chaque page de
 *    `REQUIRED_PAGES` et chaque URL de son propre sitemap en 200, une
 *    adresse inconnue en 404 et `/rendez-vous` en 301 vers `/contact`. C'est
 *    le garde-fou qu'assurait le prérendu (`failOnError`) : on échoue plutôt
 *    que de publier un site amputé.
 */

import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { join } from 'node:path'
import process from 'node:process'
import { setTimeout as sleep } from 'node:timers/promises'

const OUTPUT_DIR = '.output'
const PUBLIC_DIR = join(OUTPUT_DIR, 'public')
const SERVER_ENTRY = join(OUTPUT_DIR, 'server/index.mjs')
const COVERS_FILE = 'src/content/covers.json'
const EXPERIENCES_FILE = 'src/content/experiences.json'

const SITE_URL = 'https://cardona.digital'

/** Les pages fixes ; les articles viennent du sitemap. */
const REQUIRED_PAGES = [
  '/',
  '/qui-suis-je',
  '/agence',
  '/projets',
  '/blog',
  '/contact',
  '/services',
  '/services/developpement-web',
  '/services/audit-securite-application',
  '/services/integration-ia',
  '/404',
]

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/** Les illustrations déjà générées, telles que le site les référence. */
async function requiredCovers() {
  const covers = JSON.parse(await readFile(COVERS_FILE, 'utf8'))
  return Object.values(covers)
    .filter((cover) => cover.file)
    .map((cover) => `blog/${cover.file}`)
}

/** Les logos déjà rapatriés par `npm run experiences:sync`, tels que référencés. */
async function requiredLogos() {
  const experiences = JSON.parse(await readFile(EXPERIENCES_FILE, 'utf8'))
  return experiences
    .filter((experience) => experience.logo)
    .map((experience) => experience.logo.replace(/^\//, ''))
}

function fail(message) {
  console.error(`[postbuild] ${message}`)
  process.exit(1)
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.on('error', reject)
    server.listen(0, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

async function waitForHealth(base) {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch(`${base}/healthz`)
      if (response.ok) return
    } catch {
      // Le serveur n'écoute pas encore.
    }
    await sleep(200)
  }
  throw new Error('le serveur ne répond pas sur /healthz')
}

async function checkServer() {
  const port = await freePort()
  const base = `http://127.0.0.1:${port}`
  const server = spawn(process.execPath, [SERVER_ENTRY], {
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
    stdio: ['ignore', 'ignore', 'inherit'],
  })

  try {
    await waitForHealth(base)

    const sitemap = await fetch(`${base}/sitemap.xml`)
    if (!sitemap.ok) throw new Error(`/sitemap.xml : HTTP ${sitemap.status}`)
    const listed = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => match[1].replace(SITE_URL, '') || '/')

    const failures = []
    const paths = [...new Set([...REQUIRED_PAGES, ...listed])]
    for (const path of paths) {
      const response = await fetch(`${base}${path}`, { redirect: 'manual' })
      const type = response.headers.get('content-type') ?? ''
      if (response.status !== 200 || !type.startsWith('text/html')) {
        failures.push(`${path} : HTTP ${response.status} ${type}`)
      }
    }

    // L'ancienne page de réservation, partagée avant son retrait.
    const booking = await fetch(`${base}/rendez-vous`, { redirect: 'manual' })
    const target = booking.headers.get('location') ?? ''
    if (booking.status !== 301 || !target.startsWith('/contact')) {
      failures.push(`/rendez-vous : HTTP ${booking.status} ${target}, 301 vers /contact attendu`)
    }

    const unknown = await fetch(`${base}/cette-page-n-existe-pas`)
    if (unknown.status !== 404) {
      failures.push(`adresse inconnue : HTTP ${unknown.status}, 404 attendu`)
    }

    if (failures.length > 0) {
      throw new Error(`pages en échec :\n  - ${failures.join('\n  - ')}`)
    }

    const articles = listed.filter((path) => path.startsWith('/blog/')).length
    console.log(
      `[postbuild] ${paths.length} pages rendues par le serveur, dont ${articles} article(s)`,
    )
  } finally {
    server.kill()
  }
}

async function main() {
  if (!(await exists(SERVER_ENTRY))) fail(`${SERVER_ENTRY} manquant`)

  const missing = []
  for (const file of [...(await requiredCovers()), ...(await requiredLogos())]) {
    if (!(await exists(join(PUBLIC_DIR, file)))) missing.push(file)
  }
  if (missing.length > 0) {
    fail(`Fichiers manquants dans ${PUBLIC_DIR} :\n  - ${missing.join('\n  - ')}`)
  }

  await checkServer()
}

main().catch((error) => fail(error.message))
