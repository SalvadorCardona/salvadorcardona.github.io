/**
 * Génère l'illustration d'un article avec OpenRouter.
 *
 * Le site reste statique : rien n'est appelé au build ni au runtime. Ce script
 * se lance à la main, une fois, quand un article est ajouté — il écrit l'image
 * dans `public/blog/` et elle part ensuite avec le dépôt.
 *
 *   OPENROUTER_API_KEY=sk-or-... npm run post:image            # tout ce qui manque
 *   OPENROUTER_API_KEY=sk-or-... npm run post:image -- <slug>  # un article
 *   ... npm run post:image -- <slug> --force                   # régénérer
 *
 * Le texte alternatif et le prompt de chaque article vivent dans
 * `src/content/covers.json` : une entrée par slug. Les prompts sont écrits en
 * anglais, mieux suivi par les modèles d'image que le français. Le script y
 * réécrit `file` — le nom du fichier produit, dont l'extension dépend du
 * modèle. C'est ce champ qui fait apparaître l'illustration sur le site.
 */

import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

const COVERS_FILE = 'src/content/covers.json'
const OUT_DIR = 'public/blog'
const ENDPOINT = 'https://openrouter.ai/api/v1/images/generations'

/** Surchargeable pour essayer un autre modèle sans toucher au script. */
const MODEL =
  process.env.OPENROUTER_IMAGE_MODEL ?? 'black-forest-labs/flux.2-flex'

/** Extensions des formats qu'un navigateur affiche sans discuter. */
const EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

/**
 * Suffixe commun à tous les prompts : c'est lui qui fait tenir les
 * illustrations ensemble comme une série plutôt que comme trois images sans
 * rapport. Pas de texte dans l'image — aucun modèle ne l'écrit correctement.
 */
const STYLE =
  'Flat vector editorial illustration, geometric and abstract, generous negative space, ' +
  'limited palette of slate grey, off-white and sky blue, subtle paper grain, soft even light, ' +
  'no text, no letters, no numbers, no logos, no people, wide banner composition.'

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function generate(slug, prompt, apiKey) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: `${prompt}. ${STYLE}`,
      resolution: '1K',
      aspect_ratio: '16:9',
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter ${response.status} : ${await response.text()}`)
  }

  const payload = await response.json()
  const image = payload.data?.[0]

  if (!image?.b64_json) {
    throw new Error(
      `Réponse sans image : ${JSON.stringify(payload).slice(0, 300)}`,
    )
  }

  const extension = EXTENSIONS[image.media_type ?? 'image/png']
  if (!extension) {
    throw new Error(
      `Le modèle a renvoyé du ${image.media_type}, format inutilisable en <img>. ` +
        'Changer de modèle via OPENROUTER_IMAGE_MODEL.',
    )
  }

  const name = `${slug}.${extension}`
  const bytes = Buffer.from(image.b64_json, 'base64')
  await writeFile(join(OUT_DIR, name), bytes)

  const cost = payload.usage?.cost
  const weight = Math.round(bytes.length / 1024)
  console.log(
    `[post:image] ${join(OUT_DIR, name)} écrit — ${weight} ko` +
      `${cost ? `, ${MODEL}, $${cost.toFixed(4)}` : ''}`,
  )

  return name
}

async function main() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error(
      '[post:image] OPENROUTER_API_KEY manquante. Créer une clé sur ' +
        'https://openrouter.ai/keys et la passer dans l’environnement.',
    )
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const wanted = args.filter((arg) => !arg.startsWith('--'))

  const covers = JSON.parse(await readFile(COVERS_FILE, 'utf8'))

  const unknown = wanted.filter((slug) => !covers[slug])
  if (unknown.length > 0) {
    console.error(
      `[post:image] Slug absent de ${COVERS_FILE} :\n  - ${unknown.join('\n  - ')}\n` +
        'Ajouter son entrée (alt + prompt) avant de générer l’image.',
    )
    process.exit(1)
  }

  const slugs = wanted.length > 0 ? wanted : Object.keys(covers)
  await mkdir(OUT_DIR, { recursive: true })

  let generated = 0
  for (const slug of slugs) {
    const known = covers[slug].file
    if (!force && known && (await exists(join(OUT_DIR, known)))) {
      console.log(
        `[post:image] ${slug} : image déjà présente, ignoré (--force pour refaire)`,
      )
      continue
    }

    covers[slug].file = await generate(slug, covers[slug].prompt, apiKey)
    await writeFile(COVERS_FILE, `${JSON.stringify(covers, null, 2)}\n`)
    generated += 1
  }

  console.log(`[post:image] ${generated} image(s) générée(s)`)
}

main().catch((error) => {
  console.error('[post:image]', error.message)
  process.exit(1)
})
