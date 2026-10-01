/**
 * Construction des balises <meta> pour `head()` des routes.
 *
 * `SITE_URL` doit être l'URL publique finale : elle sert aux URL canoniques et
 * aux cartes Open Graph, qui exigent des adresses absolues.
 */

export const SITE_URL = 'https://cardona.digital'
export const SITE_NAME = 'Agence Cardona'

/** Le fondateur, qui signe `/qui-suis-je` et les articles. */
export const AUTHOR_NAME = 'Salvador Cardona'

/** Identifiant stable de l'auteur dans les données structurées. */
export const PERSON_ID = `${SITE_URL}/#person`

/** Identifiant stable de l'agence, décrite en entier sur l'accueil. */
export const AGENCY_ID = `${SITE_URL}/#agence`

type SeoInput = {
  title: string
  description: string
  /** Chemin absolu commençant par `/`, ex. `/blog`. */
  path: string
  type?: 'website' | 'article'
  publishedTime?: string
  /** Chemin absolu de l'image de partage, ex. `/blog/mon-article.jpg`. */
  image?: string
  /** Données structurées schema.org, un objet par bloc `<script>`. */
  jsonLd?: Array<Record<string, unknown>>
  /** Qui signe le titre : l'agence, sauf les pages écrites par le fondateur. */
  signature?: string
}

export function seo({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  image,
  jsonLd = [],
  signature = SITE_NAME,
}: SeoInput) {
  const url = `${SITE_URL}${path}`
  const fullTitle = path === '/' ? title : `${title} — ${signature}`

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

  // Open Graph et Twitter exigent des URL absolues, y compris pour l'image.
  // À défaut d'illustration propre à la page (les articles ont leur
  // couverture), la bannière de marque évite un partage sans image. Elle vient
  // de SalvadorCardona/brand-assets et est versionnée dans `public/`, le site
  // ne dépendant d'aucune ressource distante.
  const shareImage = image ?? '/banner.png'
  meta.push({ property: 'og:image', content: `${SITE_URL}${shareImage}` })
  meta.push({ name: 'twitter:image', content: `${SITE_URL}${shareImage}` })

  if (publishedTime) {
    meta.push({ property: 'article:published_time', content: publishedTime })
  }

  return {
    meta,
    links: [{ rel: 'canonical', href: url }],
    scripts: jsonLd.map((data) => ({
      type: 'application/ld+json',
      // `<` échappé : un `</script>` dans une chaîne fermerait le bloc.
      children: JSON.stringify(data).replace(/</g, '\\u003c'),
    })),
  }
}

/** L'auteur du site, tel que référencé par toutes les pages. */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR_NAME,
    url: SITE_URL,
    jobTitle: 'Fondateur de l’agence Cardona, Lead Dev IA',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lyon',
      addressCountry: 'FR',
    },
    knowsAbout: [
      'Symfony',
      'API Platform',
      'React',
      'TypeScript',
      'JSON-LD',
      'Sécurité applicative',
      'Agents LLM',
      'RAG',
      'OCR',
      'Whisper',
      'Docker',
      'AWS',
      'Formation IA',
      'Claude Code',
      'MCP',
      'Ollama',
      'n8n',
      'Python',
    ],
    sameAs: [
      'https://github.com/SalvadorCardona',
      'https://www.linkedin.com/in/salvador-cardona-70911113a/',
      'https://x.com/salvadevme',
    ],
  }
}

/**
 * L'agence, en version courte, pour les pages qui la citent sans la décrire :
 * prestataire d'un `Service`, entreprise de `/services`.
 */
export function agencyJsonLd() {
  return {
    '@type': 'ProfessionalService',
    '@id': AGENCY_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    founder: { '@id': PERSON_ID },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lyon',
      addressCountry: 'FR',
    },
    areaServed: 'France',
  }
}

/** Fil d'Ariane, pour les pages sous `/services`. */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
