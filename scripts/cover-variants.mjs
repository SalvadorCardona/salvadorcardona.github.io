/**
 * Les déclinaisons d'une illustration d'article : AVIF et WebP à deux
 * largeurs, servies par `<picture>` sur `/blog` et en tête de l'article. Le
 * JPEG d'origine reste l'image de partage (`og:image`) : LinkedIn ne lit pas
 * l'AVIF.
 *
 * `posts:sync` et `post:image` les écrivent à côté de l'image dès qu'elle
 * arrive dans `public/blog/`. Lancé directement, le script rattrape celles
 * qui manquent pour toutes les illustrations de `covers.json` :
 *
 *     node scripts/cover-variants.mjs
 *
 * Les largeurs et le nommage sont repris par `getCover`
 * (`src/content/posts/post.ts`) et contrôlés par `scripts/postbuild.mjs`.
 */

import { access, readFile } from 'node:fs/promises'
import { join, parse } from 'node:path'
import { pathToFileURL } from 'node:url'

const COVERS_FILE = 'src/content/covers.json'
const BLOG_DIR = 'public/blog'

const COVER_WIDTHS = [480, 960]
const COVER_FORMATS = ['avif', 'webp']

/** Les noms des déclinaisons de `file`, ex. `mon-article-480.avif`. */
export function variantsOf(file) {
  const { name } = parse(file)
  return COVER_WIDTHS.flatMap((width) =>
    COVER_FORMATS.map((format) => `${name}-${width}.${format}`),
  )
}

/** Écrit les déclinaisons de `public/blog/<file>`, en écrasant les anciennes. */
export async function writeVariants(file) {
  // Chargé ici seulement : `postbuild` n'a besoin que des noms.
  const { default: sharp } = await import('sharp')
  const source = await readFile(join(BLOG_DIR, file))
  const { name } = parse(file)
  for (const width of COVER_WIDTHS) {
    const resized = sharp(source).resize({ width })
    const out = (format) => join(BLOG_DIR, `${name}-${width}.${format}`)
    await resized.clone().avif({ quality: 50 }).toFile(out('avif'))
    await resized.clone().webp({ quality: 75 }).toFile(out('webp'))
  }
  console.log(`  déclinaisons de ${file} : ${variantsOf(file).join(', ')}`)
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  const covers = JSON.parse(await readFile(COVERS_FILE, 'utf8'))
  let written = 0
  for (const { file } of Object.values(covers)) {
    if (!file) continue
    const present = await Promise.all(
      variantsOf(file).map((variant) => exists(join(BLOG_DIR, variant))),
    )
    if (present.every(Boolean)) continue
    await writeVariants(file)
    written += 1
  }
  console.log(`${written} illustration(s) déclinée(s)`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main().catch((error) => {
    console.error(`Déclinaisons interrompues : ${error.message}`)
    process.exit(1)
  })
}
