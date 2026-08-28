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
 * 3. Garde-fou : on échoue si une page attendue manque, plutôt que de publier
 *    un site amputé.
 */

import { access, copyFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const OUT_DIR = 'dist/client'

const REQUIRED_PAGES = [
  'index.html',
  'blog/index.html',
  'contact/index.html',
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

async function main() {
  const missing = []
  for (const page of REQUIRED_PAGES) {
    if (!(await exists(join(OUT_DIR, page)))) missing.push(page)
  }

  if (missing.length > 0) {
    console.error(
      `[postbuild] Pages manquantes dans ${OUT_DIR} :\n  - ${missing.join('\n  - ')}`,
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
