/**
 * Construction des balises <meta> pour `head()` des routes.
 *
 * `SITE_URL` doit être l'URL publique finale : elle sert aux URL canoniques et
 * aux cartes Open Graph, qui exigent des adresses absolues.
 */

export const SITE_URL = 'https://cardona.digital'
export const SITE_NAME = 'Salvador Cardona'

type SeoInput = {
  title: string
  description: string
  /** Chemin absolu commençant par `/`, ex. `/blog`. */
  path: string
  type?: 'website' | 'article'
  publishedTime?: string
  /** Chemin absolu de l'image de partage, ex. `/blog/mon-article.jpg`. */
  image?: string
}

export function seo({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  image,
}: SeoInput) {
  const url = `${SITE_URL}${path}`
  const fullTitle = path === '/' ? title : `${title} — ${SITE_NAME}`

  const meta = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:creator', content: '@salvadevme' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
  ]

  if (image) {
    // Open Graph et Twitter exigent des URL absolues, y compris pour l'image.
    meta.push({ property: 'og:image', content: `${SITE_URL}${image}` })
    meta.push({ name: 'twitter:image', content: `${SITE_URL}${image}` })
  }

  if (publishedTime) {
    meta.push({ property: 'article:published_time', content: publishedTime })
  }

  return {
    meta,
    links: [{ rel: 'canonical', href: url }],
  }
}
