/**
 * Synchronise les expériences depuis la database Notion vers
 * `src/content/experiences.json`.
 *
 * La database Notion « Experience Salvador Cardona » est la source de vérité ;
 * le fichier du dépôt en est le reflet, régénéré à la main :
 *
 *     export NOTION_TOKEN=ntn_...
 *     npm run experiences:sync
 *
 * Rien n'est appelé au build ni au runtime — le site reste strictement
 * statique, et le contenu reste versionné dans Git. `experiences.json` porte
 * un commentaire « ne pas éditer » juste au-dessus dans `content/experiences.ts`,
 * qui l'importe : le JSON lui-même ne peut pas en porter un.
 *
 * Voir « Modifier le contenu » dans le README.
 */

import { Buffer } from 'node:buffer'
import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DATA_SOURCE_ID = '3dd45168-0af4-8049-bee3-000b6499a286'
// La database a plusieurs sources de données (API Notion « 2025-09-03 ») : on
// interroge `data_sources`, pas `databases`, avec la version qui l'expose.
const NOTION_VERSION = '2025-09-03'
const API = 'https://api.notion.com/v1'

const DATA_FILE = 'src/content/experiences.json'
const LOGOS_DIR = 'public/experiences'

/** Le jeton n'est lu qu'à l'appel : le rendu reste testable sans réseau. */
function requireToken() {
  const token = process.env.NOTION_TOKEN
  if (token) return token
  console.error(
    'NOTION_TOKEN manquant.\n' +
      'Créer une intégration sur https://www.notion.com/my-integrations, la\n' +
      'partager avec la database « Experience Salvador Cardona », puis :\n' +
      '  export NOTION_TOKEN=ntn_...',
  )
  process.exit(1)
}

async function notion(path, body) {
  const token = requireToken()
  const res = await fetch(`${API}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`Notion ${res.status} sur ${path} : ${await res.text()}`)
  }
  return res.json()
}

/** Suit la pagination de l'API, qui ne rend que 100 entrées à la fois. */
async function paginate(fetchPage) {
  const all = []
  let cursor
  do {
    const page = await fetchPage(cursor)
    all.push(...page.results)
    cursor = page.has_more ? page.next_cursor : undefined
  } while (cursor)
  return all
}

const queryDataSource = () =>
  paginate((cursor) =>
    notion(`/data_sources/${DATA_SOURCE_ID}/query`, {
      sorts: [{ property: 'start date', direction: 'descending' }],
      start_cursor: cursor,
    }),
  )

/** Les blocs d'une page, enfants compris (les listes imbriquent leurs items). */
async function blocksOf(id) {
  const blocks = await paginate((cursor) => {
    const params = new URLSearchParams({ page_size: '100' })
    if (cursor) params.set('start_cursor', cursor)
    return notion(`/blocks/${id}/children?${params}`)
  })
  for (const block of blocks) {
    if (block.has_children) block.children = await blocksOf(block.id)
  }
  return blocks
}

// --- Propriétés -------------------------------------------------------------

/**
 * L'apostrophe droite tapée dans Notion devient l'apostrophe typographique du
 * reste du site : « l'API » s'affiche « l’API », comme dans `profile.ts`.
 */
const typographic = (s) => s.replace(/(?<=\p{L})'(?=\p{L})/gu, '’')
const plainText = (items = []) =>
  typographic(items.map((t) => t.plain_text).join(''))
const title = (prop) => plainText(prop?.title).trim()
const text = (prop) => plainText(prop?.rich_text).trim()
const isoDate = (prop) => prop?.date?.start ?? null

// --- Corps de page -> sections ----------------------------------------------

/**
 * L'émoji éventuel qui ouvre un titre de section Notion, ex.
 * « ⌨️ BACKEND — Java / Spring & Symfony ». Le reste du titre est gardé tel
 * quel : c'est lui qui porte le nom de section (BACKEND, FRONTEND,
 * INFRASTRUCTURE, IA, CONSEIL & MÉTHODE…) attendu par le site.
 */
const HEADING_PREFIX = /^\p{Extended_Pictographic}️?\s*/u

/**
 * Dans Notion, un titre de section s'écrit le plus souvent en paragraphe
 * simple, pas en bloc Titre : « 🛠 BACKEND — Symfony 6 / API Platform ». Un
 * paragraphe n'est un titre que s'il commence par un émoji suivi d'un de ces
 * intitulés, en majuscules ou non, seul ou suivi d'un tiret et de la stack.
 */
const SECTION_NAME =
  /^(?:BACKEND|FRONTEND|INFRASTRUCTURE|IA|CONSEIL\s*&\s*MÉTHODE)(?=$|[\s—–:-])/iu

function headingText(block) {
  const type = block.type
  if (type === 'heading_1' || type === 'heading_2' || type === 'heading_3') {
    return plainText(block[type].rich_text).replace(HEADING_PREFIX, '').trim()
  }
  if (type === 'paragraph') {
    const paragraph = text(block.paragraph)
    if (!HEADING_PREFIX.test(paragraph)) return null
    const heading = paragraph.replace(HEADING_PREFIX, '').trim()
    return SECTION_NAME.test(heading) ? heading : null
  }
  return null
}

/**
 * Le corps d'une page d'expérience : un résumé en paragraphes avant le
 * premier titre, puis des sections — chacune portant les puces qui la suivent
 * jusqu'au titre suivant. Une puce sans titre au-dessus est rendue à part
 * (`orphans`) : la publier sans sa section ferait disparaître le titre du site.
 */
export function parseBody(blocks) {
  const summary = []
  const sections = []
  const orphans = []
  let current = null

  for (const block of blocks) {
    const heading = headingText(block)
    if (heading) {
      current = { title: heading, items: [] }
      sections.push(current)
      continue
    }

    if (block.type === 'bulleted_list_item') {
      const item = text(block.bulleted_list_item)
      if (current) current.items.push(item)
      else orphans.push(item)
      continue
    }

    if (block.type === 'paragraph') {
      const paragraph = text(block.paragraph)
      if (paragraph && !current) summary.push(paragraph)
      continue
    }

    console.warn(`  bloc « ${block.type} » ignoré : non pris en charge`)
  }

  return { summary: summary.join(' '), sections, orphans }
}

// --- Logos -------------------------------------------------------------------

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Rapatrie le logo d'une entreprise dans `public/experiences/`. Les URL de
 * fichiers téléversés dans Notion sont signées et expirent en environ une
 * heure : les garder telles quelles casserait le site après coup.
 */
async function downloadLogo(files, company) {
  const file = files?.[0]
  if (!file) return null

  const url = file.type === 'external' ? file.external.url : file.file.url
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`téléchargement du logo de « ${company} » : ${res.status}`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  const ext = extname(new URL(url).pathname) || '.png'
  const name = `${slugify(company)}${ext}`
  await writeFile(join(LOGOS_DIR, name), buffer)
  console.log(`  logo ${name} (${(buffer.length / 1024).toFixed(0)} ko)`)
  return `/experiences/${name}`
}

// --- Écriture ---------------------------------------------------------------

/**
 * Le JSON tel qu'il est versionné : `JSON.stringify` indenté, sauf les
 * tableaux de chaînes qui tiennent sur une ligne de 80 caractères, écrits sur
 * une seule (le format de Prettier). Sans ça, chaque synchronisation
 * réécrirait ces tableaux et noierait les vrais changements dans le diff.
 */
export function toJson(value) {
  return JSON.stringify(value, null, 2).replace(
    /^( *)(.*)\[\n([^[\]{}]*?)\n *\](,?)$/gm,
    (whole, indent, before, inner, comma) => {
      const items = inner.split('\n').map((line) => line.trim())
      const line = `${indent}${before}[${items.join(' ')}]${comma}`
      return line.length <= 80 ? line : whole
    },
  )
}

// --- Programme ---------------------------------------------------------------

async function main() {
  await mkdir(LOGOS_DIR, { recursive: true })

  const rows = await queryDataSource()
  console.log(`${rows.length} expérience(s) dans Notion`)

  const experiences = []
  const orphans = []

  for (const row of rows) {
    const props = row.properties
    const name = title(props.Name)
    const company = text(props.entreprise)
    const role = text(props.poste)
    const startDate = isoDate(props['start date'])

    if (!company) throw new Error(`« ${name || row.id} » n'a pas d'entreprise`)
    if (!role) throw new Error(`« ${name} » n'a pas de poste`)
    if (!startDate) throw new Error(`« ${name} » n'a pas de start date`)

    console.log(`- ${name}`)
    const blocks = await blocksOf(row.id)
    const body = parseBody(blocks)
    for (const item of body.orphans) orphans.push({ name, item })

    const files = props.logo?.files
    const logo = files?.length ? await downloadLogo(files, company) : null

    experiences.push({
      company,
      role,
      location: text(props.lieu),
      startDate,
      endDate: isoDate(props['end date']),
      stack: props.technologie?.multi_select?.map((t) => t.name) ?? [],
      logo,
      summary: body.summary,
      sections: body.sections,
    })
  }

  // Une puce hors section ne s'afficherait pas : mieux vaut ne rien écrire,
  // donc ne rien commiter, que publier une expérience amputée.
  if (orphans.length > 0) {
    for (const { name, item } of orphans) {
      console.error(`  « ${name} » — puce hors section : ${item}`)
    }
    throw new Error(
      `${orphans.length} puce(s) sans titre de section au-dessus, voir ci-dessus`,
    )
  }

  experiences.sort((a, b) => b.startDate.localeCompare(a.startDate))

  await writeFile(DATA_FILE, `${toJson(experiences)}\n`)

  // Un logo qui n'est plus référencé par aucune expérience ne doit pas traîner.
  const known = new Set(
    experiences
      .filter((experience) => experience.logo)
      .map((experience) => experience.logo.slice('/experiences/'.length)),
  )
  for (const file of await readdir(LOGOS_DIR)) {
    if (!known.has(file)) {
      await unlink(join(LOGOS_DIR, file))
      console.log(`  ${file} retiré : logo plus référencé`)
    }
  }

  console.log(`\n${experiences.length} expérience(s) écrite(s) dans ${DATA_FILE}`)
  console.log('Vérifier avec : npm run typecheck && npm run build')
}

// Lance la synchronisation seulement en exécution directe.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  // Une trace de pile n'apprend rien sur un jeton expiré ou un réseau coupé :
  // le message suffit, et le code de sortie porte l'échec.
  await main().catch((error) => {
    console.error(`\nSynchronisation interrompue : ${error.message}`)
    process.exit(1)
  })
}
