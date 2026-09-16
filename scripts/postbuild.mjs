/**
 * Adaptation du build statique aux règles de GitHub Pages.
 *
 * 1. `dist/client/404/index.html` → `dist/client/404.html`
 *    Pages sert ce fichier pour toute URL sans fichier correspondant. Il doit
 *    être à la racine et s'appeler exactement `404.html`.
 *
 * 2. Vérification que `.nojekyll` est bien présent.
 *    Sans lui, Pages passe le site par Jekyll, qui supprime silencieusement
 *    tout fichier ou dossier commençant par un underscore.
 *
 * 3. Vérification que chaque illustration déclarée dans `covers.json` est bien
 *    partie dans le build, sinon l'article afficherait une image cassée. Même
 *    vérification pour les logos déclarés dans `experiences.json`.
 *
 * 4. Garde-fou : on échoue si une page attendue manque, plutôt que de publier
 *    un site amputé.
 */

import {
  access,
  copyFile,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const OUT_DIR = 'dist/client'
const COVERS_FILE = 'src/content/covers.json'
const EXPERIENCES_FILE = 'src/content/experiences.json'

const REQUIRED_PAGES = [
  'index.html',
  'projets/index.html',
  'blog/index.html',
  'contact/index.html',
  'services/index.html',
  'services/developpement-web/index.html',
  'services/audit-securite-application/index.html',
  'services/integration-ia/index.html',
  '404/index.html',
  'sitemap.xml',
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

async function main() {
  const missing = []
  const required = [
    ...REQUIRED_PAGES,
    ...(await requiredCovers()),
    ...(await requiredLogos()),
  ]
  for (const page of required) {
    if (!(await exists(join(OUT_DIR, page)))) missing.push(page)
  }

  if (missing.length > 0) {
    console.error(
      `[postbuild] Fichiers manquants dans ${OUT_DIR} :\n  - ${missing.join('\n  - ')}`,
    )
    process.exit(1)
  }

  await copyFile(join(OUT_DIR, '404/index.html'), join(OUT_DIR, '404.html'))
  await rm(join(OUT_DIR, '404'), { recursive: true, force: true })
  console.log('[postbuild] 404.html écrit à la racine')

  if (!(await exists(join(OUT_DIR, '.nojekyll')))) {
    await writeFile(join(OUT_DIR, '.nojekyll'), '')
    console.log('[postbuild] .nojekyll ajouté')
  }

  const articles = await readdir(join(OUT_DIR, 'blog'), { withFileTypes: true })
  const count = articles.filter((entry) => entry.isDirectory()).length
  console.log(`[postbuild] ${count} article(s) prérendu(s)`)
}

main().catch((error) => {
  console.error('[postbuild]', error)
  process.exit(1)
})
