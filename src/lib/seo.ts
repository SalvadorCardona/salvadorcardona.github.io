import type { AgencyOffer } from '../content/agency'

/**
 * Construction des balises <meta> pour `head()` des routes.
 *
 * `SITE_URL` doit être l'URL publique finale : elle sert aux URL canoniques et
 * aux cartes Open Graph, qui exigent des adresses absolues.
 */

export const SITE_URL = 'https://hermez.dev'
export const SITE_NAME = 'Agence Hermez'

/** L'auteur des articles du blog. */
export const AUTHOR_NAME = 'Salvador Cardona'

/** Identifiant stable de l'auteur dans les données structurées. */
export const PERSON_ID = `${SITE_URL}/#person`

/** Identifiant stable de l'agence, décrite en entier sur l'accueil. */
export const AGENCY_ID = `${SITE_URL}/#agence`

/** Image de partage : chemin absolu commençant par `/`, dimensions en pixels. */
export type ShareImage = {
  src: string
  alt: string
  width: number
  height: number
}

/**
 * L'image de partage par défaut, au format des aperçus LinkedIn (1,91:1) :
 * rien n'est rogné. Les pages service ont la leur (`serviceHead`), les
 * articles leur couverture.
 */
const DEFAULT_SHARE_IMAGE: ShareImage = {
  src: '/og/cardona.png',
  alt: 'Hermez, agence digitale à Lyon : sites vitrines, applications métier, intégration IA',
  width: 1200,
  height: 630,
}

type SeoInput = {
  title: string
  description: string
  /** Chemin absolu commençant par `/`, ex. `/blog`. */
  path: string
  type?: 'website' | 'article'
  publishedTime?: string
  /** Image de partage propre à la page, ex. la couverture d'un article. */
  image?: ShareImage
  /** Données structurées schema.org, un objet par bloc `<script>`. */
  jsonLd?: Array<Record<string, unknown>>
  /** Qui signe le titre : l'agence, sauf les pages d'un auteur précis. */
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
  // À défaut d'illustration propre à la page, l'image de l'agence évite un
  // partage sans image. Les dimensions évitent à LinkedIn de deviner le
  // cadrage avant d'avoir téléchargé le fichier.
  const shareImage = image ?? DEFAULT_SHARE_IMAGE
  const shareImageUrl = `${SITE_URL}${shareImage.src}`
  meta.push(
    { property: 'og:image', content: shareImageUrl },
    { property: 'og:image:width', content: String(shareImage.width) },
    { property: 'og:image:height', content: String(shareImage.height) },
    { property: 'og:image:alt', content: shareImage.alt },
    { name: 'twitter:image', content: shareImageUrl },
    { name: 'twitter:image:alt', content: shareImage.alt },
  )

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
    jobTitle: 'Lead Dev IA, agence Hermez',
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
      'https://www.instagram.com/salvadorcardona81/',
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
    logo: `${SITE_URL}/logo.png`,
    email: 'contact@hermez.dev',
    founder: { '@id': PERSON_ID },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lyon',
      addressCountry: 'FR',
    },
    // La même zone que sur l'accueil : Lyon et sa métropole d'abord.
    areaServed: [
      { '@type': 'City', name: 'Lyon' },
      { '@type': 'AdministrativeArea', name: 'Métropole de Lyon' },
      { '@type': 'Country', name: 'France' },
    ],
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

/**
 * Un abonnement de l'agence en `Offer`, au mois et hors taxes. Partagé par
 * l'accueil et par `/site-internet-abonnement-mensuel`.
 */
export function offerJsonLd(offer: AgencyOffer) {
  return {
    '@type': 'Offer',
    name: `${offer.name} — agence Hermez`,
    description: offer.tagline,
    url: `${SITE_URL}/#${offer.id}`,
    availability: 'https://schema.org/InStock',
    seller: { '@id': AGENCY_ID },
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: offer.price,
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
      // Un prix au mois : sans `referenceQuantity`, Google lirait 30 €
      // une bonne fois pour toutes.
      referenceQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'MON',
      },
    },
  }
}
