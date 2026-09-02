/**
 * Synchronise les articles depuis la database Notion vers `src/content/posts/`.
 *
 * La database Notion est la source de vérité ; les fichiers du dépôt en sont le
 * reflet, régénéré à la main :
 *
 *     export NOTION_TOKEN=ntn_...
 *     npm run posts:sync
 *
 * Rien n'est appelé au build ni au runtime — le site reste strictement
 * statique, et le contenu reste versionné dans Git. Les fichiers écrits ici
 * portent un en-tête « ne pas éditer » : toute modification à la main est
 * perdue à la synchronisation suivante.
 *
 * Voir « Modifier le contenu » dans le README.
 */

import { Buffer } from 'node:buffer'
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DATABASE_ID = '3cf45168-0af4-8034-aa5e-fa9f741b807f'
const NOTION_VERSION = '2022-06-28'
const API = 'https://api.notion.com/v1'

const POSTS_DIR = 'src/content/posts'
const COVERS_FILE = 'src/content/covers.json'
const BLOG_DIR = 'public/blog'
/** Les images déjà servies par le site : à référencer, pas à retélécharger. */
const SITE_ORIGIN = 'https://cardona.digital'

const HEADER = `/**
 * Généré par \`npm run posts:sync\` depuis la database Notion « Blog Salvador Cardona ».
 * Ne pas éditer à la main : la prochaine synchronisation écrase ce fichier.
 */`

/** Le jeton n'est lu qu'a l'appel : le rendu reste testable sans reseau. */
function requireToken() {
  const token = process.env.NOTION_TOKEN
  if (token) return token
  console.error(
    'NOTION_TOKEN manquant.\n' +
      'Créer une intégration sur https://www.notion.com/my-integrations, la\n' +
      'partager avec la database « Blog Salvador Cardona », puis :\n' +
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

const queryDatabase = () =>
  paginate((cursor) =>
    notion(`/databases/${DATABASE_ID}/query`, {
      filter: { property: 'status', select: { equals: 'Publié' } },
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

// --- Notion -> JSX --------------------------------------------------------

/** Les caractères que JSX interpréterait comme du balisage ou une expression. */
const JSX_ESCAPES = { '<': '&lt;', '>': '&gt;', '{': '&#123;', '}': '&#125;' }
const jsxText = (s) => s.replace(/[<>{}]/g, (c) => JSX_ESCAPES[c])

/** Un contenu littéral pour `<code>{`…`}</code>`. */
const template = (s) => '{`' + s.replace(/\\/g, '\\\\').replace(/[`$]/g, '\\$&') + '`}'

export function richText(items = []) {
  return items
    .map((item) => {
      const { annotations: a = {}, plain_text: text = '', href } = item
      let out = a.code ? `<code>${template(text)}</code>` : jsxText(text)
      if (a.bold) out = `<strong>${out}</strong>`
      if (a.italic) out = `<em>${out}</em>`
      if (a.strikethrough) out = `<s>${out}</s>`
      if (href) out = `<a href="${href}" target="_blank" rel="noreferrer">${out}</a>`
      return out
    })
    .join('')
}

/**
 * Coupe une ligne de JSX sans changer le texte rendu.
 *
 * JSX joint deux lignes par une espace : on ne peut donc couper que là où le
 * contenu en avait déjà une. Couper ailleurs — entre un mot et la balise qui
 * le suit — ajouterait une espace qui n'existait pas, et « l'italique » entre
 * `<em>` deviendrait « l' italique ». Les balises restent insécables.
 */
export function wrap(content, indent, width = 78) {
  const atoms = []
  let breakable = false
  const push = (text, tag) => {
    atoms.push({ text, tag, breakable })
    breakable = false
  }

  for (const part of content.split(/(<[^>]*>)/)) {
    if (!part) continue
    if (part.startsWith('<')) {
      push(part, true)
      continue
    }
    for (const piece of part.split(/(\s+)/)) {
      if (!piece) continue
      if (/^\s+$/.test(piece)) breakable = true
      else push(piece, false)
    }
  }

  const lines = []
  let line = ''
  let previous = null
  for (const atom of atoms) {
    if (!line) {
      line = atom.text
    } else if (
      atom.breakable &&
      indent.length + line.length + 1 + atom.text.length > width
    ) {
      // Une espace en bout de ligne survit entre deux mots — JSX replie le
      // retour à la ligne — mais pas au contact d'une balise, où elle est
      // supprimée. Là, il faut l'écrire explicitement.
      lines.push(indent + line + (previous.tag || atom.tag ? "{' '}" : ''))
      line = atom.text
    } else {
      line += (atom.breakable ? ' ' : '') + atom.text
    }
    previous = atom
  }
  if (line) lines.push(indent + line)
  return lines.join('\n')
}

const block = (tag, content, indent) =>
  `${indent}<${tag}>\n${wrap(content, indent + '  ')}\n${indent}</${tag}>`

export function renderBlocks(blocks, images, indent) {
  const out = []
  let list = null

  const flush = () => {
    if (!list) return
    const items = list.items
      .map((item) => `${indent}  <li>${item}</li>`)
      .join('\n')
    out.push(`${indent}<${list.tag}>\n${items}\n${indent}</${list.tag}>`)
    list = null
  }

  for (const b of blocks) {
    const type = b.type
    const listTag =
      type === 'bulleted_list_item' ? 'ul' : type === 'numbered_list_item' ? 'ol' : null

    if (listTag) {
      if (list?.tag !== listTag) flush()
      list ??= { tag: listTag, items: [] }
      list.items.push(richText(b[type].rich_text))
      continue
    }
    flush()

    if (type === 'paragraph') {
      const content = richText(b.paragraph.rich_text)
      if (content.trim()) out.push(block('p', content, indent))
    } else if (type === 'heading_1' || type === 'heading_2') {
      out.push(block('h2', richText(b[type].rich_text), indent))
    } else if (type === 'heading_3') {
      out.push(block('h3', richText(b.heading_3.rich_text), indent))
    } else if (type === 'quote') {
      out.push(block('blockquote', richText(b.quote.rich_text), indent))
    } else if (type === 'divider') {
      out.push(`${indent}<hr />`)
    } else if (type === 'code') {
      const code = b.code.rich_text.map((t) => t.plain_text).join('')
      out.push(
        `${indent}<pre>\n${indent}  <code>${template(code)}</code>\n${indent}</pre>`,
      )
    } else if (type === 'image') {
      const image = images.get(b.id)
      if (image) out.push(renderImage(image, indent))
    } else {
      console.warn(`  bloc « ${type} » ignoré : non pris en charge`)
    }
  }
  flush()
  return out.join('\n')
}

export function renderImage({ src, caption, alt, width, height, alpha }, indent) {
  const attrs = [
    `src="${src}"`,
    // L'attribut alt ne peut pas porter de balisage : texte brut uniquement.
    `alt="${alt.replace(/"/g, '&quot;')}"`,
    `width={${width}}`,
    `height={${height}}`,
    // Une image à canal alpha se compose sur le fond de page : sans plaque,
    // une capture claire sur transparent devient illisible en thème clair.
    alpha ? 'className="mx-auto rounded-lg bg-slate-900"' : 'className="mx-auto"',
  ]
  return [
    `${indent}<figure>`,
    `${indent}  <img`,
    ...attrs.map((a) => `${indent}    ${a}`),
    `${indent}  />`,
    caption ? `${indent}  <figcaption>${caption}</figcaption>` : null,
    `${indent}</figure>`,
  ]
    .filter(Boolean)
    .join('\n')
}

// --- Images ---------------------------------------------------------------

/** Largeur, hauteur et présence d'un canal alpha, lues dans l'en-tête. */
export function imageInfo(buf) {
  if (buf.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
    // PNG : IHDR est toujours le premier chunk. Les types 4 et 6 ont un alpha.
    const colorType = buf.readUInt8(25)
    return {
      width: buf.readUInt32BE(16),
      height: buf.readUInt32BE(20),
      alpha: colorType === 4 || colorType === 6,
    }
  }
  if (buf.readUInt16BE(0) === 0xffd8) {
    // JPEG : parcourir les marqueurs jusqu'au SOF, qui porte les dimensions.
    let i = 2
    while (i < buf.length - 9) {
      if (buf.readUInt8(i) !== 0xff) {
        i += 1
        continue
      }
      const marker = buf.readUInt8(i + 1)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return {
          height: buf.readUInt16BE(i + 5),
          width: buf.readUInt16BE(i + 7),
          alpha: false,
        }
      }
      i += 2 + buf.readUInt16BE(i + 2)
    }
  }
  throw new Error('format d’image non reconnu (PNG et JPEG seulement)')
}

/**
 * Rapatrie une image de Notion dans `public/blog/`. Les URL de fichiers
 * téléversés dans Notion sont signées et expirent : les garder telles quelles
 * casserait le site quelques heures plus tard.
 */
async function localise(url, name) {
  if (url.startsWith(`${SITE_ORIGIN}/blog/`)) {
    const file = basename(new URL(url).pathname)
    return { file, src: `/blog/${file}`, buffer: await readFile(join(BLOG_DIR, file)) }
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`téléchargement de ${url} : ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const type = res.headers.get('content-type') ?? ''
  const ext =
    extname(new URL(url).pathname) || (type.includes('png') ? '.png' : '.jpg')
  const file = `${name}${ext}`
  await writeFile(join(BLOG_DIR, file), buffer)
  console.log(`  image ${file} (${(buffer.length / 1024).toFixed(0)} ko)`)
  return { file, src: `/blog/${file}`, buffer }
}

// --- Écriture -------------------------------------------------------------

const plainText = (items = []) => items.map((t) => t.plain_text).join('')
const text = (prop) => plainText(prop?.rich_text)
const quote = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

/** Un identifiant JavaScript valide et lisible, tiré du slug. */
const identifier = (slug) =>
  slug.replace(/-(.)/g, (_, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, '')

export function postFile(post) {
  return `${HEADER}

import type { Post } from './post'

export const post: Post = {
  slug: ${quote(post.slug)},
  title: ${quote(post.title)},
  date: ${quote(post.date)},
  excerpt:
    ${quote(post.excerpt)},
  tags: [${post.tags.map(quote).join(', ')}],
  readingTime: ${post.readingTime},
  body: (
    <>
${post.body}
    </>
  ),
}
`
}

export function indexFile(posts) {
  const imports = posts
    .map((p) => `import { post as ${identifier(p.slug)} } from './${p.slug}'`)
    .join('\n')
  return `${HEADER}

import type { Post } from './post'

${imports}

export type { Post, PostCover } from './post'
export { formatDate, getCover } from './post'

export const posts: Array<Post> = [
${posts.map((p) => `  ${identifier(p.slug)},`).join('\n')}
]

/** Les articles du plus récent au plus ancien. */
export const sortedPosts: Array<Post> = [...posts].sort((a, b) =>
  b.date.localeCompare(a.date),
)

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export const allTags: Array<string> = [
  ...new Set(posts.flatMap((post) => post.tags)),
].sort((a, b) => a.localeCompare(b, 'fr'))
`
}

// --- Programme ------------------------------------------------------------

async function main() {
  await mkdir(POSTS_DIR, { recursive: true })
  await mkdir(BLOG_DIR, { recursive: true })

  const pages = await queryDatabase()
  console.log(`${pages.length} article(s) publié(s) dans Notion`)

  const covers = JSON.parse(await readFile(COVERS_FILE, 'utf8'))
  const posts = []

  for (const page of pages) {
    const props = page.properties
    const slug = text(props.slug).trim()
    const title = props.Title?.title?.map((t) => t.plain_text).join('') ?? ''

    if (!slug) throw new Error(`« ${title} » n’a pas de slug`)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error(`slug invalide pour « ${title} » : ${slug}`)
    }
    const date = props.Date?.date?.start
    if (!date) throw new Error(`« ${title} » n’a pas de Date`)

    console.log(`- ${slug}`)
    const blocks = await blocksOf(page.id)

    // Les images du corps, rapatriées avant le rendu : leurs dimensions
    // réelles évitent que la page saute au chargement.
    const images = new Map()
    let n = 0
    for (const b of blocks) {
      if (b.type !== 'image') continue
      const file = b.image.type === 'external' ? b.image.external.url : b.image.file.url
      const { src, buffer } = await localise(file, `${slug}-${++n}`)
      images.set(b.id, {
        src,
        caption: richText(b.image.caption),
        alt: plainText(b.image.caption),
        ...imageInfo(buffer),
      })
    }

    const cover = page.cover
    if (cover) {
      const url = cover.type === 'external' ? cover.external.url : cover.file.url
      const { file } = await localise(url, slug)
      covers[slug] = {
        ...covers[slug],
        alt: text(props.coverAlt).trim(),
        file,
      }
    }

    posts.push({
      slug,
      title,
      date,
      excerpt: text(props.excerpt).trim(),
      tags: props.tags?.multi_select?.map((t) => t.name) ?? [],
      readingTime: props.readingTime?.number ?? 1,
      body: renderBlocks(blocks, images, '      '),
    })
  }

  posts.sort((a, b) => b.date.localeCompare(a.date))

  for (const post of posts) {
    await writeFile(join(POSTS_DIR, `${post.slug}.tsx`), postFile(post))
  }
  await writeFile(join(POSTS_DIR, 'index.ts'), indexFile(posts))
  await writeFile(COVERS_FILE, `${JSON.stringify(covers, null, 2)}\n`)

  // Un article dépublié dans Notion disparaît du dépôt.
  const known = new Set(posts.map((p) => `${p.slug}.tsx`))
  for (const file of await readdir(POSTS_DIR)) {
    if (file.endsWith('.tsx') && !known.has(file)) {
      await unlink(join(POSTS_DIR, file))
      console.log(`  ${file} retiré : plus publié dans Notion`)
    }
  }

  console.log(`\n${posts.length} article(s) écrit(s) dans ${POSTS_DIR}`)
  console.log('Vérifier avec : npm run typecheck && npm run build')
}

// Lance la synchronisation seulement en execution directe : importe depuis un
// test, ce module n'expose que ses fonctions de rendu.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
